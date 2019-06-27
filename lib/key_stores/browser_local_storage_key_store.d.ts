import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';
export declare class BrowserLocalStorageKeyStore extends KeyStore {
    private localStorage;
    constructor(localStorage?: any);
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    removeKey(networkId: string, accountId: string): Promise<void>;
    clear(): Promise<void>;
    getNetworks(): Promise<Array<string>>;
    getAccounts(networkId: string): Promise<Array<string>>;
    totalAccounts(): Promise<number>;
}
