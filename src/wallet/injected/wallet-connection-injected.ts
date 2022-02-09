import {
    RequestSignTransactionsOptions,
    SignInOptions,
    WalletConnection,
} from "../wallet-connection";

import { Near } from '../../near';
import { Account } from '../../account'

export class WalletConnectionInjected extends WalletConnection {
    _walletName: string;

    constructor(near: Near, appKeyPrefix: string | null, walletName: string) {
        super(near, appKeyPrefix);
        this._walletName = walletName;
    }

    async requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void> {
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
    async requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): Promise<void> {
        const { accessKey } = await window[this._walletName].requestSignIn({
            contractId: contractId,
        });
        //TODO: why do we need accessKey here?
        console.log("New function call key added:", accessKey);
    }
    isSignedIn(): boolean {
        return window[this._walletName].isSignedIn();
    }
    getAccountId(): string {
        return window[this._walletName].getAccountId();
    }
    signOut(): void {
        window[this._walletName].signOut().then((res) => {
            if (res.result !== "success") {
                throw new Error("Failed to sign out");
            } else {
                console.log("Signed out");
            }
        });
    }
    account(): Account {
        throw new Error('Method not implemented.');
    }
}