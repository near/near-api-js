'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const keystore_1 = require("./keystore");
const key_pair_1 = require("../utils/key_pair");
const LOCAL_STORAGE_SECRET_KEY_SUFFIX = '_secretkey';
function storageKeyForSecretKey(networkId, accountId) {
    return `${accountId}_${networkId}${LOCAL_STORAGE_SECRET_KEY_SUFFIX}`;
}
class BrowserLocalStorageKeyStore extends keystore_1.KeyStore {
    constructor(localStorage = window.localStorage) {
        super();
        this.localStorage = localStorage;
    }
    async setKey(networkId, accountId, keyPair) {
        this.localStorage.setItem(storageKeyForSecretKey(networkId, accountId), keyPair.toString());
    }
    async getKey(networkId, accountId) {
        const value = this.localStorage.getItem(storageKeyForSecretKey(networkId, accountId));
        if (!value) {
            return null;
        }
        return key_pair_1.KeyPair.fromString(value);
    }
    async removeKey(networkId, accountId) {
        this.localStorage.removeItem(storageKeyForSecretKey(networkId, accountId));
    }
    async clear() {
        Object.keys(this.localStorage).forEach((key) => {
            if (key.endsWith(LOCAL_STORAGE_SECRET_KEY_SUFFIX)) {
                this.localStorage.removeItem(key);
            }
        });
    }
    async getNetworks() {
        let result = new Set();
        Object.keys(this.localStorage).forEach((key) => {
            if (key.endsWith(LOCAL_STORAGE_SECRET_KEY_SUFFIX)) {
                const parts = key.split('_');
                result.add(parts[1]);
            }
        });
        return Array.from(result.values());
    }
    async getAccounts(networkId) {
        let result = new Array();
        Object.keys(this.localStorage).forEach((key) => {
            if (key.endsWith(LOCAL_STORAGE_SECRET_KEY_SUFFIX)) {
                const parts = key.split('_');
                if (parts[1] == networkId) {
                    result.push(parts[0]);
                }
            }
        });
        return result;
    }
    async totalAccounts() {
        let result = 0;
        Object.keys(this.localStorage).forEach((key) => {
            if (key.endsWith(LOCAL_STORAGE_SECRET_KEY_SUFFIX)) {
                result++;
            }
        });
        return result;
    }
}
exports.BrowserLocalStorageKeyStore = BrowserLocalStorageKeyStore;
