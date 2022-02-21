"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectedWalletAccount = exports.WalletConnection = void 0;
const account_1 = require("../account");
class WalletConnection {
    /**
    * @param {Near} near Near object
    * @param {string} appKeyPrefix application identifier
    */
    constructor(near, appKeyPrefix, wallet) {
        this._near = near;
        appKeyPrefix = appKeyPrefix || near.config.contractName || 'default';
        this._wallet = wallet;
    }
}
exports.WalletConnection = WalletConnection;
/**
 * Object of this class should be returned by WalletConnection.account() method
 */
class ConnectedWalletAccount extends account_1.Account {
    constructor(walletConnection, connection, accountId) {
        super(connection, accountId);
        this.walletConnection = walletConnection;
    }
}
exports.ConnectedWalletAccount = ConnectedWalletAccount;
