import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';
/**
 * Keystore which can be used to merge multiple key stores into one virtual key store.
 */
export declare class MergeKeyStore extends KeyStore {
    keyStores: KeyStore[];
    /**
     * @param keyStores first keystore gets all write calls, read calls are attempted from start to end of array
     */
    constructor(keyStores: KeyStore[]);
    /**
     * Sets a storage item to the first index of a key store array
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    /**
     * Gets a key from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    /**
     * Removes a key from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     */
    removeKey(networkId: string, accountId: string): Promise<void>;
    /**
     * Removes all items from each key store
     */
    clear(): Promise<void>;
    /**
     * Get the network(s) from the array of key stores
     * @returns {Promise<string[]>}
     */
    getNetworks(): Promise<string[]>;
    /**
     * Gets the account(s) from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns{Promise<string[]>}
     */
    getAccounts(networkId: string): Promise<string[]>;
    toString(): string;
}
