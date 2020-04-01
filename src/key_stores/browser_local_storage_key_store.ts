'use strict';

import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';

const LOCAL_STORAGE_KEY_PREFIX = 'nearlib:keystore:';

export class BrowserLocalStorageKeyStore extends KeyStore {
    private localStorage: any;
    private prefix: string;

    constructor(localStorage: any = window.localStorage, prefix = LOCAL_STORAGE_KEY_PREFIX) {
        super();
        this.localStorage = localStorage;
        this.prefix = prefix;
    }

    async setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void> {
        this.localStorage.setItem(this.storageKeyForSecretKey(networkId, accountId), keyPair.toString());
    }

    async getKey(networkId: string, accountId: string): Promise<KeyPair> {
        const value = this.localStorage.getItem(this.storageKeyForSecretKey(networkId, accountId));
        if (!value) {
            return null;
        }
        return KeyPair.fromString(value);
    }

    async removeKey(networkId: string, accountId: string): Promise<void> {
        this.localStorage.removeItem(this.storageKeyForSecretKey(networkId, accountId));
    }

    async clear(): Promise<void> {
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                this.localStorage.removeItem(key);
            }
        }
    }

    async getNetworks(): Promise<string[]> {
        const result = new Set<string>();
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                const parts = key.substring(this.prefix.length).split(':');
                result.add(parts[1]);
            }
        }
        return Array.from(result.values());
    }

    async getAccounts(networkId: string): Promise<string[]> {
        const result = new Array<string>();
        for (const key of this.storageKeys()) {
            if (key.startsWith(this.prefix)) {
                const parts = key.substring(this.prefix.length).split(':');
                if (parts[1] === networkId) {
                    result.push(parts[0]);
                }
            }
        }
        return result;
    }

    private storageKeyForSecretKey(networkId: string, accountId: string): string {
        return `${this.prefix}${accountId}:${networkId}`;
    }

    private *storageKeys(): IterableIterator<string> {
        for (let i = 0; i < this.localStorage.length; i++) {
            yield this.localStorage.key(i);
        }
    }
}
