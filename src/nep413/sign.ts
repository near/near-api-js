import type { Account } from '../accounts/account.js';
import type { SignedMessage } from '../signers/signer.js';
import type { MessagePayload } from './schema.js';

export interface SignMessageArgs {
    signerAccount: Account;
    payload: MessagePayload;
}

/**
 * Signs a NEP-413 message using an account's configured signer, without submitting a transaction.
 * @param params - Message signing options.
 * @param params.signerAccount - Account with a signer; its account ID is included in the returned object.
 * @param params.payload - Message, intended recipient, 32-byte nonce, and optional callback URL.
 * @returns The account ID, public key, and raw signature bytes.
 * @throws If no signer is configured, the nonce is invalid, or signing fails.
 * @see {@link verifyMessage} for signature and account-key verification.
 */
export function signMessage({ signerAccount, payload }: SignMessageArgs): Promise<SignedMessage> {
    const signer = signerAccount.getSigner();

    if (!signer) throw new Error('Please set a signer');

    return signer.signNep413Message(signerAccount.accountId, payload);
}
