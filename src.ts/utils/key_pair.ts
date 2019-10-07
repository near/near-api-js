'use strict';

import nacl from 'tweetnacl';
import { base_encode, base_decode } from './serialize';

export type Arrayish = string | ArrayLike<number>;

export interface Signature {
    signature: Uint8Array;
    publicKey: PublicKey;
}

/** All supported key types */
export enum KeyType {
    ED25519 = 0,
}

function key_type_to_str(keyType: KeyType): String {
    switch (keyType) {
        case KeyType.ED25519: return 'ed25519';
        default: throw new Error(`Unknown key type ${keyType}`);
    }
}

function str_to_key_type(keyType: string): KeyType {
    switch (keyType.toLowerCase()) {
        case 'ed25519': return KeyType.ED25519;
        default: throw new Error(`Unknown key type ${keyType}`);
    }
}

export class BlsPublicKey {
    data: Uint8Array;

    constructor(data: Uint8Array) {
        this.data = data;
    }

    static fromString(encodedKey: string): BlsPublicKey {
        return new BlsPublicKey(base_decode(encodedKey));
    }
}

/**
 * PublicKey representation that has type and bytes of the key.
 */
export class PublicKey {
    keyType: KeyType;
    data: Uint8Array;

    constructor(keyType: KeyType, data: Uint8Array) {
        this.keyType = keyType;
        this.data = data;
    }

    static from(value: string | PublicKey): PublicKey {
        if (typeof value === 'string') {
            return PublicKey.fromString(value);
        }
        return value;
    }

    static fromString(encodedKey: string): PublicKey {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new PublicKey(KeyType.ED25519, base_decode(parts[0]));
        } else if (parts.length === 2) {
            return new PublicKey(str_to_key_type(parts[0]), base_decode(parts[1]));
        } else {
            throw new Error('Invlaid encoded key format, must be <curve>:<encoded key>');
        }
    }

    toString(): string {
        return `${key_type_to_str(this.keyType)}:${base_encode(this.data)}`;
    }
}

export abstract class KeyPair {
    abstract sign(message: Uint8Array): Signature;
    abstract verify(message: Uint8Array, signature: Uint8Array): boolean;
    abstract toString(): string;
    abstract getPublicKey(): PublicKey;

    static fromRandom(curve: string): KeyPair {
        switch (curve.toUpperCase()) {
            case 'ED25519': return KeyPairEd25519.fromRandom();
            default: throw new Error(`Unknown curve ${curve}`);
        }
    }

    static fromString(encodedKey: string): KeyPair {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new KeyPairEd25519(parts[0]);
        } else if (parts.length === 2) {
            switch (parts[0].toUpperCase()) {
                case 'ED25519': return new KeyPairEd25519(parts[1]);
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
        this.publicKey = new PublicKey(KeyType.ED25519, keyPair.publicKey);
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
        return nacl.sign.detached.verify(message, signature, this.publicKey.data);
    }

    toString(): string {
        return `ed25519:${this.secretKey}`;
    }

    getPublicKey(): PublicKey {
        return this.publicKey;
    }
}
