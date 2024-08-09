import type {
  BlockReference,
  BlockResult,
  FinalExecutionOutcome,
  QueryResponseKind,
} from '@near-js/types';
import type { SignedTransaction } from '@near-js/transactions';
import type { PublicKey } from '@near-js/crypto';

export interface Dependent<T> {
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

export interface RpcProviderDependency {
  rpcProvider: RpcQueryProvider;
}

export interface SignerDependency {
  signer: MessageSigner;
}
