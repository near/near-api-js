import { KeyPair, KeyPairString, PublicKey } from '@near-js/crypto';
import { KeyStore } from '@near-js/keystores';
import { InMemorySigner } from '@near-js/signers';

import type { MessageSigner } from './interfaces';

export function getSignerFromKeyPair(keyPair: KeyPair): MessageSigner {
  return {
    getPublicKey(): Promise<PublicKey> {
      return Promise.resolve(keyPair.getPublicKey());
    },
    async signMessage(m: Uint8Array): Promise<Uint8Array> {
      return keyPair.sign(m).signature;
    }
  }
}

export function getSignerFromPrivateKey(privateKey: KeyPairString): MessageSigner {
  return getSignerFromKeyPair(KeyPair.fromString(privateKey))
}

export async function getSignerFromKeyStore(accountId: string, network: string, keyStore: KeyStore): Promise<MessageSigner> {
  const signer = new InMemorySigner(keyStore);

  return {
    getPublicKey(): Promise<PublicKey> {
      return signer.getPublicKey(accountId, network);
    },
    async signMessage(m: Uint8Array): Promise<Uint8Array> {
      const { signature } = await signer.signMessage(m, accountId, network);
      return signature;
    }
  }
}
