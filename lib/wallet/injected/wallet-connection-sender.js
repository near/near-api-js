"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectionSender = void 0;
const wallet_connection_1 = require("../wallet-connection");
class WalletConnectionSender extends wallet_connection_1.WalletConnection {
    constructor(near, appKeyPrefix, walletName) {
        console.warn("This implementation is temporary, regular Injected Wallet should be used instead.");
        super(near, appKeyPrefix);
        this.senderWallet = window[walletName];
    }
    async requestSignTransactions({ transactions, meta, callbackUrl }) {
        this.senderWallet.requestSignTransactions({ transactions })
            .then((res) => {
            console.log('requestSignTransactions res:', res);
            return res;
        });
    }
    async requestSignIn({ contractId, methodNames, successUrl, failureUrl }) {
        const { accessKey } = await this.senderWallet.requestSignIn({
            contractId: contractId,
        });
        //TODO: why do we need accessKey here?
        console.log("New function call key added:", accessKey);
    }
    isSignedIn() {
        return this.senderWallet.isSignedIn();
    }
    getAccountId() {
        return this.senderWallet.getAccountId();
    }
    signOut() {
        this.senderWallet.signOut().then((res) => {
            if (res.result !== "success") {
                throw new Error("Failed to sign out");
            }
            else {
                console.log("Signed out");
            }
        });
        return true;
    }
    account() {
        throw new Error('Method not implemented.');
    }
}
exports.WalletConnectionSender = WalletConnectionSender;
