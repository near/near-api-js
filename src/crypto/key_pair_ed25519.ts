import { baseEncode, baseDecode } from '../utils/index.js';
import { ed25519 } from '@noble/curves/ed25519';
import { randomBytes } from '@noble/hashes/utils';

import { KeyPairString, KeySize, KeyType } from './constants.js';
import { KeyPairBase, Signature } from './key_pair_base.js';
import { PublicKey } from './public_key.js';

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
     * @param extendedSecretKey
     */
    constructor(extendedSecretKey: string) {
        super();
        const decoded = baseDecode(extendedSecretKey);
        const secretKey = new Uint8Array(decoded.slice(0, KeySize.SECRET_KEY));
        const publicKey = ed25519.getPublicKey(new Uint8Array(secretKey));
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
        const secretKey = randomBytes(KeySize.SECRET_KEY);
        const publicKey = ed25519.getPublicKey(new Uint8Array(secretKey));
        const extendedSecretKey = new Uint8Array([...secretKey, ...publicKey]);
        return new KeyPairEd25519(baseEncode(extendedSecretKey));
    }

    /**
     * Signs a message using the key pair's secret key.
     * @param message The message to be signed.
     * @returns {Signature} The signature object containing the signature and the public key.
     */
    sign(message: Uint8Array): Signature {
        const signature = ed25519.sign(message, baseDecode(this.secretKey));
        return { signature, publicKey: this.publicKey };
    }

    /**
     * Verifies the signature of a message using the key pair's public key.
     * @param message The message to be verified.
     * @param signature The signature to be verified.
     * @returns {boolean} `true` if the signature is valid, otherwise `false`.
     */
    verify(message: Uint8Array, signature: Uint8Array): boolean {
        return this.publicKey.verify(message, signature);
    }

    /**
     * Returns a string representation of the key pair in the format 'ed25519:[extendedSecretKey]'.
     * @returns {string} The string representation of the key pair.
     */
    toString(): KeyPairString {
        return `ed25519:${this.extendedSecretKey}`;
    }

    /**
     * Retrieves the public key associated with the key pair.
     * @returns {PublicKey} The public key.
     */
    getPublicKey(): PublicKey {
        return this.publicKey;
    }
}
