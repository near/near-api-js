'use strict';

import nacl from 'tweetnacl';
import { base_encode, base_decode } from './serialize';

export type Arrayish = string | ArrayLike<number>;

export type Signature = {
    signature: Uint8Array,
    publicKey: string,
}

export abstract class KeyPair {
    abstract sign(message: Uint8Array): Signature;
    abstract verify(message: Uint8Array, signature: Uint8Array): boolean;
    abstract toString(): string;

    static fromString(encodedKey: string): KeyPair {
        let parts = encodedKey.split(':');
        if (parts.length != 2) {
            throw new Error("Invalid encoded key format, must be <curve>:<encoded key>");
        }
        switch (parts[0]) {
            case "ed25519": return new KeyPairEd25519(parts[1]);
            default: throw new Error(`Unknown curve: ${parts[0]}`);
        }
    }
}

/**
 * This class provides key pair functionality for Ed25519 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
export class KeyPairEd25519 extends KeyPair {
    readonly publicKey: string;
    readonly secretKey: string;

    /**
     * Construct an instance of key pair given a secret key. 
     * It's generally assumed that these are encoded in base58.
     * @param {string} secretKey
     */
    constructor(secretKey: string) {
        super();
        let keyPair = nacl.sign.keyPair.fromSecretKey(base_decode(secretKey));
        this.publicKey = base_encode(keyPair.publicKey);
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
        let secretKey = nacl.randomBytes(64);
        return new KeyPairEd25519(base_encode(secretKey));
    }

    toString(): string {
        return `ed25519:${this.secretKey}`;
    }

    sign(message: Uint8Array): Signature {
        const signature = nacl.sign.detached(message, base_decode(this.secretKey));
        return { signature, publicKey: this.publicKey };
    }

    verify(message: Uint8Array, signature: Uint8Array): boolean {
        return nacl.sign.detached.verify(message, signature, base_decode(this.publicKey));
    }
}
