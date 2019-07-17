'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const keystore_1 = require("./keystore");
const key_pair_1 = require("../utils/key_pair");
const LOCAL_STORAGE_KEY_PREFIX = 'nearlib:keystore:';
class BrowserLocalStorageKeyStore extends keystore_1.KeyStore {
    constructor(localStorage = window.localStorage, prefix = LOCAL_STORAGE_KEY_PREFIX) {
        super();
        this.localStorage = localStorage;
        this.prefix = prefix;
    }
    async setKey(networkId, accountId, keyPair) {
        this.localStorage.setItem(this.storageKeyForSecretKey(networkId, accountId), keyPair.toString());
    }
    async getKey(networkId, accountId) {
        const value = this.localStorage.getItem(this.storageKeyForSecretKey(networkId, accountId));
        if (!value) {
            return null;
        }
        return key_pair_1.KeyPair.fromString(value);
    }
    async removeKey(networkId, accountId) {
        this.localStorage.removeItem(this.storageKeyForSecretKey(networkId, accountId));
    }
    async clear() {
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                this.localStorage.removeItem(key);
            }
        }
    }
    async getNetworks() {
        const result = new Set();
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                const parts = key.substring(this.prefix.length).split(':');
                result.add(parts[1]);
            }
        }
        return Array.from(result.values());
    }
    async getAccounts(networkId) {
        const result = new Array();
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                const parts = key.substring(this.prefix.length).split(':');
                if (parts[1] === networkId) {
                    result.push(parts[0]);
                }
            }
        }
        return result;
    }
    storageKeyForSecretKey(networkId, accountId) {
        return `${this.prefix}${accountId}:${networkId}`;
    }
    *storageKeys() {
        for (let i = 0; i < this.localStorage.length; i++) {
            yield this.localStorage.key(i);
        }
    }
}
exports.BrowserLocalStorageKeyStore = BrowserLocalStorageKeyStore;
