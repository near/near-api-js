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
