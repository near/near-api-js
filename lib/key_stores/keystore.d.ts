import { KeyPair } from '../utils/key_pair';
/**
 * Key store interface for `InMemorySigner`.
 */
export declare abstract class KeyStore {
    abstract setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    abstract getKey(networkId: string, accountId: string): Promise<KeyPair>;
    abstract removeKey(networkId: string, accountId: string): Promise<void>;
    abstract clear(): Promise<void>;
    abstract getNetworks(): Promise<Array<string>>;
    abstract getAccounts(networkId: string): Promise<Array<string>>;
    abstract totalAccounts(): Promise<number>;
}
