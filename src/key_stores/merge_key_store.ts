'use strict';

import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';

/**
 * Keystore which can be used to merge multiple key stores into one virtual key store.
 */
export class MergeKeyStore extends KeyStore {
    keyStores: KeyStore[];

    /**
     * @param keyStores first keystore gets all write calls, read calls are attempted from start to end of array
     */
    constructor(keyStores: KeyStore[]) {
        super();
        this.keyStores = keyStores;
    }

    async setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void> {
        this.keyStores[0].setKey(networkId, accountId, keyPair);
    }

    async getKey(networkId: string, accountId: string): Promise<KeyPair> {
        for (const keyStore of this.keyStores) {
            const keyPair = await keyStore.getKey(networkId, accountId);
            if (keyPair) {
                return keyPair;
            }
        }
        return null;
    }

    async removeKey(networkId: string, accountId: string): Promise<void> {
        for (const keyStore of this.keyStores) {
            keyStore.removeKey(networkId, accountId);
        }
    }

    async clear(): Promise<void> {
        for (const keyStore of this.keyStores) {
            keyStore.clear();
        }
    }

    async getNetworks(): Promise<string[]> {
        const result = new Set<string>();
        for (const keyStore of this.keyStores) {
            for (const network of await keyStore.getNetworks()) {
                result.add(network);
            }
        }
        return Array.from(result);
    }

    async getAccounts(networkId: string): Promise<string[]> {
        const result = new Set<string>();
        for (const keyStore of this.keyStores) {
            for (const account of await keyStore.getAccounts(networkId)) {
                result.add(account);
            }
        }
        return Array.from(result);
    }
}
