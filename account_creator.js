"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Account creator provides interface to specific implementation to acutally create account.
 */
class AccountCreator {
}
exports.AccountCreator = AccountCreator;
class LocalAccountCreator {
    constructor(masterAccount) {
        this.masterAccount = masterAccount;
    }
    async createAccount(newAccountId, publicKey) {
        await this.masterAccount.createAccount(newAccountId, publicKey, BigInt(1000 * 1000 * 1000 * 1000));
        // TODO: check the response here for status and raise if didn't complete.
    }
}
exports.LocalAccountCreator = LocalAccountCreator;
class UrlAccountCreator {
    constructor(connection, helperUrl) {
        this.connection = connection;
        this.helperConnection = { url: helperUrl };
    }
    async createAccount(newAccountId, publicKey) {
        // TODO: hit url to create account.
    }
}
exports.UrlAccountCreator = UrlAccountCreator;
