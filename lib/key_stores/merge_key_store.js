"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeKeyStore = void 0;
const keystore_1 = require("./keystore");
/**
 * Keystore which can be used to merge multiple key stores into one virtual key store.
 *
 * @example
 * ```js
 * const { homedir } = require('os');
 * import { connect, keyStores, utils } from 'near-api-js';
 *
 * const privateKey = '.......';
 * const keyPair = utils.KeyPair.fromString(privateKey);
 *
 * const inMemoryKeyStore = new keyStores.InMemoryKeyStore();
 * inMemoryKeyStore.setKey('testnet', 'example-account.testnet', keyPair);
 *
 * const fileSystemKeyStore = new keyStores.UnencryptedFileSystemKeyStore(`${homedir()}/.near-credentials`);
 *
 * const keyStore = new MergeKeyStore([
 *   inMemoryKeyStore,
 *   fileSystemKeyStore
 * ]);
 * const config = {
 *   keyStore, // instance of MergeKeyStore
 *   networkId: 'testnet',
 *   nodeUrl: 'https://rpc.testnet.near.org',
 *   walletUrl: 'https://wallet.testnet.near.org',
 *   helperUrl: 'https://helper.testnet.near.org',
 *   explorerUrl: 'https://explorer.testnet.near.org'
 * };
 *
 * // inside an async function
 * const near = await connect(config)
 * ```
 */
class MergeKeyStore extends keystore_1.KeyStore {
    /**
     * @param keyStores first keystore gets all write calls, read calls are attempted from start to end of array
     */
    constructor(keyStores) {
        super();
        this.keyStores = keyStores;
    }
    /**
     * Store a {@link KeyPain} to the first index of a key store array
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    async setKey(networkId, accountId, keyPair) {
        await this.keyStores[0].setKey(networkId, accountId, keyPair);
    }
    /**
     * Gets a {@link KeyPair} from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(networkId, accountId) {
        for (const keyStore of this.keyStores) {
            const keyPair = await keyStore.getKey(networkId, accountId);
            if (keyPair) {
                return keyPair;
            }
        }
        return null;
    }
    /**
     * Removes a {@link KeyPair} from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     */
    async removeKey(networkId, accountId) {
        for (const keyStore of this.keyStores) {
            await keyStore.removeKey(networkId, accountId);
        }
    }
    /**
     * Removes all items from each key store
     */
    async clear() {
        for (const keyStore of this.keyStores) {
            await keyStore.clear();
        }
    }
    /**
     * Get the network(s) from the array of key stores
     * @returns {Promise<string[]>}
     */
    async getNetworks() {
        const result = new Set();
        for (const keyStore of this.keyStores) {
            for (const network of await keyStore.getNetworks()) {
                result.add(network);
            }
        }
        return Array.from(result);
    }
    /**
     * Gets the account(s) from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns{Promise<string[]>}
     */
    async getAccounts(networkId) {
        const result = new Set();
        for (const keyStore of this.keyStores) {
            for (const account of await keyStore.getAccounts(networkId)) {
                result.add(account);
            }
        }
        return Array.from(result);
    }
    /** @hidden */
    toString() {
        return `MergeKeyStore(${this.keyStores.join(', ')})`;
    }
}
exports.MergeKeyStore = MergeKeyStore;
