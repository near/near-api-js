import type { PublicKey } from '@near-js/crypto';

import type { RpcQueryProvider } from './providers';

export interface Dependent<T> {
  deps: T;
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
