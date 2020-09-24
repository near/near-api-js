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

    /**
     * Sets a storage item to the first index of a key store array
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    async setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void> {
        await this.keyStores[0].setKey(networkId, accountId, keyPair);
    }

    /**
     * Gets a key from the array of key stores
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
     * Removes a key from the array of key stores
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

    toString(): string {
        return `MergeKeyStore(${this.keyStores.join(', ')})`;
    }
}