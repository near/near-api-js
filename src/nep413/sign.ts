import type { Account } from '../accounts/account.js';
import type { SignedMessage } from '../signers/signer.js';
import type { MessagePayload } from './schema.js';

export interface SignMessageArgs {
    signerAccount: Account;
    payload: MessagePayload;
}

export function signMessage({ signerAccount, payload }: SignMessageArgs): Promise<SignedMessage> {
    const signer = signerAccount.getSigner();

    if (!signer) throw new Error('Please set a signer');

    return signer.signNep413Message(signerAccount.accountId, payload);
}
