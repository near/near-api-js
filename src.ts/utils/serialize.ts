'use strict';

import bs58 from 'bs58';

export function base_encode(value: Buffer | Uint8Array | string): string {
    if (typeof(value) === 'string') {
        value = Buffer.from(value, 'utf8');
    }
    if (value.constructor === Uint8Array) {
        value = new Buffer(value);
    }
    return bs58.encode(<Buffer> value);
}

export function base_decode(value: string): Buffer | Uint8Array {
    return bs58.decode(value)
}
