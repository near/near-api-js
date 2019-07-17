import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';
/**
 * Simple in-memory keystore for testing purposes.
 */
export declare class InMemoryKeyStore extends KeyStore {
    private keys;
    constructor();
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    removeKey(networkId: string, accountId: string): Promise<void>;
    clear(): Promise<void>;
    getNetworks(): Promise<string[]>;
    getAccounts(networkId: string): Promise<string[]>;
}
