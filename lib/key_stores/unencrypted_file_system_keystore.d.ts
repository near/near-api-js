import { KeyPair } from '../utils/key_pair';
import { KeyStore } from './keystore';
export declare function loadJsonFile(path: string): Promise<any>;
export declare function readKeyFile(path: string): Promise<[string, KeyPair]>;
export declare class UnencryptedFileSystemKeyStore extends KeyStore {
    readonly keyDir: string;
    constructor(keyDir: string);
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    removeKey(networkId: string, accountId: string): Promise<void>;
    clear(): Promise<void>;
    private getKeyFilePath;
    getNetworks(): Promise<string[]>;
    getAccounts(networkId: string): Promise<string[]>;
}
