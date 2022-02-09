import { WalletConnectionWithKeyManagement, RequestSignTransactionsOptions, SignInOptions, ConnectedWalletAccount } from "../wallet-connection";
import { Near } from '../../near';
import { Account } from '../../account';
export declare class WalletConnectionInjectedWithLocalFckManagement extends WalletConnectionWithKeyManagement {
    _walletName: string;
    constructor(near: Near, appKeyPrefix: string | null, walletName: string);
    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): void;
    account(): Account;
}
export declare class ConnectedWalletAccountInjected extends ConnectedWalletAccount {
}
