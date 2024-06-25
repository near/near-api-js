import { baseEncode, baseDecode } from '@near-js/utils';
import { ed25519 } from '@noble/curves/ed25519';
import secp256k1 from 'secp256k1';

import { KeySize, KeyType } from './constants';
import { Assignable } from '@near-js/types';

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

export abstract class Enum {
    enum: string;

    constructor(properties: any) {
        if (Object.keys(properties).length !== 1) {
            throw new Error('Enum can only take single value');
        }
        Object.keys(properties).map((key: string) => {
            (this as any)[key] = properties[key];
            this.enum = key;
        });
    }
}

class ED25519PublicKey extends Assignable { keyType: KeyType = KeyType.ED25519; data: Uint8Array; }
class SECP256K1PublicKey extends Assignable { keyType: KeyType = KeyType.ED25519; data: Uint8Array; }

/**
 * PublicKey representation that has type and bytes of the key.
 */
export class PublicKey extends Assignable {
    ed25519Key?: ED25519PublicKey;
    secp256k1Key?: SECP256K1PublicKey;

    constructor({ keyType, data }: { keyType: KeyType, data: Uint8Array }) {
        super({});
        if (keyType === KeyType.ED25519) {
            this.ed25519Key = { keyType, data };
        } else if (keyType === KeyType.SECP256K1) {
            this.secp256k1Key = { keyType, data };
        }
    }

    /**
     * Creates a PublicKey instance from a string or an existing PublicKey instance.
     * @param value The string or PublicKey instance to create a PublicKey from.
     * @returns {PublicKey} The PublicKey instance.
     */
    static from(value: string | PublicKey): PublicKey {
        if (typeof value === 'string') {
            return PublicKey.fromString(value);
        }
        return value;
    }

    /**
     * Creates a PublicKey instance from an encoded key string.
     * @param encodedKey The encoded key string.
     * @returns {PublicKey} The PublicKey instance created from the encoded key string.
     */
    static fromString(encodedKey: string): PublicKey {
        const parts = encodedKey.split(':');
        let publicKey: string;
        let keyType;
        if (parts.length === 1) {
            publicKey = parts[0];
        } else if (parts.length === 2) {
            publicKey = parts[1];
            keyType = str_to_key_type(parts[0]);
        } else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
        const decodedPublicKey = baseDecode(publicKey);
        if (!keyType) {
            keyType = decodedPublicKey.length === KeySize.ED25519_PUBLIC_KEY ? KeyType.ED25519 : KeyType.SECP256K1;
        }
        const keySize = keyType === KeyType.ED25519 ? KeySize.ED25519_PUBLIC_KEY : KeySize.SECP256k1_PUBLIC_KEY;
        if(parts.length === 2 && decodedPublicKey.length !== keySize || parts.length === 1 && decodedPublicKey.length !== KeySize.ED25519_PUBLIC_KEY && decodedPublicKey.length !== KeySize.SECP256k1_PUBLIC_KEY) {
            throw new Error(`Invalid public key size (${decodedPublicKey.length}), must be ${keySize}`);
        }
        return new PublicKey({ keyType, data: decodedPublicKey });
    }

    /**
     * Returns a string representation of the public key.
     * @returns {string} The string representation of the public key.
     */
    toString(): string {
        const keyType = this.ed25519Key ? this.ed25519Key.keyType : this.secp256k1Key.keyType;
        const data = keyType === KeyType.ED25519 ? this.ed25519Key?.data : this.secp256k1Key?.data;
        const encodedKey = baseEncode(data);
        return `${key_type_to_str(keyType)}:${encodedKey}`;
    }

    /**
     * Verifies a message signature using the public key.
     * @param message The message to be verified.
     * @param signature The signature to be verified.
     * @returns {boolean} `true` if the signature is valid, otherwise `false`.
     */
    verify(message: Uint8Array, signature: Uint8Array): boolean {
        const keyType = this.ed25519Key ? this.ed25519Key.keyType : this.secp256k1Key.keyType;
        const data = keyType === KeyType.ED25519 ? this.ed25519Key?.data : this.secp256k1Key?.data;
        switch (keyType) {
            case KeyType.ED25519:
                return ed25519.verify(signature, message, data);
            case KeyType.SECP256K1:
                return secp256k1.ecdsaVerify(signature.subarray(0, 64), message, new Uint8Array([0x04, ...data]));
            default:
                throw new Error(`Unknown key type: ${keyType}`);
        }
    }
}
