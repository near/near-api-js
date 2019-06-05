'use strict';

import { KeyPair } from '../utils/key_pair';
import { KeyStore } from './keystore';

export class UnEncryptedFileSystemKeyStore extends KeyStore {
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getKey(networkId: string, accountId: string): Promise<KeyPair> {
        throw new Error("Method not implemented.");
    }
    clear(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
