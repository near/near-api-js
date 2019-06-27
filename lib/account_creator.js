"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        // TODO: check the response here for status and raise if didn't complete.
    }
}
exports.LocalAccountCreator = LocalAccountCreator;
class UrlAccountCreator extends AccountCreator {
    constructor(connection, helperUrl) {
        super();
        this.connection = connection;
        this.helperConnection = { url: helperUrl };
    }
    async createAccount(newAccountId, publicKey) {
        // TODO: hit url to create account.
    }
}
exports.UrlAccountCreator = UrlAccountCreator;
