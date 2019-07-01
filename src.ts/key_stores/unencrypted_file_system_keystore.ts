'use strict';

import fs from 'fs';
import { promisify } from 'util';

import { KeyPair } from '../utils/key_pair';
import { KeyStore } from './keystore';

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);

/**
 * Format of the account stored on disk.
 */
interface AccountInfo {
    account_id: string;
    private_key: string;
}

export async function loadJsonFile(path: string): Promise<any> {
    const content = await readFile(path);
    return JSON.parse(content.toString());
}

async function ensureDir(path: string): Promise<void> {
    try {
        await mkdir(path, { recursive: true });
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
        await writeFile(this.getKeyFilePath(networkId, accountId), JSON.stringify(content));
    }

    async getKey(networkId: string, accountId: string): Promise<KeyPair> {
        // Find key / account id.
        if (!await exists(this.getKeyFilePath(networkId, accountId))) {
            return null;
        }
        const accountInfo = await loadJsonFile(this.getKeyFilePath(networkId, accountId));
        return KeyPair.fromString(accountInfo.private_key);
    }

    async removeKey(networkId: string, accountId: string): Promise<void> {
        if (await exists(this.getKeyFilePath(networkId, accountId))) {
            await unlink(this.getKeyFilePath(networkId, accountId));
        }
    }

    async clear(): Promise<void> {
        await rmdir(this.keyDir);
    }

    private getKeyFilePath(networkId: string, accountId: string): string {
        return `${this.keyDir}/${networkId}/${accountId}.json`;
    }

    async getNetworks(): Promise<string[]> {
        const files = await readdir(this.keyDir);
        const result = new Array<string>();
        files.forEach((item) => {
            result.push(item);
        });
        return result;
    }

    async getAccounts(networkId: string): Promise<string[]> {
        if (!await exists(`${this.keyDir}/${networkId}`)) {
            return [];
        }
        const files = await readdir(`${this.keyDir}/${networkId}`);
        return files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace(/.json$/, ''));
    }

    async totalAccounts(): Promise<number> {
        let result = 0;
        const networkDirs = await readdir(this.keyDir);
        for (const networkId of networkDirs) {
            result += (await this.getAccounts(networkId)).length;
        }
        return result;
    }
}
