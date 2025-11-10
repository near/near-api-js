import { KeyPair, type KeyPairString } from '@near-js/crypto';
import { MultiContractKeyStore } from '@near-js/keystores';

const LOCAL_STORAGE_KEY_PREFIX = 'near-api-js:keystore:';

/**
 * This class is used to store keys in the browsers local storage.
 *
 * @see [https://docs.near.org/docs/develop/front-end/naj-quick-reference#key-store](https://docs.near.org/docs/develop/front-end/naj-quick-reference#key-store)
 * @example
 * ```js
 * import { connect, keyStores } from 'near-api-js';
 *
 * const keyStore = new keyStores.MultiContractBrowserLocalStorageKeyStore();
 * const config = {
 *   keyStore, // instance of MultiContractBrowserLocalStorageKeyStore
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
export class MultiContractBrowserLocalStorageKeyStore extends MultiContractKeyStore {
    /** @hidden */
    private localStorage: Storage;
    /** @hidden */
    private prefix: string;

    /**
     * @param localStorage defaults to window.localStorage
     * @param prefix defaults to `near-api-js:keystore:`
     */
    constructor(
        localStorage: any = window.localStorage,
        prefix = LOCAL_STORAGE_KEY_PREFIX,
    ) {
        super();
        this.localStorage = localStorage;
        this.prefix = prefix || LOCAL_STORAGE_KEY_PREFIX;
    }

    /**
     * Stores a {@link utils/key_pair!KeyPair} in local storage.
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     * @param contractId The contract to store in local storage
     */
    async setKey(
        networkId: string,
        accountId: string,
        keyPair: KeyPair,
        contractId: string,
    ): Promise<void> {
        this.localStorage.setItem(
            this.storageKeyForSecretKey(networkId, accountId, contractId),
            keyPair.toString(),
        );
    }

    /**
     * Gets a {@link utils/key_pair!KeyPair} from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param contractId The NEAR contract tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(
        networkId: string,
        accountId: string,
        contractId: string,
    ): Promise<KeyPair | null> {
        const value = this.localStorage.getItem(
            this.storageKeyForSecretKey(networkId, accountId, contractId),
        );
        if (!value) {
            return null;
        }
        return KeyPair.fromString(value as KeyPairString);
    }

    /**
     * Removes a {@link utils/key_pair!KeyPair} from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param contractId The NEAR contract tied to the key pair
     */
    async removeKey(
        networkId: string,
        accountId: string,
        contractId: string,
    ): Promise<void> {
        this.localStorage.removeItem(
            this.storageKeyForSecretKey(networkId, accountId, contractId),
        );
    }

    /**
     * Removes all items that start with `prefix` from local storage
     */
    async clear(): Promise<void> {
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                this.localStorage.removeItem(key);
            }
        }
    }

    /**
     * Get the network(s) from local storage
     * @returns {Promise<string[]>}
     */
    async getNetworks(): Promise<string[]> {
        const result = new Set<string>();
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                const parts = key.substring(this.prefix.length).split(':');
                result.add(parts[1]);
            }
        }
        return Array.from(result.values());
    }

    /**
     * Gets the account(s) from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     */
    async getAccounts(networkId: string): Promise<string[]> {
        const result: string[] = [];
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                const parts = key.substring(this.prefix.length).split(':');
                if (parts[1] === networkId) {
                    result.push(parts[0]);
                }
            }
        }
        return result;
    }

    /**
     * Gets the contract(s) from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The targeted account.
     */
    async getContracts(
        networkId: string,
        accountId: string,
    ): Promise<string[]> {
        const result: string[] = [];
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                const parts = key.substring(this.prefix.length).split(':');
                if (parts[1] === networkId && parts[0] === accountId) {
                    result.push(parts[2]);
                }
            }
        }
        return result;
    }

    /**
     * @hidden
     * Helper function to retrieve a local storage key
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the storage keythat's sought
     * @param contractId The NEAR contract tied to the storage keythat's sought
     * @returns {string} An example might be: `near-api-js:keystore:near-friend:default`
     */
    private storageKeyForSecretKey(
        networkId: string,
        accountId: string,
        contractId: string,
    ): string {
        return `${this.prefix}${accountId}:${networkId}:${contractId}`;
    }

    /** @hidden */
    private *storageKeys(): IterableIterator<string> {
        for (let i = 0; i < this.localStorage.length; i++) {
            yield this.localStorage.key(i) as string;
        }
    }
}
