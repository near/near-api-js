import { KeyPair, PublicKey } from "@near-js/crypto";
import {
    encodeTransaction,
    Signature,
    SignedTransaction,
    Transaction,
} from "@near-js/transactions";

export { InMemorySigner, Signer } from "@near-js/signers";

export interface SignMessageParams {
    message: string; // The message that wants to be transmitted.
    recipient: string; // The recipient to whom the message is destined (e.g. "alice.near" or "myapp.com").
    nonce: Uint8Array; // A nonce that uniquely identifies this instance of the message, denoted as a 32 bytes array (a fixed `Buffer` in JS/TS).
    callbackUrl?: string; // Optional, applicable to browser wallets (e.g. MyNearWallet). The URL to call after the signing process. Defaults to `window.location.href`.
    state?: string; // Optional, applicable to browser wallets (e.g. MyNearWallet). A state for authentication purposes.
}

export interface SignedMessage {
    accountId: string; // The account name to which the publicKey corresponds as plain text (e.g. "alice.near")
    publicKey: string; // The public counterpart of the key used to sign, expressed as a string with format "<key-type>:<base58-key-bytes>" (e.g. "ed25519:6TupyNrcHGTt5XRLmHTc2KGaiSbjhQi1KHtCXTgbcr4Y")
    signature: string; // The base64 representation of the signature.
    state?: string; // Optional, applicable to browser wallets (e.g. MyNearWallet). The same state passed in SignMessageParams.
}

/**
 * General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.
 */
export abstract class SignerV2 {
    abstract getPublicKey(): PublicKey;

    abstract signNep413Message(
        params: SignMessageParams,
        accountId: string
    ): Promise<SignedMessage>;

    abstract signTransaction(
        transaction: Transaction
    ): Promise<SignedTransaction>;
}

export class KeyPairSigner extends SignerV2 {
    public readonly key: KeyPair;

    constructor(
        key: KeyPair,
    ) {
        super();
        this.key = key;
    }

    public getPublicKey(): PublicKey {
        return this.key.getPublicKey();
    }

    public async signNep413Message(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        params: SignMessageParams,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        accountId: string
    ): Promise<SignedMessage> {
        throw new Error(`Not implemented!`);
    }

    public async signTransaction(
        transaction: Transaction
    ): Promise<SignedTransaction> {
        const message = encodeTransaction(transaction);

        const { signature } = this.key.sign(message);

        return new SignedTransaction({
            transaction,
            signature: new Signature({
                keyType: this.key.getPublicKey().keyType,
                data: signature,
            }),
        });
    }
}
