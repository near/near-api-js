"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return (0, util_1.promisify)(fn);
};
const exists = promisify(fs_1.default.exists);
const readFile = promisify(fs_1.default.readFile);
const writeFile = promisify(fs_1.default.writeFile);
const unlink = promisify(fs_1.default.unlink);
const readdir = promisify(fs_1.default.readdir);
const mkdir = promisify(fs_1.default.mkdir);
/** @hidden */
function loadJsonFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield readFile(filename);
        return JSON.parse(content.toString());
    });
}
exports.loadJsonFile = loadJsonFile;
function ensureDir(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mkdir(dir, { recursive: true });
        }
        catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
    });
}
/** @hidden */
function readKeyFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const accountInfo = yield loadJsonFile(filename);
        // The private key might be in private_key or secret_key field.
        let privateKey = accountInfo.private_key;
        if (!privateKey && accountInfo.secret_key) {
            privateKey = accountInfo.secret_key;
        }
        return [accountInfo.account_id, key_pair_1.KeyPair.fromString(privateKey)];
    });
}
exports.readKeyFile = readKeyFile;
/**
 * This module contains the {@link UnencryptedFileSystemKeyStore} class which is used to store keys on the file system.
 *
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#key-store}
 * @example
 * ```js
 * const { homedir } = require('os');
 * const { connect, keyStores } = require('near-api-js');
 *
 * const keyStore = new keyStores.UnencryptedFileSystemKeyStore(`${homedir()}/.near-credentials`);
 * const config = {
 *   keyStore, // instance of UnencryptedFileSystemKeyStore
 *   networkId: 'testnet',
 *   nodeUrl: 'https://rpc.testnet.near.org',
 *   walletUrl: 'https://wallet.testnet.near.org',
 *   helperUrl: 'https://helper.testnet.near.org',
 *   explorerUrl: 'https://explorer.testnet.near.org'
 * };
 *
 * // inside an async function
 * const near = await connect(config)
 * ```
 */
class UnencryptedFileSystemKeyStore extends keystore_1.KeyStore {
    /**
     * @param keyDir base directory for key storage. Keys will be stored in `keyDir/networkId/accountId.json`
     */
    constructor(keyDir) {
        super();
        this.keyDir = path_1.default.resolve(keyDir);
    }
    /**
     * Store a {@link KeyPair} in an unencrypted file
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(networkId, accountId, keyPair) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ensureDir(`${this.keyDir}/${networkId}`);
            const content = { account_id: accountId, public_key: keyPair.getPublicKey().toString(), private_key: keyPair.toString() };
            yield writeFile(this.getKeyFilePath(networkId, accountId), JSON.stringify(content), { mode: 0o600 });
        });
    }
    /**
     * Gets a {@link KeyPair} from an unencrypted file
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(networkId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find key / account id.
            if (!(yield exists(this.getKeyFilePath(networkId, accountId)))) {
                return null;
            }
            const accountKeyPair = yield readKeyFile(this.getKeyFilePath(networkId, accountId));
            return accountKeyPair[1];
        });
    }
    /**
     * Deletes an unencrypted file holding a {@link KeyPair}
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     */
    removeKey(networkId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield exists(this.getKeyFilePath(networkId, accountId))) {
                yield unlink(this.getKeyFilePath(networkId, accountId));
            }
        });
    }
    /**
     * Deletes all unencrypted files from the `keyDir` path.
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const network of yield this.getNetworks()) {
                for (const account of yield this.getAccounts(network)) {
                    yield this.removeKey(network, account);
                }
            }
        });
    }
    /** @hidden */
    getKeyFilePath(networkId, accountId) {
        return `${this.keyDir}/${networkId}/${accountId}.json`;
    }
    /**
     * Get the network(s) from files in `keyDir`
     * @returns {Promise<string[]>}
     */
    getNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield readdir(this.keyDir);
            const result = new Array();
            files.forEach((item) => {
                result.push(item);
            });
            return result;
        });
    }
    /**
     * Gets the account(s) files in `keyDir/networkId`
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns{Promise<string[]>}
     */
    getAccounts(networkId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield exists(`${this.keyDir}/${networkId}`))) {
                return [];
            }
            const files = yield readdir(`${this.keyDir}/${networkId}`);
            return files
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace(/.json$/, ''));
        });
    }
    /** @hidden */
    toString() {
        return `UnencryptedFileSystemKeyStore(${this.keyDir})`;
    }
}
exports.UnencryptedFileSystemKeyStore = UnencryptedFileSystemKeyStore;
