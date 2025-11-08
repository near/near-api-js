import type { Transaction } from '@near-js/transactions';

import type { TransactionComposer } from '../transactions/index.js';
import type { SignAndSendTransactionDependency, SignerDependency } from './dependencies.js';
import type { RpcProviderQueryParams } from './view.js';
import { BlockHash } from '@near-js/types';
import { PublicKey } from '@near-js/crypto';

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

export interface SignTransactionParams extends SignerDependency {
  transaction: Transaction;
}

export interface NewAccountParams {
  newAccount: string;
  newPublicKey: string;
}

export interface CreateAccountParams extends SignAndSendParams, NewAccountParams {
  account: string;
  initialBalance: bigint;
}

export interface CreateTopLevelAccountParams extends CreateAccountParams {
  contract: string
}

export interface TransactionOptions {
  blockHash?: BlockHash;
  nonce?: bigint;
  publicKey?: PublicKey;
  receiver?: string;
  sender?: string;
}

export interface MetaTransactionOptions extends TransactionOptions {
  blockHeightTtl?: bigint;
  maxBlockHeight?: bigint;
}

export interface SignedTransactionOptions extends TransactionOptions, SignAndSendTransactionDependency {
}

