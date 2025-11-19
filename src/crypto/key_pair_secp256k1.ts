import { baseDecode, baseEncode } from '../utils/index.js';
import { randomBytes } from '@noble/hashes/utils';
import secp256k1 from 'secp256k1';

import { KeyPairString, KeySize, KeyType } from './constants.js';
import { KeyPairBase, Signature } from './key_pair_base.js';
import { PublicKey } from './public_key.js';

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
export class KeyPairSecp256k1 extends KeyPairBase {
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
        const withHeader = secp256k1.publicKeyCreate(new Uint8Array(secretKey), false);
        const data = withHeader.subarray(1, withHeader.length); // remove the 0x04 header byte
        this.publicKey = new PublicKey({
            keyType: KeyType.SECP256K1,
            data
        });
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
        // TODO: find better way to generate PK
        const secretKey = randomBytes(KeySize.SECRET_KEY);
        const withHeader = secp256k1.publicKeyCreate(new Uint8Array(secretKey), false);
        const publicKey = withHeader.subarray(1, withHeader.length);
        const extendedSecretKey = new Uint8Array([...secretKey, ...publicKey]);
        return new KeyPairSecp256k1(baseEncode(extendedSecretKey));
    }

    sign(message: Uint8Array): Signature {
        // nearcore expects 65 byte signatures formed by appending the recovery id to the 64 byte signature
        const { signature, recid } = secp256k1.ecdsaSign(message, baseDecode(this.secretKey)); 
        return { signature: new Uint8Array([...signature, recid]), publicKey: this.publicKey };
    }

    verify(message: Uint8Array, signature: Uint8Array): boolean {
        return this.publicKey.verify(message, signature);
    }

    toString(): KeyPairString {
        return `secp256k1:${this.extendedSecretKey}`;
    }

    getPublicKey(): PublicKey {
        return this.publicKey;
    }
}