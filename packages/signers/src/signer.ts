import { Signature, PublicKey } from '@near-js/crypto';
import {
    DelegateAction,
    SignedDelegate,
    SignedTransaction,
    Transaction,
} from '@near-js/transactions';

export interface SignMessageParams {
    message: string; // The message that wants to be transmitted.
    recipient: string; // The recipient to whom the message is destined (e.g. "alice.near" or "myapp.com").
    nonce: Uint8Array; // A nonce that uniquely identifies this instance of the message, denoted as a 32 bytes array (a fixed `Buffer` in JS/TS).
    callbackUrl?: string; // Optional, applicable to browser wallets (e.g. MyNearWallet). The URL to call after the signing process. Defaults to `window.location.href`.
    state?: string; // Optional, applicable to browser wallets (e.g. MyNearWallet). A state for authentication purposes.
}

export interface SignedMessage {
    accountId: string; // The account name to which the publicKey corresponds as plain text (e.g. "alice.near")
    publicKey: PublicKey; // The public counterpart of the key used to sign, expressed as a string with format "<key-type>:<base58-key-bytes>" (e.g. "ed25519:6TupyNrcHGTt5XRLmHTc2KGaiSbjhQi1KHtCXTgbcr4Y")
    signature: Signature; // The base64 representation of the signature.
    state?: string; // Optional, applicable to browser wallets (e.g. MyNearWallet). The same state passed in SignMessageParams.
}

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
        params: SignMessageParams,
        accountId: string
    ): Promise<SignedMessage>;

    public abstract signTransaction(
        transaction: Transaction
    ): Promise<[Uint8Array, SignedTransaction]>;

    public abstract signDelegate(
        delegateAction: DelegateAction
    ): Promise<[Uint8Array, SignedDelegate]>;
}
