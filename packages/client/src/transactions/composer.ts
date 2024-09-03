import { PublicKey } from '@near-js/crypto';
import {
  Action,
  actionCreators,
  buildDelegateAction,
  DelegateAction,
  Signature,
  Transaction,
} from '@near-js/transactions';
import { baseDecode, DEFAULT_FUNCTION_CALL_GAS } from '@near-js/utils';
import { DEFAULT_META_TRANSACTION_BLOCK_HEIGHT_TTL } from '../constants';
import { BlockHeader } from '@near-js/types';

interface TransactionOptions {
  blockHeader?: BlockHeader;
  nonce?: bigint;
  publicKey?: PublicKey;
  receiver?: string;
  sender?: string;
}

export class TransactionComposer {
  private actions: Action[] = [];
  receiver: string | undefined;
  sender: string | undefined;
  blockHeader: BlockHeader | undefined;
  nonce: bigint | undefined;
  publicKey: PublicKey | undefined;

  static init(transaction: TransactionOptions) {
    const composer = new TransactionComposer();
    composer.receiver = transaction.receiver;
    composer.sender = transaction.sender;
    composer.blockHeader = transaction.blockHeader;
    composer.nonce = transaction.nonce;
    composer.publicKey = transaction.publicKey;

    return composer;
  }

  private buildTransactionObject(transaction?: TransactionOptions) {
    const hash = (transaction?.blockHeader?.hash || this.blockHeader?.hash)!;
    return {
      actions: this.actions,
      blockHash: baseDecode(hash),
      nonce: (transaction?.nonce || this.nonce)!,
      publicKey: (transaction?.publicKey || this.publicKey)!,
      receiverId: (transaction?.receiver || this.receiver)!,
      signerId: (transaction?.sender || this.sender)!,
    };
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

  addFullAccessKey(publicKey: string) {
    this.actions.push(actionCreators.addKey(PublicKey.from(publicKey), actionCreators.fullAccessKey()));
    return this;
  }

  addFunctionCallAccessKey(publicKey: string, contractId: string, methodNames: string[], allowance?: bigint) {
    const accessKey = actionCreators.functionCallAccessKey(contractId, methodNames, allowance)
    this.actions.push(actionCreators.addKey(PublicKey.from(publicKey), accessKey));
    return this;
  }
    
  createAccount() {
    this.actions.push(actionCreators.createAccount());
    return this;
  }
    
  deleteAccount(beneficiaryId: string) {
    this.actions.push(actionCreators.deleteAccount(beneficiaryId));
    return this;
  }
    
  deleteKey(publicKey: string) {
    this.actions.push(actionCreators.deleteKey(PublicKey.from(publicKey)));
    return this;
  }
    
  deployContract(code: Uint8Array) {
    this.actions.push(actionCreators.deployContract(code));
    return this;
  }
    
  functionCall(method: string, args: object, gas: bigint = DEFAULT_FUNCTION_CALL_GAS * BigInt(10), deposit = BigInt(0)) {
    this.actions.push(actionCreators.functionCall(method, args, gas, deposit));
    return this;
  }
    
  signedDelegate(delegateAction: DelegateAction, signature: Signature) {
    this.actions.push(actionCreators.signedDelegate({ delegateAction, signature }));
    return this;
  }
    
  stake(stake: bigint, publicKey: string) {
    this.actions.push(actionCreators.stake(stake, PublicKey.from(publicKey)));
    return this;
  }
    
  transfer(deposit: bigint) {
    this.actions.push(actionCreators.transfer(deposit));
    return this;
  }
}
