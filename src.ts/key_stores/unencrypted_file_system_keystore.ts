'use strict';

import fs from 'fs';
import { promisify } from 'util';

import { KeyPair } from '../utils/key_pair';
import { KeyStore } from './keystore';

/**
 * Format of the account stored on disk.
 */
interface AccountInfo {
    account_id: string;
    private_key: string;
}

export async function loadJsonFile(path: string): Promise<any> {
    const content = await promisify(fs.readFile)(path);
    return JSON.parse(content.toString());
}

async function ensureDir(path: string): Promise<void> {
    try {
        await promisify(fs.mkdir)(path, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') { throw err; }
    }
}

export class UnencryptedFileSystemKeyStore extends KeyStore {
    readonly keyDir: string;

    constructor(keyDir: string) {
        super();
        this.keyDir = keyDir;
    }

    async setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void> {
        await ensureDir(`${this.keyDir}/${networkId}`);
        const content: AccountInfo = { account_id: accountId, private_key: keyPair.toString() };
        await promisify(fs.writeFile)(this.getKeyFilePath(networkId, accountId), JSON.stringify(content));
    }

    async getKey(networkId: string, accountId: string): Promise<KeyPair> {
        // Find key / account id.
        if (!await promisify(fs.exists)(this.getKeyFilePath(networkId, accountId))) {
            return null;
        }
        const accountInfo = await loadJsonFile(this.getKeyFilePath(networkId, accountId));
        return KeyPair.fromString(accountInfo.private_key);
    }

    async removeKey(networkId: string, accountId: string): Promise<void> {
        if (await promisify(fs.exists)(this.getKeyFilePath(networkId, accountId))) {
            await promisify(fs.unlink)(this.getKeyFilePath(networkId, accountId));
        }
    }

    async clear(): Promise<void> {
        await promisify(fs.rmdir)(this.keyDir);
    }

    private getKeyFilePath(networkId: string, accountId: string): string {
        return `${this.keyDir}/${networkId}/${accountId}`;
    }

    async getNetworks(): Promise<string[]> {
        const files = await promisify(fs.readdir)(this.keyDir);
        const result = new Array<string>();
        files.forEach((item) => {
            result.push(item);
        });
        return result;
    }

    async getAccounts(networkId: string): Promise<string[]> {
        if (!await promisify(fs.exists)(`${this.keyDir}/${networkId}`)) {
            return [];
        }
        const files = await promisify(fs.readdir)(`${this.keyDir}/${networkId}`);
        const result = new Array<string>();
        files.forEach((item) => {
            result.push(item);
        });
        return result;
    }

    async totalAccounts(): Promise<number> {
        let result = 0;
        const files = await promisify(fs.readdir)(this.keyDir);
        files.forEach(async (item) => {
            const accounts = await promisify(fs.readdir)(`${this.keyDir}/${item}`);
            accounts.forEach((_) => {
                result++;
            });
        });
        return result;
    }
}
