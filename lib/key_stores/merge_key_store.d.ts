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
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    removeKey(networkId: string, accountId: string): Promise<void>;
    clear(): Promise<void>;
    getNetworks(): Promise<string[]>;
    getAccounts(networkId: string): Promise<string[]>;
}
