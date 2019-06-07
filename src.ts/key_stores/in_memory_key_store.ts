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
        const value = this.keys[`${accountId}_${networkId}`];
        if (value === undefined) {
            throw new Error(`Key for ${accountId} not found in ${networkId}`);
        }
        return KeyPair.fromString(value);
    }

    async removeKey(networkId: string, accountId: string): Promise<void> {
        delete this.keys[`${accountId}_${networkId}`];
    }

    async clear(): Promise<void> {
        this.keys = {};
    }

    async getNetworks(): Promise<Array<string>> {
        let result = new Set<string>();
        Object.keys(this.keys).forEach((key) => {
            const parts = key.split('_');
            result.add(parts[1]);
        });
        return Array.from(result.values());
    }

    async getAccounts(networkId: string): Promise<Array<string>> {
        let result = new Array<string>();
        Object.keys(this.keys).forEach((key) => {
            const parts = key.split('_');
            if (parts[1] == networkId) {
                result.push(parts[0]);
            }
        });
        return result;
    }
}
