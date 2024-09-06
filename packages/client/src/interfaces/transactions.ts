import type { Transaction } from '@near-js/transactions';

import type { TransactionComposer } from '../transactions';
import type { Dependent, RpcProviderDependency, SignerDependency } from './dependencies';
import type { RpcProviderQueryParams } from './view';

export interface SignAndSendTransactionDependency extends Dependent<RpcProviderDependency & SignerDependency> {}

export interface SignAndSendParams extends SignAndSendTransactionDependency, RpcProviderQueryParams {}

export interface ExternalActionTransaction extends SignAndSendParams {
  receiver: string;
  sender: string;
}

export interface ReflexiveActionTransaction extends SignAndSendParams {
  account: string;
}

export interface SignAndSendComposerParams extends SignAndSendParams, RpcProviderQueryParams {
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

export interface StakeParams extends ReflexiveActionTransaction {
  amount: bigint;
  publicKey: string;
}

export interface DeleteAccountParams extends ReflexiveActionTransaction {
  beneficiaryId: string;
}

export interface DeployContractParams extends ReflexiveActionTransaction {
  code: Uint8Array
}

interface AddAccessKeyParams extends ReflexiveActionTransaction {
  publicKey: string;
}

export interface ModifyAccessKeyParams extends AddAccessKeyParams {}

export interface AddFunctionCallAccessKeyParams extends AddAccessKeyParams {
  contract: string;
  methodNames: string[];
  allowance?: bigint;
}

export interface CreateAccountParams extends SignAndSendParams {
  account: string;
  initialBalance: bigint;
  newAccount: string;
  newPublicKey: string;
}

export interface CreateTopLevelAccountParams extends CreateAccountParams {
  contract: string
}

export interface SignTransactionParams extends Dependent<SignerDependency> {
  transaction: Transaction;
}
