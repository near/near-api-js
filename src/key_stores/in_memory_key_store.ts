import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';

/**
 * Simple in-memory keystore for testing purposes.
 */
export class InMemoryKeyStore extends KeyStore {
    private keys: { [key: string]: string };

    constructor() {
        super();
        this.keys = {};
    }

    /**
     * Sets an in-memory storage item
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */    
    async setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void> {
        this.keys[`${accountId}:${networkId}`] = keyPair.toString();
    }

    /**
     * Gets a key from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(networkId: string, accountId: string): Promise<KeyPair> {
        const value = this.keys[`${accountId}:${networkId}`];
        if (!value) {
            return null;
        }
        return KeyPair.fromString(value);
    }

    /**
     * Removes a key from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     */
    async removeKey(networkId: string, accountId: string): Promise<void> {
        delete this.keys[`${accountId}:${networkId}`];
    }

    /**
     * Sets all in-memory keys to empty objects
     */
    async clear(): Promise<void> {
        this.keys = {};
    }

    /**
     * Get the network(s) from in-memory storage
     * @returns {Promise<string[]>}
     */
    async getNetworks(): Promise<string[]> {
        const result = new Set<string>();
        Object.keys(this.keys).forEach((key) => {
            const parts = key.split(':');
            result.add(parts[1]);
        });
        return Array.from(result.values());
    }

    /**
     * Gets the account(s) from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns{Promise<string[]>}
     */
    async getAccounts(networkId: string): Promise<string[]> {
        const result = new Array<string>();
        Object.keys(this.keys).forEach((key) => {
            const parts = key.split(':');
            if (parts[parts.length - 1] === networkId) {
                result.push(parts.slice(0, parts.length - 1).join(':'));
            }
        });
        return result;
    }

    toString(): string {
        return 'InMemoryKeyStore';
    }
}
