import {
  KeyPair,
  type KeyPairString,
  type PublicKey,
} from '@near-js/crypto';
import { KeyStore } from '@near-js/keystores';
import { InMemorySigner } from '@near-js/signers';

import type { MessageSigner } from '../interfaces';

export function getSignerFromKeyPair(keyPair: KeyPair): MessageSigner {
  return {
    async getPublicKey(): Promise<PublicKey> {
      return keyPair.getPublicKey();
    },
    async signMessage(m: Uint8Array): Promise<Uint8Array> {
      return keyPair.sign(m).signature;
    }
  };
}

export function getSignerFromPrivateKey(privateKey: KeyPairString): MessageSigner {
  return getSignerFromKeyPair(KeyPair.fromString(privateKey));
}

export function getSignerFromKeystore(account: string, network: string, keyStore: KeyStore): MessageSigner {
  const signer = new InMemorySigner(keyStore);

  return {
    async getPublicKey(): Promise<PublicKey> {
      return signer.getPublicKey(account, network);
    },
    async signMessage(m: Uint8Array): Promise<Uint8Array> {
      const { signature } = await signer.signMessage(m, account, network);
      return signature;
    }
  };
}
