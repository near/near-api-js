"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = require("./utils/web");
/**
 * Account creator provides interface to specific implementation to acutally create account.
 */
class AccountCreator {
}
exports.AccountCreator = AccountCreator;
class LocalAccountCreator extends AccountCreator {
    constructor(masterAccount, initialBalance) {
        super();
        this.masterAccount = masterAccount;
        this.initialBalance = initialBalance;
    }
    async createAccount(newAccountId, publicKey) {
        await this.masterAccount.createAccount(newAccountId, publicKey, this.initialBalance);
    }
}
exports.LocalAccountCreator = LocalAccountCreator;
class UrlAccountCreator extends AccountCreator {
    constructor(connection, helperUrl) {
        super();
        this.connection = connection;
        this.helperUrl = helperUrl;
    }
    async createAccount(newAccountId, publicKey) {
        await web_1.fetchJson(`${this.helperUrl}/account`, JSON.stringify({ newAccountId, newAccountPublicKey: publicKey.toString() }));
    }
}
exports.UrlAccountCreator = UrlAccountCreator;
