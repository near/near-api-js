import {
    RequestSignTransactionsOptions,
    SignInOptions,
    WalletConnection,
} from "../wallet-connection";

import { Near } from '../../near';
import { Account } from '../../account'
import { SenderWallet } from "./wallet-injected-interface";

export class WalletConnectionSender extends WalletConnection {
    private senderWallet: SenderWallet;


    constructor(near: Near, appKeyPrefix: string | null, walletName: string) {
        console.warn("This implementation is temporary, regular Injected Wallet should be used instead.");
        super(near, appKeyPrefix);
        this.senderWallet = window[walletName] as SenderWallet;
    }

    async requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void> {
        this.senderWallet.requestSignTransactions({ transactions })
            .then((res) => {
                console.log('requestSignTransactions res:', res);
                return res;
            });
    }
    async requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): Promise<void> {
        const { accessKey } = await this.senderWallet.requestSignIn({
            contractId: contractId,
        });
        //TODO: why do we need accessKey here?
        console.log("New function call key added:", accessKey);
    }
    isSignedIn(): boolean {
        return this.senderWallet.isSignedIn();
    }
    getAccountId(): string {
        return this.senderWallet.getAccountId();
    }
    signOut(): boolean {
        this.senderWallet.signOut().then((res) => {
            if (res.result !== "success") {
                throw new Error("Failed to sign out");
            } else {
                console.log("Signed out");
            }
        });
        return true;
    }
    account(): Account {
        throw new Error('Method not implemented.');
    }
}