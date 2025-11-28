import { sha256 } from '@noble/hashes/sha256';
import { type Schema, serialize } from 'borsh';
import { KeyType, type PublicKey } from '../crypto/index.js';
import {
    type DelegateAction,
    encodeDelegateAction,
    encodeTransaction,
    Signature,
    SignedDelegate,
    SignedTransaction,
    type Transaction,
} from '../transactions/index.js';

export interface SignMessageParams {
    message: string; // The message that wants to be transmitted.
    recipient: string; // The recipient to whom the message is destined (e.g. "alice.near" or "myapp.com").
    nonce: Uint8Array; // A nonce that uniquely identifies this instance of the message, denoted as a 32 bytes array (a fixed `Buffer` in JS/TS).
    callbackUrl?: string; // Optional, applicable to browser wallets (e.g. MyNearWallet). The URL to call after the signing process. Defaults to `window.location.href`.
}

export interface SignedMessage {
    accountId: string; // The account name to which the publicKey corresponds as plain text (e.g. "alice.near")
    publicKey: PublicKey; // The public counterpart of the key used to sign, expressed as a string with format "<key-type>:<base58-key-bytes>" (e.g. "ed25519:6TupyNrcHGTt5XRLmHTc2KGaiSbjhQi1KHtCXTgbcr4Y")
    signature: Uint8Array; // The bytes representation of the signature.
    state?: string; // Optional, applicable to browser wallets (e.g. MyNearWallet). The same state passed in SignMessageParams.
}

export interface SignTransactionReturn {
    txHash: Uint8Array;
    signedTransaction: SignedTransaction;
}

export interface SignDelegateActionReturn {
    delegateHash: Uint8Array;
    signedDelegate: SignedDelegate;
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
 *
 * The signer must return a valid PublicKey from `getPublicKey()`, and must implement raw byte signing
 * that can be verified with the corresponding public key. (To verify the signature, serialize and hash transaction/delegate action,
 * or get payload hash for NEP-413 message from `utils.ts` and verify with the public key).
 */
export abstract class Signer {
    /**
     * Returns public key for given signer
     */
    public abstract getPublicKey(): Promise<PublicKey>;

    /**
     * Implement this method to sign given bytes payload.
     * @param bytes - The payload to sign.
     * @returns {Promise<Uint8Array>} - Promise of the bytes representation of the signature.
     */
    protected abstract signBytes(bytes: Uint8Array): Promise<Uint8Array>;

    /**
     * Signs given message according to NEP-413 requirements
     * @see https://github.com/near/NEPs/blob/master/neps/nep-0413.md
     *
     * @param accountId - The account name to which the public key corresponds (e.g. "alice.near").
     * @param params - The parameters including message, recipient, nonce, and optional callbackUrl.
     */
    public async signNep413Message(accountId: string, params: SignMessageParams): Promise<SignedMessage> {
        if (params.nonce.length !== 32) throw new Error('Nonce must be exactly 32 bytes long');

        // 2**31 + 413 == 2147484061
        const PREFIX = 2147484061;
        const serializedPrefix = serialize('u32', PREFIX);
        const serializedParams = serialize(Nep413MessageSchema, params);

        const serializedPayload = new Uint8Array(serializedPrefix.length + serializedParams.length);
        serializedPayload.set(serializedPrefix);
        serializedPayload.set(serializedParams, serializedPrefix.length);

        const hash = new Uint8Array(sha256(serializedPayload));

        const signature = await this.signBytes(hash);
        return {
            accountId: accountId,
            publicKey: await this.getPublicKey(),
            signature: signature,
            state: params.callbackUrl,
        };
    }

    /**
     * Signs given transaction.
     * @param transaction - The transaction to sign.
     * @returns {Promise<[Uint8Array, SignedTransaction]>} - Promise of the hash that can be verified and signed transaction.
     */
    public async signTransaction(transaction: Transaction): Promise<SignTransactionReturn> {
        const pk = await this.getPublicKey();

        if (transaction.publicKey.toString() !== pk.toString())
            throw new Error("The public key doesn't match the signer's key");

        const serializedTx = encodeTransaction(transaction);
        const txHash = new Uint8Array(sha256(serializedTx));

        const signature = await this.signBytes(txHash);
        const signedTx = new SignedTransaction({
            transaction,
            signature: new Signature({
                keyType: transaction.publicKey.ed25519Key ? KeyType.ED25519 : KeyType.SECP256K1,
                data: signature,
            }),
        });
        return { txHash, signedTransaction: signedTx };
    }

    /**
     * Signs given delegate action.
     * @param delegateAction - The delegate action to sign.
     * @returns {Promise<[Uint8Array, SignedDelegate]>} - Promise of the hash that can be verified and signed delegate action.
     */
    public async signDelegateAction(delegateAction: DelegateAction): Promise<SignDelegateActionReturn> {
        const pk = await this.getPublicKey();

        if (delegateAction.publicKey.toString() !== pk.toString())
            throw new Error("The public key doesn't match the signer's key");

        const serializedDelegate = encodeDelegateAction(delegateAction);
        const delegateHash = new Uint8Array(sha256(serializedDelegate));

        const signature = await this.signBytes(delegateHash);
        const signedDelegate = new SignedDelegate({
            delegateAction,
            signature: new Signature({
                keyType: pk.keyType,
                data: signature,
            }),
        });

        return { delegateHash, signedDelegate };
    }
}
