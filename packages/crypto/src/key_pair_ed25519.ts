import { baseEncode, baseDecode } from '@near-js/utils';
import { ed25519 } from '@noble/curves/ed25519';
import { webcrypto } from 'crypto';

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

    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58.
     * @param {string} secretKey
     */
    constructor(secretKey: string) {
        super();
        const decoded = baseDecode(secretKey);
        const sk = new Uint8Array(decoded.slice(0, KeySize.SECRET_KEY));
        const publicKey = ed25519.getPublicKey(sk);
        this.publicKey = new PublicKey({ keyType: KeyType.ED25519, data: publicKey });
        this.secretKey = baseEncode(sk);
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
        const sk = webcrypto.getRandomValues(new Uint8Array(KeySize.SECRET_KEY));
        const pk = ed25519.getPublicKey(sk);
        const extendedSC = new Uint8Array([...sk, ...pk]);
        return new KeyPairEd25519(baseEncode(extendedSC));
    }

    sign(message: Uint8Array): Signature {
        const signature = ed25519.sign(message, baseDecode(this.secretKey));
        return { signature, publicKey: this.publicKey };
    }

    verify(message: Uint8Array, signature: Uint8Array): boolean {
        return this.publicKey.verify(message, signature);
    }

    toString(): string {
        const extendedSK = baseEncode(new Uint8Array([...baseDecode(this.secretKey), ...this.publicKey.data]));
        return `ed25519:${extendedSK}`;
    }

    getPublicKey(): PublicKey {
        return this.publicKey;
    }
}
