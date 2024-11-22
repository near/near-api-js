import { MessageSigner, RpcQueryProvider } from '@near-js/client';
import { KeyStore } from '@near-js/keystores';
import { createContext } from 'react';

interface RpcContextOptions {
  network: string;
  provider: RpcQueryProvider;
}

interface SigningContextOptions {
  signer: MessageSigner;
}

interface KeystoreSigningContextOptions extends SigningContextOptions {
  keystore: KeyStore;
}

export const RpcContext = createContext<RpcContextOptions>(null);

export const SigningContext = createContext<SigningContextOptions>(null);

export const KeystoreSigningContext = createContext<KeystoreSigningContextOptions>(null);

export const SignAndSendContext = createContext<RpcContextOptions & SigningContextOptions>(null);
