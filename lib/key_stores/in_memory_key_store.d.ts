import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';
/**
 * Simple in-memory keystore for testing purposes.
 */
export declare class InMemoryKeyStore extends KeyStore {
    private keys;
    constructor();
    /**
     * Sets an in-memory storage item
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    /**
     * Gets a key from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    /**
     * Removes a key from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     */
    removeKey(networkId: string, accountId: string): Promise<void>;
    /**
     * Sets all in-memory keys to empty objects
     */
    clear(): Promise<void>;
    /**
     * Get the network(s) from in-memory storage
     * @returns {Promise<string[]>}
     */
    getNetworks(): Promise<string[]>;
    /**
     * Gets the account(s) from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns{Promise<string[]>}
     */
    getAccounts(networkId: string): Promise<string[]>;
    toString(): string;
}
