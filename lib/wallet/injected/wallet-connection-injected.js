"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectionInjected = void 0;
const wallet_connection_1 = require("../wallet-connection");
class WalletConnectionInjected extends wallet_connection_1.WalletConnection {
    constructor(near, appKeyPrefix, walletName) {
        super(near, appKeyPrefix);
        // TODOD: pass InjectedWallet instead of the name
        this.injecteWallet = window[walletName];
    }
    async requestSignTransactions({ transactions }) {
        // TODO: we should have a common interface here
        this.injecteWallet.requestSignTransactions({ transactions })
            .then((res) => {
            // TODO: change interface or convert responce
            console.log('requestSignTransactions res:', res);
        });
    }
    async requestSignIn({ contractId, methodNames, successUrl, failureUrl }) {
        this.injecteWallet.requestSignIn({
            contractId, methodNames
        }).then((result) => {
            console.log('requestSignIn result:', result);
        });
        //TODO: how to return something here? Should we change interface?
    }
    isSignedIn() {
        return this.injecteWallet.isSignedIn();
    }
    getAccountId() {
        return this.injecteWallet.getAccountId();
    }
    signOut() {
        return this.injecteWallet.signOut();
    }
    account() {
        if (!this._connectedAccount) {
            this._connectedAccount = new ConnectedWalletAccountInjected(this, this._near.connection, this.getAccountId());
        }
        return this._connectedAccount;
    }
}
exports.WalletConnectionInjected = WalletConnectionInjected;
class ConnectedWalletAccountInjected extends wallet_connection_1.ConnectedWalletAccount {
    /**
    * Sign a transaction with InjectedWallet
    */
    async signAndSendTransaction({ receiverId, actions, walletMeta, walletCallbackUrl }) {
        this.walletConnection.requestSignTransactions({ transactions: [{ receiverId, actions }] });
        return null; //TODO: convert or create common interface
    }
}
