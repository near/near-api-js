/// <reference types="node" />
export declare type Arrayish = string | ArrayLike<number>;
export declare type Signature = string;
/**
 * This class provides key pair functionality (generating key pairs, encoding key pairs).
 */
export declare class KeyPairEd25519 {
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
    sign(message: Buffer): Buffer;
    verify(message: Buffer, signature: Buffer): boolean;
}
