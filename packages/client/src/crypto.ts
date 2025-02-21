import { type CurveType, KeyPair, type KeyPairString } from '@near-js/crypto';

/**
 * Generate a random key pair for the specified elliptic curve
 * @param curve elliptic curve (e.g. `ed25519`)
 */
export function generateRandomKeyPair(curve: CurveType) {
    return KeyPair.fromRandom(curve);
}

/**
 * Parse a signing key pair from a private key string
 * @param privateKey private key string
 */
export function parseKeyPair(privateKey: KeyPairString) {
    return KeyPair.fromString(privateKey);
}
