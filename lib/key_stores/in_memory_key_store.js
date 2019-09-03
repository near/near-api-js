'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const keystore_1 = require("./keystore");
const key_pair_1 = require("../utils/key_pair");
/**
 * Simple in-memory keystore for testing purposes.
 */
class InMemoryKeyStore extends keystore_1.KeyStore {
    constructor() {
        super();
        this.keys = {};
    }
    async setKey(networkId, accountId, keyPair) {
        this.keys[`${accountId}:${networkId}`] = keyPair.toString();
    }
    async getKey(networkId, accountId) {
        const value = this.keys[`${accountId}:${networkId}`];
        if (!value) {
            return null;
        }
        return key_pair_1.KeyPair.fromString(value);
    }
    async removeKey(networkId, accountId) {
        delete this.keys[`${accountId}:${networkId}`];
    }
    async clear() {
        this.keys = {};
    }
    async getNetworks() {
        const result = new Set();
        Object.keys(this.keys).forEach((key) => {
            const parts = key.split(':');
            result.add(parts[1]);
        });
        return Array.from(result.values());
    }
    async getAccounts(networkId) {
        const result = new Array();
        Object.keys(this.keys).forEach((key) => {
            const parts = key.split(':');
            if (parts[parts.length - 1] === networkId) {
                result.push(parts.slice(0, parts.length - 1).join(':'));
            }
        });
        return result;
    }
}
exports.InMemoryKeyStore = InMemoryKeyStore;
