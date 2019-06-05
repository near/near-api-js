'use strict';

import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';

/**
 * Simple in-memory keystore for testing purposes.
 */
export class InMemoryKeyStore extends KeyStore {
    private keys: { [key: string]: string };

    constructor() {
        super();
        this.keys = {};
    }

    async setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void> {
        this.keys[`${accountId}_${networkId}`] = keyPair.toString();
    }

    async getKey(networkId: string, accountId: string): Promise<KeyPair> {
        return KeyPair.fromString(this.keys[`${accountId}_${networkId}`]);
    }

    async clear(): Promise<void> {
        this.keys = {};
    }
}
