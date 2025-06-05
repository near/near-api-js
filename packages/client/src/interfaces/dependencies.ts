import { Provider } from '@near-js/providers';
import { Signer } from '@near-js/signers';

interface Dependent<T> {
  deps: T;
}

interface RpcProviderDependent {
  rpcProvider: Provider;
}

interface SignerDependent {
  signer: Signer;
}

export interface RpcProviderDependency extends Dependent<RpcProviderDependent> {}

export interface SignerDependency extends Dependent<SignerDependent> {}

export interface SignAndSendTransactionDependency extends Dependent<RpcProviderDependent & SignerDependent> {}
