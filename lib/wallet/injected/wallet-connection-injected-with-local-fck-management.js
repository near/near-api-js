"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectedWalletAccountInjected = exports.WalletConnectionInjectedWithLocalFckManagement = void 0;
const wallet_connection_1 = require("../wallet-connection");
class WalletConnectionInjectedWithLocalFckManagement extends wallet_connection_1.WalletConnectionWithKeyManagement {
    constructor(near, appKeyPrefix, walletName) {
        super(near, appKeyPrefix);
        this._walletName = walletName;
    }
    requestSignTransactions({ transactions, meta, callbackUrl }) {
        throw new Error('Method not implemented.');
    }
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }) {
        throw new Error('Method not implemented.');
    }
    account() {
        if (!this._connectedAccount) {
            this._connectedAccount = new ConnectedWalletAccountInjected(this, this._near.connection, this._authData.accountId);
        }
        return this._connectedAccount;
    }
}
exports.WalletConnectionInjectedWithLocalFckManagement = WalletConnectionInjectedWithLocalFckManagement;
class ConnectedWalletAccountInjected extends wallet_connection_1.ConnectedWalletAccount {
}
exports.ConnectedWalletAccountInjected = ConnectedWalletAccountInjected;
