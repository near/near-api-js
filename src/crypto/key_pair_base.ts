import type { KeyPairString } from './constants.js';
import type { PublicKey } from './public_key.js';

export interface Signature {
    signature: Uint8Array;
    publicKey: PublicKey;
}

export abstract class KeyPairBase {
    abstract sign(message: Uint8Array): Signature;
    abstract verify(message: Uint8Array, signature: Uint8Array): boolean;
    abstract toString(): KeyPairString;
    abstract getPublicKey(): PublicKey;
}
