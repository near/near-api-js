import { KeyPairSigner } from './key_pair_signer.js';
import { KeyPair, type KeyPairString, type PublicKey } from '../crypto/index.js';
import {
    type DelegateAction,
    type Transaction,
} from '../transactions/index.js';
import { SignedMessage, Signer, type SignDelegateActionReturn, type SignTransactionReturn } from './signer.js';
import { MessagePayload } from '../nep413/schema.js';

/**
 * Signs using Multiple Keys, rotating through them for parallel transaction signing.
 *
 * This signer is designed for high-throughput scenarios where you want to sign
 * multiple transactions in parallel using different keys (to avoid nonce conflicts).
 *
 * @example
 * ```ts
 * const signer = new MultiKeySigner([key1, key2, key3]);
 * const account = new Account('account.near', provider, signer);
 *
 * // These will use different keys in rotation
 * await Promise.all([
 *   account.transfer({ receiverId: 'bob.near', amount: 1n }),
 *   account.transfer({ receiverId: 'alice.near', amount: 2n }),
 *   account.transfer({ receiverId: 'carol.near', amount: 3n }),
 * ]);
 * ```
 */
export class MultiKeySigner extends Signer {
    private readonly keys: KeyPair[];
    private keyIndex: number = 0;

    constructor(keys: KeyPair[]) {
        super();
        if (keys.length === 0) {
            throw new Error('MultiKeySigner requires at least one key');
        }
        this.keys = keys;
    }

    public static fromSecretKeys(encodedKeys: KeyPairString[]): MultiKeySigner {
        const keys = encodedKeys.map(KeyPair.fromString);
        return new MultiKeySigner(keys);
    }

    /**
     * Returns the next public key in rotation.
     * Each call rotates to the next key, enabling parallel transaction creation
     * where each transaction gets a different key.
     */
    public async getPublicKey(): Promise<PublicKey> {
        const key = this.keys[this.keyIndex]!;
        this.keyIndex = (this.keyIndex + 1) % this.keys.length;
        return key.getPublicKey();
    }

    /**
     * Find the key pair that matches a given public key.
     */
    private findKeyByPublicKey(publicKey: PublicKey): KeyPair {
        const pkString = publicKey.toString();
        const key = this.keys.find((k) => k.getPublicKey().toString() === pkString);
        if (!key) {
            throw new Error(
                `No matching key found for public key ${pkString}. ` +
                    `Available keys: ${this.keys.map((k) => k.getPublicKey().toString()).join(', ')}`
            );
        }
        return key;
    }

    protected async signBytes(bytes: Uint8Array): Promise<Uint8Array> {
        throw new Error('MultiKeySigner does not support signBytes directly. Use signTransaction or signDelegateAction instead.');
    }

    /**
     * Signs a NEP-413 message using the first key in the set.
     * This is because NEP-413 messages are not typically parallelized,
     * so we use a consistent key for signing.
     */
    public override async signNep413Message(accountId: string, params: MessagePayload): Promise<SignedMessage> {
        const signer = new KeyPairSigner(this.keys[0]);
        return signer.signNep413Message(accountId, params);
    }

    /**
     * Signs a transaction using the key that matches the transaction's public key.
     * This ensures parallel transactions each get signed with the correct key.
     */
    public override async signTransaction(transaction: Transaction): Promise<SignTransactionReturn> {
        const key = this.findKeyByPublicKey(transaction.publicKey);
        const signer = new KeyPairSigner(key);
        return signer.signTransaction(transaction);
    }

    /**
     * Signs a delegate action using the key that matches the action's public key.
     * This ensures parallel meta-transactions each get signed with the correct key.
     */
    public override async signDelegateAction(delegateAction: DelegateAction): Promise<SignDelegateActionReturn> {
        const key = this.findKeyByPublicKey(delegateAction.publicKey);
        const signer = new KeyPairSigner(key);
        return signer.signDelegateAction(delegateAction);
    }
}
