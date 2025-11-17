import { KeyPair, PublicKey, KeyPairString, KeyType } from '../crypto';
import { sha256 } from '@noble/hashes/sha256';

import {
    Nep413MessageSchema,
    SignedMessage,
    Signer,
    SignMessageParams,
} from './signer';
import {
    Transaction,
    SignedTransaction,
    encodeTransaction,
    Signature,
    DelegateAction,
    SignedDelegate,
    encodeDelegateAction,
} from '../transactions';
import { serialize } from 'borsh';

/**
 * Signs using in memory key store.
 */
export class KeyPairSigner extends Signer {
    private readonly key: KeyPair;

    constructor(key: KeyPair) {
        super();
        this.key = key;
    }

    public static fromSecretKey(encodedKey: KeyPairString): KeyPairSigner {
        const key = KeyPair.fromString(encodedKey);

        return new KeyPairSigner(key);
    }

    public async getPublicKey(): Promise<PublicKey> {
        return this.key.getPublicKey();
    }

    public async signNep413Message(
        message: string,
        accountId: string,
        recipient: string,
        nonce: Uint8Array,
        callbackUrl?: string
    ): Promise<SignedMessage> {
        if (nonce.length !== 32)
            throw new Error('Nonce must be exactly 32 bytes long');

        const pk = this.key.getPublicKey();

        // 2**31 + 413 == 2147484061
        const PREFIX = 2147484061;
        const serializedPrefix = serialize('u32', PREFIX);

        const params: SignMessageParams = {
            message,
            recipient,
            nonce,
            callbackUrl
        };
        const serializedParams = serialize(Nep413MessageSchema, params);

        const serializedMessage = new Uint8Array(
            serializedPrefix.length + serializedParams.length
        );
        serializedMessage.set(serializedPrefix);
        serializedMessage.set(serializedParams, serializedPrefix.length);

        const hash = new Uint8Array(sha256(serializedMessage));

        const { signature } = this.key.sign(hash);

        return {
            accountId: accountId,
            publicKey: pk,
            signature: signature,
        };
    }

    public async signTransaction(
        transaction: Transaction
    ): Promise<[Uint8Array, SignedTransaction]> {
        const pk = this.key.getPublicKey();

        if (transaction.publicKey.toString() !== pk.toString())
            throw new Error('The public key doesn\'t match the signer\'s key');

        const message = encodeTransaction(transaction);
        const hash = new Uint8Array(sha256(message));

        const { signature } = this.key.sign(hash);
        const signedTx = new SignedTransaction({
            transaction,
            signature: new Signature({
                keyType: transaction.publicKey.ed25519Key
                    ? KeyType.ED25519
                    : KeyType.SECP256K1,
                data: signature,
            }),
        });

        return [hash, signedTx];
    }

    public async signDelegateAction(
        delegateAction: DelegateAction
    ): Promise<[Uint8Array, SignedDelegate]> {
        const pk = this.key.getPublicKey();

        if (delegateAction.publicKey.toString() !== pk.toString())
            throw new Error('The public key doesn\'t match the signer\'s key');

        const message = encodeDelegateAction(delegateAction);
        const hash = new Uint8Array(sha256(message));

        const { signature } = this.key.sign(hash);
        const signedDelegate = new SignedDelegate({
            delegateAction,
            signature: new Signature({
                keyType: pk.keyType,
                data: signature,
            }),
        });

        return [hash, signedDelegate];
    }
}
