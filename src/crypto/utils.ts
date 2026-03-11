import { ed25519 } from '@noble/curves/ed25519.js';
import { secp256k1 } from '@noble/curves/secp256k1.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { baseDecode, baseEncode } from '../utils/format.js';

import type { KeyPairString } from './constants.js';

export { sha256 };

export type KeyCurve = 'ed25519' | 'secp256k1';

/**
 * Extract the curve type from a key string like "ed25519:..." or "secp256k1:..."
 * Defaults to ed25519 if no prefix is present.
 */
export function curveFromKey(key: string): KeyCurve {
    if (!key.includes(':')) return 'ed25519';
    const curve = key.split(':')[0];
    if (curve === 'ed25519' || curve === 'secp256k1') return curve;
    throw new Error(`Unsupported curve: ${curve}`);
}

/**
 * Decode the base58 portion of a key string (after the "curve:" prefix).
 */
export function keyFromString(key: string): Uint8Array {
    const raw = key.includes(':') ? key.split(':')[1]! : key;
    return baseDecode(raw);
}

/**
 * Encode a raw key byte array into a prefixed key string like "ed25519:base58key".
 */
export function keyToString(key: Uint8Array, curve: KeyCurve = 'ed25519'): KeyPairString {
    return `${curve}:${baseEncode(key)}` as KeyPairString;
}

/**
 * Derive the public key string from a private key string.
 * Supports both ed25519 and secp256k1 curves.
 *
 * @param privateKey Key string like "ed25519:base58..." or "secp256k1:base58..."
 * @returns Public key string like "ed25519:base58..." or "secp256k1:base58..."
 */
export function publicKeyFromPrivate(privateKey: string): KeyPairString {
    const curve = curveFromKey(privateKey);
    if (curve === 'secp256k1') {
        const secret = keyFromString(privateKey);
        const fullPk = secp256k1.getPublicKey(secret, false);
        const publicKey = fullPk.slice(1); // strip 0x04 prefix — NEAR stores 64 bytes (x‖y)
        return keyToString(publicKey, 'secp256k1');
    }
    const secret = keyFromString(privateKey).slice(0, 32);
    const publicKey = ed25519.getPublicKey(secret);
    return keyToString(publicKey);
}

/**
 * Generate a random private key string for the given curve.
 *
 * @param curve Key curve, defaults to 'ed25519'
 * @returns Private key string like "ed25519:base58..."
 */
export function privateKeyFromRandom(curve: KeyCurve = 'ed25519'): KeyPairString {
    const size = curve === 'secp256k1' ? 32 : 64;
    const privateKey = crypto.getRandomValues(new Uint8Array(size));
    return keyToString(privateKey, curve);
}

/**
 * Sign a hash (pre-hashed message) with a private key string.
 * For ed25519, the hash is signed directly.
 * For secp256k1, produces a 65-byte signature in NEAR's [r, s, v] format.
 *
 * @param hashBytes The hash bytes to sign
 * @param privateKey Key string like "ed25519:base58..." or "secp256k1:base58..."
 * @returns The signature as Uint8Array (or base58 string if opts.returnBase58 is true)
 */
export function signHash(
    hashBytes: Uint8Array,
    privateKey: string,
    opts?: { returnBase58?: boolean }
): Uint8Array | string {
    const curve = curveFromKey(privateKey);

    let signature: Uint8Array;
    if (curve === 'secp256k1') {
        const secret = keyFromString(privateKey);
        const raw = secp256k1.sign(hashBytes, secret, { prehash: false, format: 'recovered' });
        // 'recovered' format: [v(1), r(32), s(32)] → NEAR expects [r(32), s(32), v(1)]
        signature = new Uint8Array(65);
        signature.set(raw.slice(1, 33), 0); // r
        signature.set(raw.slice(33, 65), 32); // s
        signature[64] = raw[0]!; // v
    } else {
        const secret = keyFromString(privateKey).slice(0, 32);
        signature = ed25519.sign(hashBytes, secret);
    }

    if (opts?.returnBase58) {
        return baseEncode(signature);
    }
    return signature;
}

/**
 * Hash bytes with sha256 then sign with the private key.
 *
 * @param bytes The raw bytes to hash and sign
 * @param privateKey Key string like "ed25519:base58..." or "secp256k1:base58..."
 * @returns The signature as Uint8Array
 */
export function signBytes(bytes: Uint8Array, privateKey: string): Uint8Array | string {
    const hash = sha256(bytes);
    return signHash(hash, privateKey);
}
