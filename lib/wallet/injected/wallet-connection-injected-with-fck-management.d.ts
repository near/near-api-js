import { RequestSignTransactionsOptions, SignInOptions } from "../wallet-connection";
import { WalletConnectionWithKeyManagement, ConnectedWalletAccountWithKeyManagement } from "../wallet-connection-with-key-management";
import { Near } from '../../near';
import { Account } from '../../account';
export declare class WalletConnectionInjectedWithFckManagement extends WalletConnectionWithKeyManagement {
    _walletName: string;
    constructor(near: Near, appKeyPrefix: string | null, walletName: string);
    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): void;
    account(): Account;
}
export declare class ConnectedWalletAccountInjectedWithKeyManagement extends ConnectedWalletAccountWithKeyManagement {
}
