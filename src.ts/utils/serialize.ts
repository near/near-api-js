'use strict';

import bs58 from 'bs58';

export function base_encode(value: Uint8Array | string): string {
    if (typeof(value) === 'string') {
        value = Buffer.from(value, 'utf8');
    }
    return bs58.encode(Buffer.from(value));
}

export function base_decode(value: string): Uint8Array {
    return bs58.decode(value);
}
