import { PublicKey } from '@near-js/crypto';
import {
  Action,
  actionCreators,
  buildDelegateAction,
  DelegateAction,
  Signature,
  Transaction,
} from '@near-js/transactions';
import { baseDecode, DEFAULT_FUNCTION_CALL_GAS, getTransactionLastResult } from '@near-js/utils';
import { DEFAULT_META_TRANSACTION_BLOCK_HEIGHT_TTL } from '../constants';
import { BlockHeader, BlockReference } from '@near-js/types';
import { MessageSigner, RpcQueryProvider, SignAndSendTransactionDependency } from '../interfaces';
import { getSignerNonce, signTransaction } from './sign_and_send';

interface TransactionOptions {
  blockHeader?: BlockHeader;
  nonce?: bigint;
  publicKey?: PublicKey;
  receiver?: string;
  sender?: string;
}

interface SignedTransactionOptions extends TransactionOptions, SignAndSendTransactionDependency {
}

export class TransactionComposer {
  private actions: Action[] = [];
  receiver: string | undefined;
  sender: string | undefined;
  blockHeader: BlockHeader | undefined;
  nonce: bigint | undefined;
  publicKey: PublicKey | undefined;

  constructor(transaction: TransactionOptions) {
    this.receiver = transaction.receiver;
    this.sender = transaction.sender;
    this.blockHeader = transaction.blockHeader;
    this.nonce = transaction.nonce;
    this.publicKey = transaction.publicKey;
  }

  static init(transaction: TransactionOptions) {
    return new TransactionComposer(transaction);
  }

  private buildTransactionObject(transaction?: TransactionOptions) {
    const tx = {
      actions: this.actions,
      blockHash: baseDecode(transaction?.blockHeader?.hash || this.blockHeader?.hash),
      nonce: transaction?.nonce || this.nonce,
      publicKey: transaction?.publicKey || this.publicKey,
      receiverId: transaction?.receiver || this.receiver,
      signerId: transaction?.sender || this.sender,
    };

    if (!tx.actions.length || !tx.blockHash || !tx.nonce || !tx.publicKey || !tx.receiverId || !tx.signerId) {
      throw new Error(`invalid transaction: ${JSON.stringify(tx)}`);
    }

    return tx;
  }

  toTransaction(transaction?: TransactionOptions): Transaction {
    return new Transaction(this.buildTransactionObject(transaction));
  }

  toDelegateAction(transaction?: TransactionOptions): DelegateAction {
    const { actions, nonce, publicKey, receiverId, signerId } = this.buildTransactionObject(transaction);
    const blockHeader = transaction?.blockHeader || this.blockHeader;

    return buildDelegateAction({
      actions,
      maxBlockHeight: BigInt(blockHeader!.height) + DEFAULT_META_TRANSACTION_BLOCK_HEIGHT_TTL,
      nonce: BigInt(nonce) + BigInt(1),
      publicKey,
      receiverId,
      senderId: signerId,
    });
  }

  addFullAccessKey(publicKey: string): this {
    this.actions.push(actionCreators.addKey(PublicKey.from(publicKey), actionCreators.fullAccessKey()));
    return this;
  }

  addFunctionCallAccessKey(publicKey: string, contractId: string, methodNames: string[], allowance?: bigint): this {
    const accessKey = actionCreators.functionCallAccessKey(contractId, methodNames, allowance);
    this.actions.push(actionCreators.addKey(PublicKey.from(publicKey), accessKey));
    return this;
  }

  createAccount(): this {
    this.actions.push(actionCreators.createAccount());
    return this;
  }

  deleteAccount(beneficiaryId: string): this {
    this.actions.push(actionCreators.deleteAccount(beneficiaryId));
    return this;
  }

  deleteKey(publicKey: string): this {
    this.actions.push(actionCreators.deleteKey(PublicKey.from(publicKey)));
    return this;
  }

  deployContract(code: Uint8Array): this {
    this.actions.push(actionCreators.deployContract(code));
    return this;
  }

  functionCall(method: string, args: object, gas: bigint = DEFAULT_FUNCTION_CALL_GAS * BigInt(10), deposit = BigInt(0)): this {
    this.actions.push(actionCreators.functionCall(method, args, gas, deposit));
    return this;
  }

  signedDelegate(delegateAction: DelegateAction, signature: Signature): this {
    this.actions.push(actionCreators.signedDelegate({ delegateAction, signature }));
    return this;
  }

  stake(stake: bigint, publicKey: string): this {
    this.actions.push(actionCreators.stake(stake, PublicKey.from(publicKey)));
    return this;
  }

  transfer(deposit: bigint): this {
    this.actions.push(actionCreators.transfer(deposit));
    return this;
  }
}

export class SignedTransactionComposer extends TransactionComposer {
  rpcProvider: RpcQueryProvider;
  signer: MessageSigner;

  constructor({ deps, ...baseOptions }: SignedTransactionOptions) {
    super(baseOptions);
    this.rpcProvider = deps.rpcProvider;
    this.signer = deps.signer;
  }

  static init(options: SignedTransactionOptions) {
    return new SignedTransactionComposer(options);
  }

  async toSignedTransaction(transaction?: TransactionOptions) {
    return signTransaction({
      transaction: this.toTransaction(transaction),
      deps: { signer: this.signer },
    });
  }

  async signAndSend(blockReference: BlockReference = { finality: 'final' }) {
    const deps = { rpcProvider: this.rpcProvider, signer: this.signer };
    const blockHeader = this.blockHeader || (await this.rpcProvider.block(blockReference))?.header;
    const signerNonce = this.nonce || (await getSignerNonce({ account: this.sender, blockReference, deps }) + 1n);

    const { signedTransaction } = await this.toSignedTransaction({
      nonce: signerNonce,
      publicKey: this.publicKey || await this.signer.getPublicKey(),
      blockHeader,
    });

    const outcome = await this.rpcProvider.sendTransaction(signedTransaction);
    return {
      outcome,
      result: getTransactionLastResult(outcome),
    };
  }
}
