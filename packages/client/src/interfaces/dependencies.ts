import type { PublicKey } from '@near-js/crypto';
import type { AccessKeyView } from '@near-js/types';

import type { RpcQueryProvider } from './providers';

interface Dependent<T> {
  deps: T;
}

export interface MessageSigner {
  getPublicKey(): Promise<PublicKey>;
  signMessage(m: Uint8Array): Promise<Uint8Array>;
}

export interface AccessKeySigner extends MessageSigner {
  getAccessKey(ignoreCache?: boolean): Promise<AccessKeyView>;
  getNonce(ignoreCache?: boolean): Promise<bigint>;
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
