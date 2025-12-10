import { sha256 } from '@noble/hashes/sha2.js';
import { type Schema, serialize } from 'borsh';

export interface MessagePayload {
    message: string; // The message that wants to be transmitted.
    recipient: string; // The recipient to whom the message is destined (e.g. "alice.near" or "myapp.com").
    nonce: Uint8Array; // A nonce that uniquely identifies this instance of the message, denoted as a 32 bytes array (a fixed `Buffer` in JS/TS).
    callbackUrl?: string; // Optional, applicable to browser wallets (e.g. MyNearWallet). The URL to call after the signing process. Defaults to `window.location.href`.
}

export const Nep413MessageSchema: Schema = {
    struct: {
        message: 'string',
        nonce: { array: { type: 'u8', len: 32 } },
        recipient: 'string',
        callbackUrl: { option: 'string' },
    },
};

export function serializeMessage(payload: MessagePayload): Uint8Array {
    // 2**31 + 413 == 2147484061
    const PREFIX = 2147484061;
    const serializedPrefix = serialize('u32', PREFIX);
    const serializedParams = serialize(Nep413MessageSchema, payload);

    const serializedPayload = new Uint8Array(serializedPrefix.length + serializedParams.length);
    serializedPayload.set(serializedPrefix);
    serializedPayload.set(serializedParams, serializedPrefix.length);

    return new Uint8Array(sha256(serializedPayload));
}
