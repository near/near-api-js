import {
  buildDelegateAction,
  signDelegateAction,
} from '@near-js/transactions';
import { getTransactionLastResult } from '@near-js/utils';
import { BlockReference } from '@near-js/types';

import { DEFAULT_META_TRANSACTION_BLOCK_HEIGHT_TTL } from '../../constants';
import {
  MessageSigner,
  MetaTransactionOptions,
  RpcQueryProvider,
  SignedTransactionOptions,
  TransactionOptions,
} from '../../interfaces';
import { getSignerNonce, signTransaction } from '../sign_and_send';
import { TransactionComposer } from './transaction_composer';
import { SerializedReturnValue } from '@near-js/types/lib/esm/provider/response';

export class SignedTransactionComposer extends TransactionComposer {
  rpcProvider: RpcQueryProvider;
  signer: MessageSigner;

  constructor({ deps, ...baseOptions }: SignedTransactionOptions) {
    super(baseOptions);
    this.rpcProvider = deps.rpcProvider;
    this.signer = deps.signer;
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

    let nonce = transaction?.nonce || this.nonce;
    if (!nonce) {
      nonce = await getSignerNonce({
        account: this.sender,
        deps: {
          rpcProvider: this.rpcProvider,
          signer: this.signer,
        },
      }) + 1n;
    }

    const delegateAction = buildDelegateAction({
      actions: this.actions,
      maxBlockHeight,
      nonce,
      publicKey: transaction?.publicKey || await this.signer.getPublicKey(),
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
   * Return a signed transaction from the composed transaction
   * @param transaction transaction configuration to override values set at composer initialization
   */
  async toSignedTransaction(transaction?: TransactionOptions) {
    return signTransaction({
      transaction: this.toTransaction(transaction),
      deps: { signer: this.signer },
    });
  }

  /**
   * Sign and send the composed transaction
   * @param blockReference block to use for determining hash
   */
  async signAndSend<T extends SerializedReturnValue>(blockReference: BlockReference = { finality: 'final' }) {
    const deps = { rpcProvider: this.rpcProvider, signer: this.signer };
    const blockHash = this.blockHash || (await this.rpcProvider.block(blockReference))?.header?.hash;
    const signerNonce = this.nonce || (await getSignerNonce({
      account: this.sender,
      blockReference: { finality: 'optimistic' },
      deps,
    }) + 1n);

    const { signedTransaction } = await this.toSignedTransaction({
      nonce: signerNonce,
      publicKey: this.publicKey || await this.signer.getPublicKey(),
      blockHash,
    });

    const outcome = await this.rpcProvider.sendTransaction(signedTransaction);
    return {
      outcome,
      result: getTransactionLastResult(outcome) as T,
    };
  }
}
