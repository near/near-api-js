import sha256 from 'js-sha256';
import { Signature, KeyPair, PublicKey } from './utils/key_pair';
import { KeyStore } from './key_stores/keystore';
import { InMemoryKeyStore } from './key_stores/in_memory_key_store';

/**
 * General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.
 */
export abstract class Signer {

    /**
     * Creates new key and returns public key.
     */
    abstract async createKey(accountId: string, networkId?: string): Promise<PublicKey>;

    /**
     * Returns public key for given account / network.
     * @param accountId accountId to retrieve from.
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     */
    abstract async getPublicKey(accountId?: string, networkId?: string): Promise<PublicKey>;

    /**
     * Signs given message, by first hashing with sha256.
     * @param message message to sign.
     * @param accountId accountId to use for signing.
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     */
    abstract async signMessage(message: Uint8Array, accountId?: string, networkId?: string): Promise<Signature>;
}

/**
 * Signs using in memory key store.
 */
export class InMemorySigner extends Signer {
    readonly keyStore: KeyStore;

    constructor(keyStore: KeyStore) {
        super();
        this.keyStore = keyStore;
    }

    /**
     * Creates a single account Signer instance with account, network and keyPair provided.
     *
     * Intended to be useful for temporary keys (e.g. claiming a Linkdrop).
     *
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account to assign the key pair to
     * @param keyPair The keyPair to use for signing
     */
    static async fromKeyPair(networkId: string, accountId: string, keyPair: KeyPair): Promise<Signer> {
        const keyStore = new InMemoryKeyStore()
        await keyStore.setKey(networkId, accountId, keyPair);
        return new InMemorySigner(keyStore);
    }

    /**
     * Creates a public key for the account given
     * @param accountId The NEAR account to assign a public key to
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns {Promise<PublicKey>}
     */
    async createKey(accountId: string, networkId: string): Promise<PublicKey> {
        const keyPair = KeyPair.fromRandom('ed25519');
        await this.keyStore.setKey(networkId, accountId, keyPair);
        return keyPair.getPublicKey();
    }

    /**
     * Gets the existing public key for a given account
     * @param accountId The NEAR account to assign a public key to
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns {Promise<PublicKey>} Returns the public key or null if not found
     */
    async getPublicKey(accountId?: string, networkId?: string): Promise<PublicKey> {
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            return null;
        }
        return keyPair.getPublicKey();
    }

    /**
     * @param message A message to be signed, typically a serialized transaction
     * @param accountId the NEAR account signing the message
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns {Promise<Signature>}
     */
    async signMessage(message: Uint8Array, accountId?: string, networkId?: string): Promise<Signature> {
        const hash = new Uint8Array(sha256.sha256.array(message));
        if (!accountId) {
            throw new Error('InMemorySigner requires provided account id');
        }
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            throw new Error(`Key for ${accountId} not found in ${networkId}`);
        }
        return keyPair.sign(hash);
    }

    toString(): string {
        return `InMemorySigner(${this.keyStore})`;
    }
}
