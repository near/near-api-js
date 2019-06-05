'use strict';

import sha256 from 'js-sha256';
import { Signature } from './utils/key_pair';
import { KeyStore } from './key_stores';

/**
 * General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.
 */
export abstract class Signer {
    /**
     * Signs given hash.
     * @param hash hash to sign.
     * @param accountId accountId to use for signing.
     */
    abstract async signHash(hash: Uint8Array, accountId?: string, networkId?: string): Promise<Signature>;

    /**
     * Signs given message, by first hashing with sha256.
     * @param message message to sign.
     * @param accountId accountId to use for signing.
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

    async signHash(hash: Uint8Array, accountId?: string, networkId?: string): Promise<Signature> {
        if (!accountId) {
            throw new Error("InMemorySigner requires provided account id");
        }
        let keyPair = await this.keyStore.getKey(networkId, accountId);
        return keyPair.sign(hash);
    }
}
