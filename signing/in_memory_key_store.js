/**
 * Simple in-memory keystore for testing purposes.
 */
class InMemoryKeyStore {
    constructor(networkId) {
        this.networkId = networkId;
        this.keys = {};
    }

    async setKey(accountId, key) {
        this.keys[accountId + '_' + this.networkId] = key;
    }

    async getKey(accountId) {
        return this.keys[accountId  + '_' + this.networkId];
    }

    async removeKey(accountId) {
        if (this.getKey(accountId)) {
            this.setKey(accountId, undefined);
        }
    }

    async clear() {
        this.keys = {};
    }
}

module.exports = InMemoryKeyStore;