"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectionInjected = void 0;
const wallet_connection_1 = require("../wallet-connection");
class WalletConnectionInjected extends wallet_connection_1.WalletConnection {
    constructor(near, appKeyPrefix, walletName) {
        super(near, appKeyPrefix);
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
        throw new Error('Method not implemented.');
    }
}
exports.WalletConnectionInjected = WalletConnectionInjected;
