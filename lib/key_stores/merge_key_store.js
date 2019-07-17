'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const keystore_1 = require("./keystore");
/**
 * Keystore which can be used to merge multiple key stores into one virtual key store.
 */
class MergeKeyStore extends keystore_1.KeyStore {
    /**
     * @param keyStores first keystore gets all write calls, read calls are attempted from start to end of array
     */
    constructor(keyStores) {
        super();
        this.keyStores = keyStores;
    }
    async setKey(networkId, accountId, keyPair) {
        this.keyStores[0].setKey(networkId, accountId, keyPair);
    }
    async getKey(networkId, accountId) {
        for (const keyStore of this.keyStores) {
            const keyPair = await keyStore.getKey(networkId, accountId);
            if (keyPair) {
                return keyPair;
            }
        }
        return null;
    }
    async removeKey(networkId, accountId) {
        for (const keyStore of this.keyStores) {
            keyStore.removeKey(networkId, accountId);
        }
    }
    async clear() {
        for (const keyStore of this.keyStores) {
            keyStore.clear();
        }
    }
    async getNetworks() {
        const result = new Set();
        for (const keyStore of this.keyStores) {
            for (const network of await keyStore.getNetworks()) {
                result.add(network);
            }
        }
        return Array.from(result);
    }
    async getAccounts(networkId) {
        const result = new Set();
        for (const keyStore of this.keyStores) {
            for (const account of await keyStore.getAccounts(networkId)) {
                result.add(account);
            }
        }
        return Array.from(result);
    }
}
exports.MergeKeyStore = MergeKeyStore;
