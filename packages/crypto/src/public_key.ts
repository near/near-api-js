import { Assignable } from '@near-js/types';
import { baseEncode, baseDecode } from '@near-js/utils';
import { ed25519 } from '@noble/curves/ed25519';

import { KeySize, KeyType } from './constants';

function key_type_to_str(keyType: KeyType): string {
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
        let publicKey: string;
        let keyType = KeyType.ED25519;
        if (parts.length === 1) {
            publicKey = parts[0];
        } else if (parts.length === 2) {
            publicKey = parts[1];
            keyType = str_to_key_type(parts[0]);
        } else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
        const decodedPublicKey = baseDecode(publicKey);
        if(decodedPublicKey.length !== KeySize.SECRET_KEY) {
            throw new Error(`Invalid public key size (${decodedPublicKey.length}), must be ${KeySize.SECRET_KEY}`);
        }
        return new PublicKey({ keyType, data: decodedPublicKey });
    }

    toString(): string {
        return `${key_type_to_str(this.keyType)}:${baseEncode(this.data)}`;
    }

    verify(message: Uint8Array, signature: Uint8Array): boolean {
        switch (this.keyType) {
            case KeyType.ED25519: return ed25519.verify(signature, message, this.data);
            default: throw new Error(`Unknown key type ${this.keyType}`);
        }
    }
}
