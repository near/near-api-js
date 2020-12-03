"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.Near = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const account_1 = require("./account");
const connection_1 = require("./connection");
const contract_1 = require("./contract");
const unencrypted_file_system_keystore_1 = require("./key_stores/unencrypted_file_system_keystore");
const account_creator_1 = require("./account_creator");
const key_stores_1 = require("./key_stores");
class Near {
    constructor(config) {
        this.config = config;
        this.connection = connection_1.Connection.fromConfig({
            networkId: config.networkId,
            provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl } },
            signer: config.signer || { type: 'InMemorySigner', keyStore: config.keyStore || config.deps.keyStore }
        });
        if (config.masterAccount) {
            // TODO: figure out better way of specifiying initial balance.
            // Hardcoded number below must be enough to pay the gas cost to dev-deploy with near-shell for multiple times
            const initialBalance = config.initialBalance ? new bn_js_1.default(config.initialBalance) : new bn_js_1.default('500000000000000000000000000');
            this.accountCreator = new account_creator_1.LocalAccountCreator(new account_1.Account(this.connection, config.masterAccount), initialBalance);
        }
        else if (config.helperUrl) {
            this.accountCreator = new account_creator_1.UrlAccountCreator(this.connection, config.helperUrl);
        }
        else {
            this.accountCreator = null;
        }
    }
    /**
     *
     * @param accountId near accountId used to interact with the network.
     */
    async account(accountId) {
        const account = new account_1.Account(this.connection, accountId);
        await account.state();
        return account;
    }
    /**
     *
     * @param accountId
     * @param publicKey
     */
    async createAccount(accountId, publicKey) {
        if (!this.accountCreator) {
            throw new Error('Must specify account creator, either via masterAccount or helperUrl configuration settings.');
        }
        await this.accountCreator.createAccount(accountId, publicKey);
        return new account_1.Account(this.connection, accountId);
    }
    /**
     * @deprecated Use `new nearApi.Contract(yourAccount, contractId, { viewMethods, changeMethods })` instead.
     * @param contractId
     * @param options
     */
    async loadContract(contractId, options) {
        const account = new account_1.Account(this.connection, options.sender);
        return new contract_1.Contract(account, contractId, options);
    }
    /**
     * @deprecated Use `yourAccount.sendMoney` instead.
     * @param amount
     * @param originator
     * @param receiver
     */
    async sendTokens(amount, originator, receiver) {
        console.warn('near.sendTokens is deprecated. Use `yourAccount.sendMoney` instead.');
        const account = new account_1.Account(this.connection, originator);
        const result = await account.sendMoney(receiver, amount);
        return result.transaction_outcome.id;
    }
}
exports.Near = Near;
/**
 * Initialize connection to Near network.
 */
async function connect(config) {
    // Try to find extra key in `KeyPath` if provided.
    if (config.keyPath && config.deps && config.deps.keyStore) {
        try {
            const accountKeyFile = await unencrypted_file_system_keystore_1.readKeyFile(config.keyPath);
            if (accountKeyFile[0]) {
                // TODO: Only load key if network ID matches
                const keyPair = accountKeyFile[1];
                const keyPathStore = new key_stores_1.InMemoryKeyStore();
                await keyPathStore.setKey(config.networkId, accountKeyFile[0], keyPair);
                if (!config.masterAccount) {
                    config.masterAccount = accountKeyFile[0];
                }
                config.deps.keyStore = new key_stores_1.MergeKeyStore([config.deps.keyStore, keyPathStore]);
                console.log(`Loaded master account ${accountKeyFile[0]} key from ${config.keyPath} with public key = ${keyPair.getPublicKey()}`);
            }
        }
        catch (error) {
            console.warn(`Failed to load master account key from ${config.keyPath}: ${error}`);
        }
    }
    return new Near(config);
}
exports.connect = connect;
