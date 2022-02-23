import { Assignable } from './enums';
import { BinaryReader, BinaryWriter } from 'borsh';
export declare type Arrayish = string | ArrayLike<number>;
export interface Signature {
    signature: Uint8Array;
    publicKey: PublicKey;
}
/** All supported key types */
export declare enum KeyType {
    ED25519 = 0,
    SECP256K1 = 1
}
/**
 * PublicKey representation that has type and bytes of the key.
 */
export declare class PublicKey extends Assignable {
    keyType: KeyType;
    data: Uint8Array;
    static from(value: string | PublicKey): PublicKey;
    static fromString(encodedKey: string): PublicKey;
    toString(): string;
    verify(message: Uint8Array, signature: Uint8Array): boolean;
    static borshDeserialize(reader: BinaryReader): PublicKey;
    borshSerialize(writer: BinaryWriter): void;
}
export declare abstract class KeyPair {
    abstract sign(message: Uint8Array): Signature;
    abstract verify(message: Uint8Array, signature: Uint8Array): boolean;
    abstract toString(): string;
    abstract getPublicKey(): PublicKey;
    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve: string): KeyPair;
    static fromString(encodedKey: string): KeyPair;
}
/**
 * This class provides key pair functionality for Ed25519 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
export declare class KeyPairEd25519 extends KeyPair {
    readonly publicKey: PublicKey;
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
    getPublicKey(): PublicKey;
}
/**
 * This class provides key pair functionality for secp256k1 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 * nearcore expects secp256k1 public keys to be 64 bytes at all times,
 * even when string encoded the secp256k1 library returns 65 byte keys
 * (including a 1 byte header that indicates how the pubkey was encoded).
 * We'll force the secp256k1 library to always encode uncompressed
 * keys with the corresponding 0x04 header byte, then manually
 * insert/remove that byte as needed.
 */
export declare class KeyPairSecp256k1 extends KeyPair {
    readonly publicKey: PublicKey;
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
    static fromRandom(): KeyPairSecp256k1;
    sign(message: Uint8Array): Signature;
    verify(message: Uint8Array, signature: Uint8Array): boolean;
    toString(): string;
    getPublicKey(): PublicKey;
}
