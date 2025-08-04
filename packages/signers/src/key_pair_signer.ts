import { KeyPair, PublicKey, KeyPairString, KeyType } from '@near-js/crypto';
import { sha256 } from '@noble/hashes/sha256';

import { Signer } from './signer';
import {
    Transaction,
    SignedTransaction,
    encodeTransaction,
    Signature,
    DelegateAction,
    SignedDelegate,
    encodeDelegateAction,
} from '@near-js/transactions';

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

    protected async signMessagePayload(bytes: Uint8Array): Promise<Uint8Array> {
        const { signature } = this.key.sign(bytes);
        return new Uint8Array(signature);
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
