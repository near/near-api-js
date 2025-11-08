import type { BlockReference, SerializedReturnValue } from '@near-js/types';
import { getTransactionLastResult } from '@near-js/utils';

import { DEFAULT_META_TRANSACTION_BLOCK_HEIGHT_TTL } from '../../constants.js';
import {
    MetaTransactionOptions,
    SignedTransactionOptions,
    TransactionOptions,
} from '../../interfaces/index.js';
import { signTransaction } from '../sign_and_send.js';
import { TransactionComposer } from './transaction_composer.js';
import { Account } from '@near-js/accounts';

export class SignedTransactionComposer extends TransactionComposer {
    account: Account;

    constructor({ deps, ...baseOptions }: SignedTransactionOptions) {
        super(baseOptions);
        this.account = new Account(this.sender, deps.rpcProvider, deps.signer);
    }

    /**
   * Initialize the composer
   * @param options signed composer configuration
   */
    static init(options: SignedTransactionOptions) {
        return new SignedTransactionComposer(options);
    }

    /**
   * Return a signed delegate action encapsulating the composed transaction for inclusion in a meta transaction
   * @param transaction meta transaction configuration
   */
    async toSignedDelegateAction(transaction?: MetaTransactionOptions) {
        let maxBlockHeight = transaction?.maxBlockHeight;
        if (!maxBlockHeight) {
            const { header } = await this.account.provider.viewBlock({ finality: 'optimistic' });
            const ttl = transaction?.blockHeightTtl || DEFAULT_META_TRANSACTION_BLOCK_HEIGHT_TTL;
            maxBlockHeight = BigInt(header.height) + ttl;
        }

        return this.account.signedDelegate({
            actions: this.actions,
            receiverId: transaction?.receiver || this.receiver,
            blockHeightTtl: Number(maxBlockHeight)
        });
    }

    /**
   * Verify the transaction's signer matches the account mapped to the AccessKeySigner.
   *  Initialize the signer if not already done (i.e. for lazy setting of the transaction signer).
   *  Throw an error if there is a mismatch between the current AccessKeySigner and the transaction's specified signer.
   * @param signingAccount
   * @private
   */
    private verifySigner(signingAccount: string) {
        if (signingAccount !== this.account.accountId) {
            throw new Error(`Cannot sign transaction as ${signingAccount} with Account for ${this.account.accountId}`);
        }
    }

    /**
   * Return a signed transaction from the composed transaction
   * @param transactionOptions transaction configuration to override values set at composer initialization
   */
    async toSignedTransaction(transactionOptions?: TransactionOptions) {
        const transaction = this.toTransaction(transactionOptions);
        this.verifySigner(transaction.signerId);
        return signTransaction({
            transaction,
            deps: { signer: this.account.getSigner() },
        });
    }

    /**
   * Sign and send the composed transaction
   * @param blockReference block to use for determining hash
   */
    async signAndSend<T extends SerializedReturnValue>(blockReference: BlockReference = { finality: 'optimistic' }) {
        this.verifySigner(this.sender);
        const { signedTransaction } = await this.toSignedTransaction({
            publicKey: this.publicKey || await this.account.getSigner().getPublicKey(),
            blockHash: this.blockHash || (await this.account.provider.viewBlock(blockReference))?.header?.hash,
        });

        const outcome = await this.account.provider.sendTransaction(signedTransaction);
        return {
            outcome,
            result: getTransactionLastResult(outcome) as T,
        };
    }
}
