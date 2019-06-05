'use strict';

import { KeyPair } from '../utils/key_pair';

/**
 * Key store interface for `InMemorySigner`.
 */
export abstract class KeyStore {
    abstract async setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    abstract async getKey(networkId: string, accountId: string): Promise<KeyPair>;
    abstract async clear(): Promise<void>;
}
