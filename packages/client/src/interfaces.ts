import type {
  BlockReference,
  BlockResult,
  FinalExecutionOutcome,
  QueryResponseKind,
} from '@near-js/types';
import type { SignedTransaction } from '@near-js/transactions';
import type { PublicKey } from '@near-js/crypto';
import type { Transaction } from '@near-js/transactions';

import type { TransactionComposer } from './transactions';

interface Dependent<T> {
  deps: T;
}

export interface RpcQueryProvider {
  block(block: BlockReference): Promise<BlockResult>;
  query<T extends QueryResponseKind>(...args: any[]): Promise<T>;
  sendTransaction(transaction: SignedTransaction): Promise<FinalExecutionOutcome>;
}

export interface MessageSigner {
  getPublicKey(): Promise<PublicKey>;
  signMessage(m: Uint8Array): Promise<Uint8Array>;
}

interface RpcProviderDependency {
  rpcProvider: RpcQueryProvider;
}

interface SignerDependency {
  signer: MessageSigner;
}

interface RpcProviderQueryParams {
  blockReference?: BlockReference;
}

interface RpcProviderTransactionParams extends RpcProviderQueryParams {
  receiver: string;
  sender: string;
}

export interface ViewBaseParams extends Dependent<RpcProviderDependency>, RpcProviderQueryParams {
}

export interface ViewAccountParams extends ViewBaseParams {
  account: string;
}

export interface ViewParams<T = object> extends ViewAccountParams {
  method: string;
  args?: T;
}

export interface ViewContractStateParams extends ViewAccountParams {
  prefix: string | Uint8Array;
}

export interface ViewAccessKeyParams extends ViewAccountParams {
  publicKey: string;
}

export interface SignAndSendTransactionDependency extends Dependent<RpcProviderDependency & SignerDependency> {}

export interface SignAndSendNonceParams extends SignAndSendTransactionDependency {
  nonce?: bigint;
}

export interface SignAndSendComposerParams extends SignAndSendNonceParams, RpcProviderQueryParams {
  composer: TransactionComposer;
}

export interface SignAndSendTransactionParams extends SignAndSendTransactionDependency {
  transaction: Transaction;
}

export interface CallParams<T = object> extends SignAndSendNonceParams, RpcProviderTransactionParams {
  method: string;
  args?: T;
  deposit?: bigint;
  gas?: bigint;
}

export interface SendParams extends SignAndSendNonceParams, RpcProviderTransactionParams {
  amount: bigint;
}

export interface SignTransactionParams extends Dependent<SignerDependency> {
  transaction: Transaction;
}
