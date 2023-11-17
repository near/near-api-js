import { KeyPair } from '@near-js/crypto';

/**
 * KeyStores are passed to {@link Near} via {@link NearConfig}
 * and are used by the {@link InMemorySigner | InMemorySigner} to sign transactions.
 * 
 * @see {@link connect }
 */
export abstract class KeyStore {
    abstract setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    abstract getKey(networkId: string, accountId: string): Promise<KeyPair>;
    abstract removeKey(networkId: string, accountId: string): Promise<void>;
    abstract clear(): Promise<void>;
    abstract getNetworks(): Promise<string[]>;
    abstract getAccounts(networkId: string): Promise<string[]>;
}
