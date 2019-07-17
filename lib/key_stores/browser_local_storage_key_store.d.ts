import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';
export declare class BrowserLocalStorageKeyStore extends KeyStore {
    private localStorage;
    private prefix;
    constructor(localStorage?: any, prefix?: string);
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    removeKey(networkId: string, accountId: string): Promise<void>;
    clear(): Promise<void>;
    getNetworks(): Promise<string[]>;
    getAccounts(networkId: string): Promise<string[]>;
    private storageKeyForSecretKey;
    private storageKeys;
}
