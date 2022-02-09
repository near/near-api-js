"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectionInjected = void 0;
const wallet_connection_1 = require("../wallet-connection");
class WalletConnectionInjected extends wallet_connection_1.WalletConnectionBase {
    constructor(near, appKeyPrefix, walletName) {
        super(near, appKeyPrefix);
        this._walletName = walletName;
    }
    async requestSignTransactions({ transactions, meta, callbackUrl }) {
        window[this._walletName].requestSignTransactions({ transactions })
            .then((res) => {
            if (res.error) {
                //TOOD: is it the right structure for responce?
                throw new Error(res.error);
            }
            console.log('requestSignTransactions res:', res);
            return res;
        });
    }
    async requestSignIn({ contractId, methodNames, successUrl, failureUrl }) {
        const { accessKey } = await window[this._walletName].requestSignIn({
            contractId: contractId,
        });
        //TODO: why do we need accessKey here?
        console.log("New function call key added:", accessKey);
    }
    isSignedIn() {
        return window[this._walletName].isSignedIn();
    }
    getAccountId() {
        return window[this._walletName].getAccountId();
    }
    signOut() {
        window[this._walletName].signOut().then((res) => {
            if (res.result !== "success") {
                throw new Error("Failed to sign out");
            }
            else {
                console.log("Signed out");
            }
        });
    }
    account() {
        throw new Error('Method not implemented.');
    }
}
exports.WalletConnectionInjected = WalletConnectionInjected;
