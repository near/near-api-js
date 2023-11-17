import { KeyPair } from '@near-js/crypto';

/**
 * KeyStores are passed to {@link near!Near | Near} via {@link near!NearConfig | NearConfig}
 * and are used by the {@link signer!InMemorySigner | InMemorySigner} to sign transactions.
 * 
 * @see {@link near-api-js!connect | connect}
 */
export abstract class KeyStore {
    abstract setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    abstract getKey(networkId: string, accountId: string): Promise<KeyPair>;
    abstract removeKey(networkId: string, accountId: string): Promise<void>;
    abstract clear(): Promise<void>;
    abstract getNetworks(): Promise<string[]>;
    abstract getAccounts(networkId: string): Promise<string[]>;
}
