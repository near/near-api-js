"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnencryptedFileSystemKeyStore = exports.readKeyFile = exports.loadJsonFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const key_pair_1 = require("../utils/key_pair");
const keystore_1 = require("./keystore");
const promisify = (fn) => {
    if (!fn) {
        return () => {
            throw new Error('Trying to use unimplemented function. `fs` module not available in web build?');
        };
    }
    return util_1.promisify(fn);
};
const exists = promisify(fs_1.default.exists);
const readFile = promisify(fs_1.default.readFile);
const writeFile = promisify(fs_1.default.writeFile);
const unlink = promisify(fs_1.default.unlink);
const readdir = promisify(fs_1.default.readdir);
const mkdir = promisify(fs_1.default.mkdir);
async function loadJsonFile(filename) {
    const content = await readFile(filename);
    return JSON.parse(content.toString());
}
exports.loadJsonFile = loadJsonFile;
async function ensureDir(dir) {
    try {
        await mkdir(dir, { recursive: true });
    }
    catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
}
async function readKeyFile(filename) {
    const accountInfo = await loadJsonFile(filename);
    // The private key might be in private_key or secret_key field.
    let privateKey = accountInfo.private_key;
    if (!privateKey && accountInfo.secret_key) {
        privateKey = accountInfo.secret_key;
    }
    return [accountInfo.account_id, key_pair_1.KeyPair.fromString(privateKey)];
}
exports.readKeyFile = readKeyFile;
class UnencryptedFileSystemKeyStore extends keystore_1.KeyStore {
    constructor(keyDir) {
        super();
        this.keyDir = path_1.default.resolve(keyDir);
    }
    /**
     * Sets a storage item in a file, unencrypted
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    async setKey(networkId, accountId, keyPair) {
        await ensureDir(`${this.keyDir}/${networkId}`);
        const content = { account_id: accountId, public_key: keyPair.getPublicKey().toString(), private_key: keyPair.toString() };
        await writeFile(this.getKeyFilePath(networkId, accountId), JSON.stringify(content));
    }
    /**
     * Gets a key from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(networkId, accountId) {
        // Find key / account id.
        if (!await exists(this.getKeyFilePath(networkId, accountId))) {
            return null;
        }
        const accountKeyPair = await readKeyFile(this.getKeyFilePath(networkId, accountId));
        return accountKeyPair[1];
    }
    /**
     * Removes a key from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     */
    async removeKey(networkId, accountId) {
        if (await exists(this.getKeyFilePath(networkId, accountId))) {
            await unlink(this.getKeyFilePath(networkId, accountId));
        }
    }
    /**
     * Removes all items from local storage
     */
    async clear() {
        for (const network of await this.getNetworks()) {
            for (const account of await this.getAccounts(network)) {
                await this.removeKey(network, account);
            }
        }
    }
    getKeyFilePath(networkId, accountId) {
        return `${this.keyDir}/${networkId}/${accountId}.json`;
    }
    /**
     * Get the network(s) from local storage
     * @returns {Promise<string[]>}
     */
    async getNetworks() {
        const files = await readdir(this.keyDir);
        const result = new Array();
        files.forEach((item) => {
            result.push(item);
        });
        return result;
    }
    /**
     * Gets the account(s) from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns{Promise<string[]>}
     */
    async getAccounts(networkId) {
        if (!await exists(`${this.keyDir}/${networkId}`)) {
            return [];
        }
        const files = await readdir(`${this.keyDir}/${networkId}`);
        return files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace(/.json$/, ''));
    }
    toString() {
        return `UnencryptedFileSystemKeyStore(${this.keyDir})`;
    }
}
exports.UnencryptedFileSystemKeyStore = UnencryptedFileSystemKeyStore;
