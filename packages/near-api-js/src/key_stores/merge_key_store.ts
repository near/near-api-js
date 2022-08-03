import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';

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

interface MergeKeyStoreOptions {
    writeKeyStoreIndex: number;
}

export class MergeKeyStore extends KeyStore {
    private options: MergeKeyStoreOptions;
    keyStores: KeyStore[];

    /**
     * @param keyStores read calls are attempted from start to end of array
     * @param options.writeKeyStoreIndex the keystore index that will receive all write calls
     */
    constructor(keyStores: KeyStore[], options: MergeKeyStoreOptions = { writeKeyStoreIndex: 0 }) {
        super();
        this.options = options;
        this.keyStores = keyStores;
    }

    /**
     * Store a {@link KeyPain} to the first index of a key store array
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    async setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void> {
        await this.keyStores[this.options.writeKeyStoreIndex].setKey(networkId, accountId, keyPair);
    }

    /**
     * Gets a {@link KeyPair} from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(networkId: string, accountId: string): Promise<KeyPair> {
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
    async removeKey(networkId: string, accountId: string): Promise<void> {
        for (const keyStore of this.keyStores) {
            await keyStore.removeKey(networkId, accountId);
        }
    }
    
    /**
     * Removes all items from each key store
     */
    async clear(): Promise<void> {
        for (const keyStore of this.keyStores) {
            await keyStore.clear();
        }
    }
    
    /**
     * Get the network(s) from the array of key stores
     * @returns {Promise<string[]>}
     */    
    async getNetworks(): Promise<string[]> {
        const result = new Set<string>();
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
    async getAccounts(networkId: string): Promise<string[]> {
        const result = new Set<string>();
        for (const keyStore of this.keyStores) {
            for (const account of await keyStore.getAccounts(networkId)) {
                result.add(account);
            }
        }
        return Array.from(result);
    }

    /** @hidden */
    toString(): string {
        return `MergeKeyStore(${this.keyStores.join(', ')})`;
    }
}