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
        this.keys[`${accountId}:${networkId}`] = keyPair.toString();
    }

    async getKey(networkId: string, accountId: string): Promise<KeyPair> {
        const value = this.keys[`${accountId}:${networkId}`];
        if (!value) {
            return null;
        }
        return KeyPair.fromString(value);
    }

    async removeKey(networkId: string, accountId: string): Promise<void> {
        delete this.keys[`${accountId}:${networkId}`];
    }

    async clear(): Promise<void> {
        this.keys = {};
    }

    async getNetworks(): Promise<string[]> {
        const result = new Set<string>();
        Object.keys(this.keys).forEach((key) => {
            const parts = key.split(':');
            result.add(parts[1]);
        });
        return Array.from(result.values());
    }

    async getAccounts(networkId: string): Promise<string[]> {
        const result = new Array<string>();
        Object.keys(this.keys).forEach((key) => {
            const parts = key.split(':');
            if (parts[parts.length - 1] === networkId) {
                result.push(parts.slice(0, parts.length - 1).join(':'));
            }
        });
        return result;
    }
}
