'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("./transaction");
class Account {
    constructor(connection, accountId) {
        this.connection = connection;
        this.accountId = accountId;
    }
    async signTransaction(transaction) {
        let signature = await this.connection.signer.signMessage(transaction.serializeBinary());
        return transaction_1.signedTransaction(transaction, signature);
    }
    async sendMoney(nonce, receiver, amount) {
        let signedTx = await this.signTransaction(transaction_1.sendMoney(nonce, this.accountId, receiver, amount));
        return this.connection.provider.sendTransaction(signedTx);
    }
    async createAccount(newAccountId, publicKey, amount) {
        let signedTx = await this.signTransaction(transaction_1.createAccount(this.accountId, newAccountId, publicKey, amount));
        return this.connection.provider.sendTransaction(signedTx);
    }
}
exports.Account = Account;
/**
 * Account creator provides interface to specific implementation to acutally create account.
 */
class AccountCreator {
}
exports.AccountCreator = AccountCreator;
class LocalAccountCreator {
    constructor(connection, masterAccount) {
        this.connection = connection;
        this.masterAccount = masterAccount;
    }
    async createAccount(newAccountId, publicKey) {
        let _response = await this.masterAccount.createAccount(newAccountId, publicKey, BigInt(1000 * 1000 * 1000 * 1000));
        // TODO: check the response here for status.
        return new Account(this.connection, newAccountId);
    }
}
exports.LocalAccountCreator = LocalAccountCreator;
class UrlAccountCreator {
    constructor(connection, helperUrl) {
        this.connection = connection;
        this.helperConnection = { url: helperUrl };
    }
    async createAccount(newAccountId, publicKey) {
        return new Account(this.connection, newAccountId);
    }
}
exports.UrlAccountCreator = UrlAccountCreator;
