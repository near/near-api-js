"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectedWalletAccountInjectedWithKeyManagement = exports.WalletConnectionInjectedWithFckManagement = void 0;
const wallet_connection_with_key_management_1 = require("../wallet-connection-with-key-management");
class WalletConnectionInjectedWithFckManagement extends wallet_connection_with_key_management_1.WalletConnectionWithKeyManagement {
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
            this._connectedAccount = new ConnectedWalletAccountInjectedWithKeyManagement(this, this._near.connection, this._authData.accountId);
        }
        return this._connectedAccount;
    }
}
exports.WalletConnectionInjectedWithFckManagement = WalletConnectionInjectedWithFckManagement;
class ConnectedWalletAccountInjectedWithKeyManagement extends wallet_connection_with_key_management_1.ConnectedWalletAccountWithKeyManagement {
}
exports.ConnectedWalletAccountInjectedWithKeyManagement = ConnectedWalletAccountInjectedWithKeyManagement;
