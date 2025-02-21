/** All supported key types */
export enum KeyType {
    ED25519 = 0,
    SECP256K1 = 1,
}

export const KeySize = {
    SECRET_KEY: 32,
    ED25519_PUBLIC_KEY: 32,
    SECP256k1_PUBLIC_KEY: 64,
};

export type CurveType = 'ed25519' | 'ED25519' | 'secp256k1' | 'SECP256K1';

export type KeyPairString = `ed25519:${string}` | `secp256k1:${string}`;
