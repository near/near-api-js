import { baseEncode, baseDecode } from '@near-js/utils';
import { ed25519 } from '@noble/curves/ed25519';
import crypto from 'crypto-browserify';

import { KeySize, KeyType } from './constants';
import { KeyPairBase, Signature } from './key_pair_base';
import { PublicKey } from './public_key';

/**
 * This class provides key pair functionality for Ed25519 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
export class KeyPairEd25519 extends KeyPairBase {
    readonly publicKey: PublicKey;
    readonly secretKey: string;
    readonly extendedSecretKey: string;

    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58.
     * @param {string} extendedSecretKey
     */
    constructor(extendedSecretKey: string) {
        super();
        const decoded = baseDecode(extendedSecretKey);
        const secretKey = new Uint8Array(decoded.slice(0, KeySize.SECRET_KEY));
        const publicKey = ed25519.getPublicKey(secretKey);
        this.publicKey = new PublicKey({ keyType: KeyType.ED25519, data: publicKey });
        this.secretKey = baseEncode(secretKey);
        this.extendedSecretKey = extendedSecretKey;
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
        const secretKey = crypto.randomBytes(KeySize.SECRET_KEY);
        const publicKey = ed25519.getPublicKey(secretKey);
        const extendedSecretKey = new Uint8Array([...secretKey, ...publicKey]);
        return new KeyPairEd25519(baseEncode(extendedSecretKey));
    }

    sign(message: Uint8Array): Signature {
        const signature = ed25519.sign(message, baseDecode(this.secretKey));
        return { signature, publicKey: this.publicKey };
    }

    verify(message: Uint8Array, signature: Uint8Array): boolean {
        return this.publicKey.verify(message, signature);
    }

    toString(): string {
        return `ed25519:${this.extendedSecretKey}`;
    }

    getPublicKey(): PublicKey {
        return this.publicKey;
    }
}
