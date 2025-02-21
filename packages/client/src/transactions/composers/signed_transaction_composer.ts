import { buildDelegateAction, signDelegateAction } from '@near-js/transactions';
import type { BlockReference, SerializedReturnValue } from '@near-js/types';
import { getTransactionLastResult } from '@near-js/utils';

import { DEFAULT_META_TRANSACTION_BLOCK_HEIGHT_TTL } from '../../constants';
import type {
    AccessKeySigner,
    MessageSigner,
    MetaTransactionOptions,
    RpcQueryProvider,
    SignedTransactionOptions,
    TransactionOptions,
} from '../../interfaces';
import { getAccessKeySigner } from '../../signing/signers';
import { signTransaction } from '../sign_and_send';
import { TransactionComposer } from './transaction_composer';

export class SignedTransactionComposer extends TransactionComposer {
    messageSigner: MessageSigner;
    rpcProvider: RpcQueryProvider;
    signer: AccessKeySigner;

    constructor({ deps, ...baseOptions }: SignedTransactionOptions) {
        super(baseOptions);
        this.messageSigner = deps.signer;
        this.rpcProvider = deps.rpcProvider;
        if (this.sender) {
            this.signer = getAccessKeySigner({ account: this.sender, deps });
        }
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
            const { header } = await this.rpcProvider.block({ finality: 'final' });
            const ttl = transaction?.blockHeightTtl || DEFAULT_META_TRANSACTION_BLOCK_HEIGHT_TTL;
            maxBlockHeight = BigInt(header.height) + ttl;
        }

        const delegateAction = buildDelegateAction({
            actions: this.actions,
            maxBlockHeight,
            nonce: transaction?.nonce || this.nonce || (await this.signer.getNonce()),
            publicKey: transaction?.publicKey || this.publicKey || (await this.signer.getPublicKey()),
            receiverId: transaction?.receiver || this.receiver,
            senderId: transaction?.sender || this.sender,
        });

        const { signedDelegateAction } = await signDelegateAction({
            delegateAction,
            signer: { sign: (m) => this.signer.signMessage(m) },
        });

        return signedDelegateAction;
    }

    /**
     * Verify the transaction's signer matches the account mapped to the AccessKeySigner.
     *  Initialize the signer if not already done (i.e. for lazy setting of the transaction signer).
     *  Throw an error if there is a mismatch between the current AccessKeySigner and the transaction's specified signer.
     * @param signingAccount
     * @private
     */
    private verifySigner(signingAccount: string) {
        if (!this.signer) {
            this.signer = getAccessKeySigner({
                account: signingAccount,
                deps: { rpcProvider: this.rpcProvider, signer: this.messageSigner },
            });
        }

        const signerAccount = this.signer.getSigningAccount();
        if (signingAccount !== signerAccount) {
            throw new Error(`Cannot sign transaction as ${signingAccount} with AccessKeySigner for ${signerAccount}`);
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
            deps: { signer: this.signer },
        });
    }

    /**
     * Sign and send the composed transaction
     * @param blockReference block to use for determining hash
     */
    async signAndSend<T extends SerializedReturnValue>(blockReference: BlockReference = { finality: 'final' }) {
        this.verifySigner(this.sender);
        const { signedTransaction } = await this.toSignedTransaction({
            nonce: this.nonce || (await this.signer.getNonce()),
            publicKey: this.publicKey || (await this.signer.getPublicKey()),
            blockHash: this.blockHash || (await this.rpcProvider.block(blockReference))?.header?.hash,
        });

        const outcome = await this.rpcProvider.sendTransaction(signedTransaction);
        return {
            outcome,
            result: getTransactionLastResult(outcome) as T,
        };
    }
}
