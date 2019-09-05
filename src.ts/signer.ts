'use strict';

import sha256 from 'js-sha256';
import { Signature, KeyPair, PublicKey } from './utils/key_pair';
import { KeyStore } from './key_stores';

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
     * @param networkId network for this accountId.
     */
    abstract async getPublicKey(accountId?: string, networkId?: string): Promise<PublicKey>;

    /**
     * Signs given hash.
     * @param hash hash to sign.
     * @param accountId accountId to use for signing.
     * @param networkId network for this accontId.
     */
    abstract async signHash(hash: Uint8Array, accountId?: string, networkId?: string): Promise<Signature>;

    /**
     * Signs given message, by first hashing with sha256.
     * @param message message to sign.
     * @param accountId accountId to use for signing.
     * @param networkId network for this accontId.
     */
    async signMessage(message: Uint8Array, accountId?: string, networkId?: string): Promise<Signature> {
        return this.signHash(new Uint8Array(sha256.sha256.array(message)), accountId, networkId);
    }
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

    async createKey(accountId: string, networkId: string): Promise<PublicKey> {
        const keyPair = KeyPair.fromRandom('ed25519');
        await this.keyStore.setKey(networkId, accountId, keyPair);
        return keyPair.getPublicKey();
    }

    async getPublicKey(accountId?: string, networkId?: string): Promise<PublicKey> {
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            return null;
        }
        return keyPair.getPublicKey();
    }

    async signHash(hash: Uint8Array, accountId?: string, networkId?: string): Promise<Signature> {
        if (!accountId) {
            throw new Error('InMemorySigner requires provided account id');
        }
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            throw new Error(`Key for ${accountId} not found in ${networkId}`);
        }
        return keyPair.sign(hash);
    }
}
