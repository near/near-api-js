import { KeyPair, type KeyPairString } from "@near-js/crypto";
import { KeyStore } from '@near-js/keystores';
import { KeyPairSigner, Signer } from "@near-js/signers";

/**
 * Initialize a message signer from a KeyPair
 * @param keyPair used to sign transactions
 */
export function getSignerFromKeyPair(keyPair: KeyPair): Signer {
  return new KeyPairSigner(keyPair);
}

/**
 * Initialize a message singer from a private key string
 * @param privateKey string representation of the private key used to sign transactions
 */
export function getSignerFromPrivateKey(
  privateKey: KeyPairString
): Signer {
  return KeyPairSigner.fromSecretKey(privateKey);
}

/**
 * Initialize a message signer from a keystore instance
 * @param account used to sign transactions
 * @param network to sign transactions on
 * @param keyStore used to store the signing key
 */
export async function getSignerFromKeystore(account: string, network: string, keyStore: KeyStore): Promise<Signer> {
  const keyPair = await keyStore.getKey(network, account);
  return new KeyPairSigner(keyPair);
}
