'use strict';

import fs from 'fs';
import { promisify } from 'util';

import { KeyPair } from '../utils/key_pair';
import { KeyStore } from './keystore';

/**
 * Format of the account stored on disk.
 */
type AccountInfo = {
    account_id: string,
    private_key: string,
};

export class UnencryptedFileSystemKeyStore extends KeyStore {
    readonly keyDir: string;

    constructor(keyDir: string) {
        super();
        this.keyDir = keyDir;
    }

    async setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void> {
        if (!await promisify(fs.exists)(`${this.keyDir}/${networkId}`)) {
            await promisify(fs.mkdir)(`${this.keyDir}/${networkId}`);
        }
        const content: AccountInfo = { account_id: accountId, private_key: keyPair.toString() };
        await promisify(fs.writeFile)(this.getKeyFilePath(networkId, accountId), JSON.stringify(content));
    }

    async getKey(networkId: string, accountId: string): Promise<KeyPair> {
        // Find key / account id.
        if (!await promisify(fs.exists)(this.getKeyFilePath(networkId, accountId))) {
            throw new Error(`Key for ${accountId} in ${networkId} not found in ${this.keyDir}`);
        }
        const content = await promisify(fs.readFile)(this.getKeyFilePath(networkId, accountId));
        const accountInfo = JSON.parse(content.toString());
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
        return `${this.keyDir}/${networkId}/${accountId}`
    }

    async getNetworks(): Promise<Array<string>> {
        let files = await promisify(fs.readdir)(this.keyDir);
        let result = new Array<string>();
        files.forEach((item) => {
            result.push(item);
        });
        return result;
    }

    async getAccounts(networkId: string): Promise<Array<string>> {
        if (!await promisify(fs.exists)(`${this.keyDir}/${networkId}`)) {
            return [];
        }
        let files = await promisify(fs.readdir)(`${this.keyDir}/${networkId}`);
        let result = new Array<string>();
        files.forEach((item) => {
            result.push(item);
        });
        return result;
    }
}
