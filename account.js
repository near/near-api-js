'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("./transaction");
const serialize_1 = require("./utils/serialize");
class Account {
    constructor(connection, accountId) {
        this.connection = connection;
        this.accountId = accountId;
    }
    async signTransaction(transaction) {
        let signature = await this.connection.signer.signMessage(transaction.serializeBinary());
        return transaction_1.signedTransaction(transaction, signature);
    }
    async state() {
        const response = await this.connection.provider.query(`account/${this.accountId}`, '');
        return JSON.parse(serialize_1.base_decode(response.value).toString());
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
