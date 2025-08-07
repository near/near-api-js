import { sha256 } from '@noble/hashes/sha256';

import { Nep413MessageSchema, SignMessageParams } from './signer';
import { serialize } from 'borsh';

/**
 * Generates a SHA-256 hash of the serialized payload according to the NEP-413 specification.
 * The payload includes the serialized prefix, and serialied schema that include a human-readable message, the recipient account ID,
 * a 32-byte nonce, and an optional callback URL. Returned hash is used for signing or verifying messages.
 *
 * @see [https://github.com/near/NEPs/blob/master/neps/nep-0413.md](https://github.com/near/NEPs/blob/master/neps/nep-0413.md)
 *
 * @param message String message to be signed or verified.
 * @param recipient Account ID of the intended recipient of the message.
 * @param nonce A nonce that uniquely identifies this instance (32 bytes).
 * @param callbackUrl Optional URL that calls after signing.
 *
 * @returns A SHA-256 hash of the serialized payload as a `Uint8Array`.
 */

export function getPayloadHashForNEP413(params: SignMessageParams): Uint8Array {
    if (params.nonce.length !== 32)
        throw new Error('Nonce must be exactly 32 bytes long');

    // 2**31 + 413 == 2147484061
    const PREFIX = 2147484061;
    const serializedPrefix = serialize('u32', PREFIX);
    const serializedParams = serialize(Nep413MessageSchema, params);

    const serializedPayload = new Uint8Array(
        serializedPrefix.length + serializedParams.length
    );
    serializedPayload.set(serializedPrefix);
    serializedPayload.set(serializedParams, serializedPrefix.length);

    return new Uint8Array(sha256(serializedPayload));
}
