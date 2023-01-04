import { PublicKey } from './public_key';

export interface Signature {
    signature: Uint8Array;
    publicKey: PublicKey;
}

export abstract class KeyPairBase {
    abstract sign(message: Uint8Array): Signature;
    abstract verify(message: Uint8Array, signature: Uint8Array): boolean;
    abstract toString(): string;
    abstract getPublicKey(): PublicKey;
}
