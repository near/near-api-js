import type { Transaction } from '@near-js/transactions';

import type { TransactionComposer } from '../transactions';
import type { Dependent, RpcProviderDependency, SignerDependency } from './dependencies';
import type { RpcProviderQueryParams } from './view';
import { PublicKey } from '@near-js/crypto';

export interface SignAndSendTransactionDependency extends Dependent<RpcProviderDependency & SignerDependency> {}

export interface SignAndSendNonceParams extends SignAndSendTransactionDependency, RpcProviderQueryParams {
  nonce?: bigint;
}

export interface ExternalActionTransaction extends SignAndSendNonceParams {
  receiver: string;
  sender: string;
}

export interface SelfActionTransaction extends SignAndSendNonceParams {
  account: string;
}

export interface SignAndSendComposerParams extends SignAndSendNonceParams, RpcProviderQueryParams {
  composer: TransactionComposer;
}

export interface SignAndSendTransactionParams extends SignAndSendTransactionDependency {
  transaction: Transaction;
}

export interface FunctionCallParams<T = object> extends ExternalActionTransaction {
  method: string;
  args?: T;
  deposit?: bigint;
  gas?: bigint;
}

export interface TransferParams extends ExternalActionTransaction {
  amount: bigint;
}

interface AddAccessKeyParams extends SelfActionTransaction {
  publicKey: PublicKey;
}

export interface AddFullAccessKeyParams extends AddAccessKeyParams {}

export interface AddFunctionCallAccessKeyParams extends AddAccessKeyParams {
  contract: string;
  methodNames: string[];
  allowance?: bigint;
}

export interface SignTransactionParams extends Dependent<SignerDependency> {
  transaction: Transaction;
}
