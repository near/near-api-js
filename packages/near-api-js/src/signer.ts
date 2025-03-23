import { KeyPair, PublicKey } from "@near-js/crypto";
import { Provider } from "@near-js/providers";
import {
    encodeTransaction,
    Signature,
    SignedTransaction,
    Transaction,
} from "@near-js/transactions";
import { FinalExecutionOutcome } from "@near-js/types";

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
    abstract getPublicKeys(): Promise<Array<PublicKey>>;

    abstract signNep413Message(
        params: SignMessageParams,
        accountId: string
    ): Promise<SignedMessage>;

    abstract signTransaction(
        transaction: Transaction
    ): Promise<SignedTransaction>;

    /**
     * This method is required for compatibility with WalletSelector
     */
    abstract signAndSendTransaction(
        transaction: Transaction,
        // not sure if this Provider should be here
        provider?: Provider
    ): Promise<FinalExecutionOutcome>;
}

export class KeyPairSigner extends SignerV2 {
    constructor(
        private readonly keys: Array<KeyPair>,
        private readonly provider: Provider
    ) {
        super();
    }

    public async getPublicKeys(): Promise<Array<PublicKey>> {
        return this.keys.map((key) => key.getPublicKey());
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

        const keyPair = this.keys.find(
            (key) => key.getPublicKey() === transaction.publicKey
        );

        if (!keyPair)
            throw new Error(
                `Transaction can't be signed with ${transaction.publicKey} as this key doesn't belong to a Signer`
            );

        const { signature } = keyPair.sign(message);

        return new SignedTransaction({
            transaction,
            signature: new Signature({
                keyType: keyPair.getPublicKey().keyType,
                data: signature,
            }),
        });
    }

    public async signAndSendTransaction(
        transaction: Transaction,
        provider?: Provider
    ): Promise<FinalExecutionOutcome> {
        const signedTx = await this.signTransaction(transaction);

        const rpcProvider = provider || this.provider;

        return rpcProvider.sendTransaction(signedTx);
    }
}
