'use strict';

import { randomBytes } from 'crypto';
import { eddsa as EdDSA } from 'elliptic';
import { base_encode, base_decode } from './serialize';

export type Arrayish = string | ArrayLike<number>;
export type Signature = string;

let _ed25519curve: EdDSA = null
function getEd25519Curve(): EdDSA {
    if (!_ed25519curve) {
        _ed25519curve = new EdDSA('ed25519');
    }
    return _ed25519curve;
}

/**
 * This class provides key pair functionality for Ed25519 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
export class KeyPairEd25519 {
    readonly publicKey: string;
    readonly secretKey: string;

    /**
     * Construct an instance of key pair given a secret key. 
     * It's generally assumed that these are encoded in base58.
     * @param {string} secretKey
     */
    constructor(secretKey: string) {
        const keyPair = getEd25519Curve().keyFromSecret(<Buffer> base_decode(secretKey));
        this.publicKey = base_encode(Buffer.from(keyPair.getPublic()));
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
        let secretKey = randomBytes(32);
        return new KeyPairEd25519(base_encode(secretKey));
    }

    sign(message: Buffer): Buffer {
        const keyPair = getEd25519Curve().keyFromSecret(<Buffer> base_decode(this.secretKey));
        return keyPair.sign(message).toBytes();
    }

    verify(message: Buffer, signature: Buffer): boolean {
        const keyPair = getEd25519Curve().keyFromSecret(<Buffer> base_decode(this.secretKey));
        return keyPair.verify(message, signature);
    }
}
