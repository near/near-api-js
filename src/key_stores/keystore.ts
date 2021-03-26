import { KeyPair } from '../utils/key_pair';

/**
 * KeyStores are passed to {@link Near} via {@link NearConfig}
 * and are used by the {@link InMemorySigner} to sign transactions.
 * 
 * @example {@link connect}
 */
export abstract class KeyStore {
    abstract async setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    abstract async getKey(networkId: string, accountId: string): Promise<KeyPair>;
    abstract async removeKey(networkId: string, accountId: string): Promise<void>;
    abstract async clear(): Promise<void>;
    abstract async getNetworks(): Promise<string[]>;
    abstract async getAccounts(networkId: string): Promise<string[]>;
}
