import { PublicKey } from '../crypto/public_key.js';
import type { Provider } from '../providers/provider.js';
import { type MessagePayload, serializeMessage } from './schema.js';

export interface VerifyMessageArgs {
    signerAccountId: string;
    signerPublicKey: string | PublicKey;
    payload: MessagePayload;
    signature: Uint8Array;
    provider: Provider;
}

/**
 * Verifies a NEP-413 signature and queries whether the signing key has FullAccess permission on the account.
 * @param params - Message verification options.
 * @param params.signerAccountId - Account claimed by the signer.
 * @param params.signerPublicKey - Public key instance or curve-prefixed Base58 public key.
 * @param params.payload - Exact payload that was signed, including its recipient and nonce.
 * @param params.signature - Raw signature bytes, not a Base64 string.
 * @param params.provider - Provider used to query the account's access key.
 * @returns Resolves without a value on success; invalid signatures do not return `false`.
 * @throws If the key is missing, lacks FullAccess permission, the signature is invalid, or the RPC request fails.
 * @remarks The application must also check the expected recipient and enforce nonce freshness to prevent replay.
 */
export async function verifyMessage({
    signerAccountId,
    signerPublicKey,
    payload,
    signature,
    provider,
}: VerifyMessageArgs): Promise<void> {
    const accessKey = await provider.viewAccessKey({
        accountId: signerAccountId,
        publicKey: signerPublicKey,
    });

    if (accessKey.permission !== 'FullAccess') {
        throw new Error(
            `Public key ${signerPublicKey.toString()} does not have FullAccess permission on account ${signerAccountId}`
        );
    }

    const pk = PublicKey.from(signerPublicKey);
    const message = serializeMessage(payload);

    const isVerified = pk.verify(message, signature);

    if (!isVerified) {
        throw new Error('Signature verification failed');
    }
}
