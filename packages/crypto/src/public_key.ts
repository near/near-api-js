import { baseEncode, baseDecode } from '@near-js/utils';
import { ed25519 } from '@noble/curves/ed25519';
import secp256k1 from 'secp256k1';

import { KeySize, KeyType } from './constants.js';

function keyTypeToStr(keyType: KeyType): string {
  switch (keyType) {
    case KeyType.ED25519:
      return 'ed25519';
    case KeyType.SECP256K1:
      return 'secp256k1';
    default:
      throw new Error(`Unknown key type ${keyType}`);
  }
}

function strToKeyType(keyType: string): KeyType {
  switch (keyType.toLowerCase()) {
    case 'ed25519':
      return KeyType.ED25519;
    case 'secp256k1':
      return KeyType.SECP256K1;
    default:
      throw new Error(`Unknown key type ${keyType}`);
  }
}

interface ED25519PublicKey {
  keyType: KeyType.ED25519;
  data: Uint8Array;

  verify?: (message: Uint8Array, signature: Uint8Array) => boolean;
}

interface SECP256K1PublicKey {
  keyType: KeyType.SECP256K1;
  data: Uint8Array;

  verify?: (message: Uint8Array, signature: Uint8Array) => boolean;
}

export type PublicKey = ED25519PublicKey | SECP256K1PublicKey;

/**
 * Creates a PublicKey instance from a string or an existing PublicKey instance.
 * @param value The string or PublicKey instance to create a PublicKey from.
 * @returns {PublicKey} The PublicKey instance.
 */
export function publicKeyFrom(value: string | PublicKey): PublicKey {
  if (typeof value === 'string') {
    return publicKeyFromString(value);
  }
  return value;
}

/**
 * Creates a PublicKey instance from an encoded key string.
 * @param encodedKey The encoded key string.
 * @returns {PublicKey} The PublicKey instance created from the encoded key string.
 */
export function publicKeyFromString(encodedKey: string): PublicKey {
  const parts = encodedKey.split(':');
  let publicKeyPart: string;
  let keyType: KeyType | undefined;

  if (parts.length === 1) {
    publicKeyPart = parts[0];
  } else if (parts.length === 2) {
    keyType = strToKeyType(parts[0]);
    publicKeyPart = parts[1];
  } else {
    throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
  }

  const decodedPublicKey = baseDecode(publicKeyPart);
  if (!keyType) {
    keyType =
      decodedPublicKey.length === KeySize.SECP256k1_PUBLIC_KEY
        ? KeyType.SECP256K1
        : KeyType.ED25519;
  }

  const expectedKeySize =
    keyType === KeyType.ED25519 ? KeySize.ED25519_PUBLIC_KEY : KeySize.SECP256k1_PUBLIC_KEY;

  if (decodedPublicKey.length !== expectedKeySize) {
    throw new Error(
      `Invalid public key size (${decodedPublicKey.length}), must be ${expectedKeySize}`
    );
  }

  return { keyType, data: decodedPublicKey };
}

/**
 * Returns a string representation of the public key.
 * @param publicKey The PublicKey instance.
 * @returns {string} The string representation of the public key.
 */
export function publicKeyToString(publicKey: PublicKey): string {
  const encodedKey = baseEncode(publicKey.data);
  return `${keyTypeToStr(publicKey.keyType)}:${encodedKey}`;
}

/**
 * Verifies a message signature using the public key.
 * @param publicKey The PublicKey instance.
 * @param message The message to be verified.
 * @param signature The signature to be verified.
 * @returns {boolean} `true` if the signature is valid, otherwise `false`.
 */
export function verifySignature(
  publicKey: PublicKey,
  message: Uint8Array,
  signature: Uint8Array
): boolean {
  const { keyType, data } = publicKey;
  switch (keyType) {
    case KeyType.ED25519:
      return ed25519.verify(signature, message, data);
    case KeyType.SECP256K1:
      return secp256k1.ecdsaVerify(
        signature.subarray(0, 64),
        message,
        new Uint8Array([0x04, ...data])
      );
    default:
      throw new Error(`Unknown key type: ${keyType}`);
  }
}
