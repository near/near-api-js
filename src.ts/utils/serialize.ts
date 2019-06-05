'use strict';

import bs58 from 'bs58';

export function base_encode(value: Buffer | string): string {
    if (typeof(value) === 'string') {
        value = Buffer.from(value, 'utf8');
    }
    return bs58.encode(value);
}

export function base_decode(value: string): Buffer {
    return bs58.decode(value)
}
