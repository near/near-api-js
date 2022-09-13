import nacl from 'tweetnacl';
import { base_encode, base_decode } from './serialize';
import { Assignable } from './enums';
import { randomBytes } from 'crypto';
import {BinaryReader, BinaryWriter} from 'borsh';
import secp256k1 from 'secp256k1';

export type Arrayish = string | ArrayLike<number>;

export interface Signature {
    signature: Uint8Array;
    publicKey: PublicKey;
}

/** All supported key types */
export enum KeyType {
    ED25519 = 0,
    SECP256K1 = 1, 
}

function key_type_to_str(keyType: KeyType): string {
    switch (keyType) {
        case KeyType.ED25519: return 'ed25519';
        case KeyType.SECP256K1: return 'secp256k1';
        default: throw new Error(`Unknown key type ${keyType}`);
    }
}

function str_to_key_type(keyType: string): KeyType {
    switch (keyType.toLowerCase()) {
        case 'ed25519': return KeyType.ED25519;
        case 'secp256k1': return KeyType.SECP256K1;
        default: throw new Error(`Unknown key type ${keyType}`);
    }
}

/**
 * PublicKey representation that has type and bytes of the key.
 */
export class PublicKey extends Assignable {
    keyType: KeyType;
    data: Uint8Array;

    static from(value: string | PublicKey): PublicKey {
        if (typeof value === 'string') {
            return PublicKey.fromString(value);
        }
        return value;
    }
    
    static fromString(encodedKey: string): PublicKey {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new PublicKey({ keyType: KeyType.ED25519, data: base_decode(parts[0]) });
        } else if (parts.length === 2) {
            return new PublicKey({ keyType: str_to_key_type(parts[0]), data: base_decode(parts[1]) });
        } else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }
    
    toString(): string {
        return `${key_type_to_str(this.keyType)}:${base_encode(this.data)}`;
    }

    verify(message: Uint8Array, signature: Uint8Array): boolean {
        switch (this.keyType) {
            case KeyType.ED25519: return nacl.sign.detached.verify(message, signature, this.data);
            // we don't need the recovery id to verify secp25k61 signatures locally, so drop  it here
            // also inject the 0x04 header back into the pubkey before trying to interact with it in
            // the secp256k1 library
            case KeyType.SECP256K1: return secp256k1.ecdsaVerify(signature.subarray(0, 64), message, new Uint8Array([0x04, ...this.data]));
            default: throw new Error(`Unknown key type ${this.keyType}`);
        }
    }
    
    static borshDeserialize(reader: BinaryReader) {
        const keyType = reader.readU8();
        let data: Uint8Array;
        switch (keyType) {
            case KeyType.ED25519: 
                data = reader.readFixedArray(32);
                break;
            case KeyType.SECP256K1: 
                data = reader.readFixedArray(64);
                break;
            default: throw new Error(`Unknown key type ${keyType}`);
        }
        return new PublicKey({keyType, data});
    }
    
    borshSerialize(writer: BinaryWriter) {
        writer.writeU8(this.keyType);
        writer.writeFixedArray(this.data);
    }
}

export abstract class KeyPair {
    abstract sign(message: Uint8Array): Signature;
    abstract verify(message: Uint8Array, signature: Uint8Array): boolean;
    abstract toString(): string;
    abstract getPublicKey(): PublicKey;

    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve: string): KeyPair {
        switch (curve.toUpperCase()) {
            case 'ED25519': return KeyPairEd25519.fromRandom();
            case 'SECP256K1': return KeyPairSecp256k1.fromRandom();
            default: throw new Error(`Unknown curve ${curve}`);
        }
    }

    static fromString(encodedKey: string): KeyPair {
        const parts = encodedKey.split(':');
        //TODO: clarify what we must do here
        if (parts.length === 1) {
            return new KeyPairEd25519(parts[0]);
        } else if (parts.length === 2) {
            switch (parts[0].toUpperCase()) {
                case 'ED25519': return new KeyPairEd25519(parts[1]);
                case 'SECP256K1': return new KeyPairSecp256k1(parts[1]);
                default: throw new Error(`Unknown curve: ${parts[0]}`);
            }
        } else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }
}

/**
 * This class provides key pair functionality for Ed25519 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
export class KeyPairEd25519 extends KeyPair {
    readonly publicKey: PublicKey;
    readonly secretKey: string;

    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58.
     * @param {string} secretKey
     */
    constructor(secretKey: string) {
        super();
        const keyPair = nacl.sign.keyPair.fromSecretKey(base_decode(secretKey));
        this.publicKey = new PublicKey({ keyType: KeyType.ED25519, data: keyPair.publicKey });
        this.secretKey = secretKey;
    }

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
    static fromRandom() {
        const newKeyPair = nacl.sign.keyPair();
        return new KeyPairEd25519(base_encode(newKeyPair.secretKey));
    }

    sign(message: Uint8Array): Signature {
        const signature = nacl.sign.detached(message, base_decode(this.secretKey));
        return { signature, publicKey: this.publicKey };
    }

    verify(message: Uint8Array, signature: Uint8Array): boolean {
        return this.publicKey.verify(message, signature);
    }

    toString(): string {
        return `ed25519:${this.secretKey}`;
    }

    getPublicKey(): PublicKey {
        return this.publicKey;
    }
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
export class KeyPairSecp256k1 extends KeyPair {
    readonly publicKey: PublicKey;
    readonly secretKey: string;

    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58.
     * @param {string} secretKey
     */
    constructor(secretKey: string) {
        super();
        const withHeader = secp256k1.publicKeyCreate(base_decode(secretKey), false);
        const data = withHeader.subarray(1, withHeader.length); // remove the 0x04 header byte
        this.publicKey = new PublicKey({
            keyType: KeyType.SECP256K1,
            data
        });
        this.secretKey = secretKey;
    }

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
    static fromRandom() {
        // TODO: find better way to generate PK
        const secretKey = randomBytes(32);
        return new KeyPairSecp256k1(base_encode(secretKey));
    }

    sign(message: Uint8Array): Signature {
        // nearcore expects 65 byte signatures formed by appending the recovery id to the 64 byte signature
        const { signature, recid } = secp256k1.ecdsaSign(message, base_decode(this.secretKey)); 
        return { signature: new Uint8Array([...signature, recid]), publicKey: this.publicKey };
    }

    verify(message: Uint8Array, signature: Uint8Array): boolean {
        return this.publicKey.verify(message, signature);
    }

    toString(): string {
        return `secp256k1:${this.secretKey}`;
    }

    getPublicKey(): PublicKey {
        return this.publicKey;
    }
}