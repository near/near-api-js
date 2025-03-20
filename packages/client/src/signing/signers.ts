import {
  KeyPair,
  type KeyPairString,
} from '@near-js/crypto';
import { KeyStore } from '@near-js/keystores';
import { InMemorySigner } from '@near-js/signers';

import type {
  AccessKeySigner,
  FullAccessKey,
  FunctionCallAccessKey,
  MessageSigner,
  SignerDependency,
  ViewAccountParams,
} from '../interfaces';
import { getAccessKey } from '../view';

/**
 * Initialize a message signer from a KeyPair
 * @param keyPair used to sign transactions
 */
export function getSignerFromKeyPair(keyPair: KeyPair): MessageSigner {
  return {
    async getPublicKey() {
      return keyPair.getPublicKey();
    },
    async signMessage(m) {
      return keyPair.sign(m).signature;
    }
  };
}

/**
 * Initialize a message singer from a private key string
 * @param privateKey string representation of the private key used to sign transactions
 */
export function getSignerFromPrivateKey(privateKey: KeyPairString): MessageSigner {
  return getSignerFromKeyPair(KeyPair.fromString(privateKey));
}

/**
 * Initialize a message signer from a keystore instance
 * @param account used to sign transactions
 * @param network to sign transactions on
 * @param keyStore used to store the signing key
 */
export function getSignerFromKeystore(account: string, network: string, keyStore: KeyStore): MessageSigner {
  const signer = new InMemorySigner(keyStore);

  return {
    async getPublicKey() {
      return signer.getPublicKey(account, network);
    },
    async signMessage(m) {
      const { signature } = await signer.signMessage(m, account, network);
      return signature;
    }
  };
}

/**
 * Initialize a signer that caches the access key and increments the nonce
 * @param account access key owner
 * @param rpcProvider RPC provider instance
 * @param deps sign-and-send dependencies
 */
export function getAccessKeySigner({ account, blockReference, deps: { rpcProvider, signer } }: ViewAccountParams & SignerDependency): AccessKeySigner {
  let accessKey: FullAccessKey | FunctionCallAccessKey;
  let nonce: bigint | undefined;

  return {
    async getAccessKey(ignoreCache = false) {
      if (!accessKey || ignoreCache) {
        accessKey = await getAccessKey({
          account,
          blockReference: blockReference || { finality: 'optimistic' },
          publicKey: (await signer.getPublicKey()).toString(),
          deps: { rpcProvider },
        });

        nonce = accessKey.nonce + 1n;
      }

      return accessKey;
    },
    async getNonce(ignoreCache = false) {
      if (!nonce || ignoreCache) {
        await this.getAccessKey(true);
      }

      return nonce;
    },
    getPublicKey() {
      return signer.getPublicKey();
    },
    getSigningAccount() {
      return account;
    },
    signMessage(m: Uint8Array) {
      // Nonce can be uninitialized here if it is provided explicitly by developer (see toSignedDelegateAction),
      // we don't need to track it here in that case.
      if (nonce) {
        nonce += 1n;
      }
      return signer.signMessage(m);
    }
  };
}
