"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const account_1 = require("./account");
const connection_1 = require("./connection");
const contract_1 = require("./contract");
const unencrypted_file_system_keystore_1 = require("./key_stores/unencrypted_file_system_keystore");
const key_pair_1 = require("./utils/key_pair");
const account_creator_1 = require("./account_creator");
const key_stores_1 = require("./key_stores");
class Near {
    constructor(config) {
        this.config = config;
        this.connection = connection_1.Connection.fromConfig({
            networkId: config.networkId,
            provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl } },
            signer: { type: 'InMemorySigner', keyStore: config.deps.keyStore }
        });
        if (config.masterAccount) {
            // TODO: figure out better way of specifiying initial balance.
            this.accountCreator = new account_creator_1.LocalAccountCreator(new account_1.Account(this.connection, config.masterAccount), new bn_js_1.default(config.initialBalance) || new bn_js_1.default(1000 * 1000 * 1000 * 1000));
        }
        else if (config.helperUrl) {
            this.accountCreator = new account_creator_1.UrlAccountCreator(this.connection, config.helperUrl);
        }
        else {
            this.accountCreator = null;
        }
    }
    async account(accountId) {
        const account = new account_1.Account(this.connection, accountId);
        await account.state();
        return account;
    }
    async createAccount(accountId, publicKey) {
        if (!this.accountCreator) {
            throw new Error('Must specify account creator, either via masterAccount or helperUrl configuration settings.');
        }
        await this.accountCreator.createAccount(accountId, publicKey);
        return new account_1.Account(this.connection, accountId);
    }
    /**
     * Backwards compatibility method. Use `new nearlib.Contract(yourAccount, contractId, { viewMethods, changeMethods })` instead.
     * @param contractId
     * @param options
     */
    async loadContract(contractId, options) {
        console.warn('near.loadContract is deprecated. Use `new nearlib.Contract(yourAccount, contractId, { viewMethods, changeMethods })` instead.');
        const account = new account_1.Account(this.connection, options.sender);
        return new contract_1.Contract(account, contractId, options);
    }
    /**
     * Backwards compatibility method. Use `contractAccount.deployContract` or `yourAccount.createAndDeployContract` instead.
     * @param contractId
     * @param wasmByteArray
     */
    async deployContract(contractId, wasmByteArray) {
        console.warn('near.deployContract is deprecated. Use `contractAccount.deployContract` or `yourAccount.createAndDeployContract` instead.');
        const account = new account_1.Account(this.connection, contractId);
        const result = await account.deployContract(wasmByteArray);
        return result.logs[0].hash;
    }
    /**
     * Backwards compatibility method. Use `yourAccount.sendMoney` instead.
     * @param amount
     * @param originator
     * @param receiver
     */
    async sendTokens(amount, originator, receiver) {
        console.warn('near.sendTokens is deprecated. Use `yourAccount.sendMoney` instead.');
        const account = new account_1.Account(this.connection, originator);
        const result = await account.sendMoney(receiver, amount);
        return result.logs[0].hash;
    }
}
exports.Near = Near;
async function connect(config) {
    // Try to find extra key in `KeyPath` if provided.
    if (config.keyPath && config.deps && config.deps.keyStore) {
        try {
            const keyFile = await unencrypted_file_system_keystore_1.loadJsonFile(config.keyPath);
            if (keyFile.account_id) {
                // TODO: Only load key if network ID matches
                const keyPair = new key_pair_1.KeyPairEd25519(keyFile.secret_key);
                const keyPathStore = new key_stores_1.InMemoryKeyStore();
                await keyPathStore.setKey(config.networkId, keyFile.account_id, keyPair);
                if (!config.masterAccount) {
                    config.masterAccount = keyFile.account_id;
                }
                config.deps.keyStore = new key_stores_1.MergeKeyStore([config.deps.keyStore, keyPathStore]);
                console.log(`Loaded master account ${keyFile.account_id} key from ${config.keyPath} with public key = ${keyPair.getPublicKey()}`);
            }
        }
        catch (error) {
            console.warn(`Failed to load master account key from ${config.keyPath}: ${error}`);
        }
    }
    return new Near(config);
}
exports.connect = connect;
