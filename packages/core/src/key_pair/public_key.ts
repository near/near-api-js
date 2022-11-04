import { baseEncode, baseDecode } from 'borsh';
import nacl from 'tweetnacl';

import { KeyType } from './constants';

abstract class Assignable {
    constructor(properties: any) {
        Object.keys(properties).map((key: any) => {
            (this as any)[key] = properties[key];
        });
    }
}

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
        if (parts.length === 1) {
            return new PublicKey({ keyType: KeyType.ED25519, data: baseDecode(parts[0]) });
        } else if (parts.length === 2) {
            return new PublicKey({ keyType: str_to_key_type(parts[0]), data: baseDecode(parts[1]) });
        } else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }

    toString(): string {
        return `${key_type_to_str(this.keyType)}:${baseEncode(this.data)}`;
    }

    verify(message: Uint8Array, signature: Uint8Array): boolean {
        switch (this.keyType) {
            case KeyType.ED25519: return nacl.sign.detached.verify(message, signature, this.data);
            default: throw new Error(`Unknown key type ${this.keyType}`);
        }
    }
}
