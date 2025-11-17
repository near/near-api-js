import { PublicKey } from '../crypto';
import {
    DelegateAction,
    SignedDelegate,
    SignedTransaction,
    Transaction,
} from '../transactions';
import { Schema } from 'borsh';

export interface SignMessageParams {
    message: string; // The message that wants to be transmitted.
    recipient: string; // The recipient to whom the message is destined (e.g. "alice.near" or "myapp.com").
    nonce: Uint8Array; // A nonce that uniquely identifies this instance of the message, denoted as a 32 bytes array (a fixed `Buffer` in JS/TS).
    callbackUrl?: string; // Optional, applicable to browser wallets (e.g. MyNearWallet). The URL to call after the signing process. Defaults to `window.location.href`.
}

export interface SignedMessage {
    accountId: string; // The account name to which the publicKey corresponds as plain text (e.g. "alice.near")
    publicKey: PublicKey; // The public counterpart of the key used to sign, expressed as a string with format "<key-type>:<base58-key-bytes>" (e.g. "ed25519:6TupyNrcHGTt5XRLmHTc2KGaiSbjhQi1KHtCXTgbcr4Y")
    signature: Uint8Array; // The base64 representation of the signature.
    state?: string; // Optional, applicable to browser wallets (e.g. MyNearWallet). The same state passed in SignMessageParams.
}

export const Nep413MessageSchema: Schema = {
    struct: {
        message: 'string',
        nonce: { array: { type: 'u8', len: 32 } },
        recipient: 'string',
        callbackUrl: { option: 'string' },
    },
};

/**
 * General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.
 */
export abstract class Signer {
    /**
     * Returns public key for given signer
     */
    public abstract getPublicKey(): Promise<PublicKey>;

    /**
     * Signs given message according to NEP-413 requirements
     * @see https://github.com/near/NEPs/blob/master/neps/nep-0413.md
     *
     * @param params
     * @param accountId
     */
    public abstract signNep413Message(
        message: string,
        accountId: string,
        recipient: string,
        nonce: Uint8Array,
        callbackUrl?: string
    ): Promise<SignedMessage>;

    public abstract signTransaction(
        transaction: Transaction
    ): Promise<[Uint8Array, SignedTransaction]>;

    public abstract signDelegateAction(
        delegateAction: DelegateAction
    ): Promise<[Uint8Array, SignedDelegate]>;
}
