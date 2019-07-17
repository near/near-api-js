export declare type Arrayish = string | ArrayLike<number>;
export interface Signature {
    signature: Uint8Array;
    publicKey: string;
}
export declare abstract class KeyPair {
    abstract sign(message: Uint8Array): Signature;
    abstract verify(message: Uint8Array, signature: Uint8Array): boolean;
    abstract toString(): string;
    abstract getPublicKey(): string;
    static fromRandom(curve: string): KeyPair;
    static fromString(encodedKey: string): KeyPair;
}
/**
 * This class provides key pair functionality for Ed25519 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
export declare class KeyPairEd25519 extends KeyPair {
    readonly publicKey: string;
    readonly secretKey: string;
    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58.
     * @param {string} secretKey
     */
    constructor(secretKey: string);
    /**
     * Generate a new random keypair.
     * @example
     * const keyRandom = KeyPair.fromRandom();
     * keyRandom.publicKey
     * // returns [PUBLIC_KEY]
     *
     * keyRandom.secretKey
     * // returns [SECRET_KEY]
     */
    static fromRandom(): KeyPairEd25519;
    sign(message: Uint8Array): Signature;
    verify(message: Uint8Array, signature: Uint8Array): boolean;
    toString(): string;
    getPublicKey(): string;
}
