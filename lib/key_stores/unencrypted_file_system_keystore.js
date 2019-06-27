'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const key_pair_1 = require("../utils/key_pair");
const keystore_1 = require("./keystore");
async function loadJsonFile(path) {
    const content = await util_1.promisify(fs_1.default.readFile)(path);
    return JSON.parse(content.toString());
}
exports.loadJsonFile = loadJsonFile;
async function ensureDir(path) {
    try {
        await util_1.promisify(fs_1.default.mkdir)(path, { recursive: true });
    }
    catch (err) {
        if (err.code !== 'EEXIST')
            throw err;
    }
}
class UnencryptedFileSystemKeyStore extends keystore_1.KeyStore {
    constructor(keyDir) {
        super();
        this.keyDir = keyDir;
    }
    async setKey(networkId, accountId, keyPair) {
        await ensureDir(`${this.keyDir}/${networkId}`);
        const content = { account_id: accountId, private_key: keyPair.toString() };
        await util_1.promisify(fs_1.default.writeFile)(this.getKeyFilePath(networkId, accountId), JSON.stringify(content));
    }
    async getKey(networkId, accountId) {
        // Find key / account id.
        if (!await util_1.promisify(fs_1.default.exists)(this.getKeyFilePath(networkId, accountId))) {
            throw new Error(`Key for ${accountId} in ${networkId} not found in ${this.keyDir}`);
        }
        const accountInfo = await loadJsonFile(this.getKeyFilePath(networkId, accountId));
        return key_pair_1.KeyPair.fromString(accountInfo.private_key);
    }
    async removeKey(networkId, accountId) {
        if (await util_1.promisify(fs_1.default.exists)(this.getKeyFilePath(networkId, accountId))) {
            await util_1.promisify(fs_1.default.unlink)(this.getKeyFilePath(networkId, accountId));
        }
    }
    async clear() {
        await util_1.promisify(fs_1.default.rmdir)(this.keyDir);
    }
    getKeyFilePath(networkId, accountId) {
        return `${this.keyDir}/${networkId}/${accountId}`;
    }
    async getNetworks() {
        let files = await util_1.promisify(fs_1.default.readdir)(this.keyDir);
        let result = new Array();
        files.forEach((item) => {
            result.push(item);
        });
        return result;
    }
    async getAccounts(networkId) {
        if (!await util_1.promisify(fs_1.default.exists)(`${this.keyDir}/${networkId}`)) {
            return [];
        }
        let files = await util_1.promisify(fs_1.default.readdir)(`${this.keyDir}/${networkId}`);
        let result = new Array();
        files.forEach((item) => {
            result.push(item);
        });
        return result;
    }
    async totalAccounts() {
        let result = 0;
        let files = await util_1.promisify(fs_1.default.readdir)(this.keyDir);
        files.forEach(async (item) => {
            let accounts = await util_1.promisify(fs_1.default.readdir)(`${this.keyDir}/${item}`);
            accounts.forEach((_) => {
                result++;
            });
        });
        return result;
    }
}
exports.UnencryptedFileSystemKeyStore = UnencryptedFileSystemKeyStore;
