import type { PublicKey } from '@near-js/crypto';

import type { RpcQueryProvider } from './providers';

interface Dependent<T> {
  deps: T;
}

export interface MessageSigner {
  getPublicKey(): Promise<PublicKey>;
  signMessage(m: Uint8Array): Promise<Uint8Array>;
}

interface RpcProviderDependent {
  rpcProvider: RpcQueryProvider;
}

interface SignerDependent {
  signer: MessageSigner;
}

export interface RpcProviderDependency extends Dependent<RpcProviderDependent> {}

export interface SignerDependency extends Dependent<SignerDependent> {}

export interface SignAndSendTransactionDependency extends Dependent<RpcProviderDependent & SignerDependent> {}
