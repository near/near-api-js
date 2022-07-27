import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';

/**
 * Simple in-memory keystore for mainly for testing purposes.
 * 
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#key-store}
 * @example
 * ```js
 * import { connect, keyStores, utils } from 'near-api-js';
 * 
 * const privateKey = '.......';
 * const keyPair = utils.KeyPair.fromString(privateKey);
 * 
 * const keyStore = new keyStores.InMemoryKeyStore();
 * keyStore.setKey('testnet', 'example-account.testnet', keyPair);
 * 
 * const config = { 
 *   keyStore, // instance of InMemoryKeyStore
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
export class InMemoryKeyStore extends KeyStore {
    /** @hidden */
    private keys: { [key: string]: string };

    constructor() {
        super();
        this.keys = {};
    }

    /**
     * Stores a {@KeyPair} in in-memory storage item
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */    
    async setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void> {
        this.keys[`${accountId}:${networkId}`] = keyPair.toString();
    }

    /**
     * Gets a {@link KeyPair} from in-memory storage
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
     * Removes a {@link KeyPair} from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     */
    async removeKey(networkId: string, accountId: string): Promise<void> {
        delete this.keys[`${accountId}:${networkId}`];
    }

    /**
     * Removes all {@link KeyPairs} from in-memory storage
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

    /** @hidden */
    toString(): string {
        return 'InMemoryKeyStore';
    }
}
