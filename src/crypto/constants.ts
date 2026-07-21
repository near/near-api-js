/** All supported key types */
export enum KeyType {
    ED25519 = 0,
    SECP256K1 = 1,
    MLDSA65 = 2,
}

export const KeySize = {
    SECRET_KEY: 32,
    ED25519_PUBLIC_KEY: 32,
    SECP256k1_PUBLIC_KEY: 64,
    MLDSA65_PUBLIC_KEY: 1952,
    MLDSA65_SIGNATURE: 3309,
};

export type CurveType = 'ed25519' | 'ED25519' | 'secp256k1' | 'SECP256K1' | 'ml-dsa-65' | 'ML-DSA-65';

export type KeyPairString = `ed25519:${string}` | `secp256k1:${string}` | `ml-dsa-65:${string}`;
