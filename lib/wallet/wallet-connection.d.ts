import { Account } from '../account';
import { Connection } from '../connection';
import { Near } from '../near';
import { RequestSignTransactionsOptions, SignInOptions } from './wallet-interface';
export declare abstract class WalletConnection implements TransactionsSigner, SignInProvider, AcocuntProvider {
    /** @hidden */
    _near: Near;
    /** @hidden */
    _connectedAccount: ConnectedWalletAccount;
    /**
    * @param {Near} near Near object
    * @param {string} appKeyPrefix application identifier
    */
    constructor(near: Near, appKeyPrefix: string | null);
    abstract requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
    abstract requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): any;
    abstract isSignedIn(): boolean;
    abstract getAccountId(): string;
    abstract signOut(): boolean;
    abstract account(): Account;
}
/**
 * Object of this class should be returned by WalletConnection.account() method
 */
export declare abstract class ConnectedWalletAccount extends Account {
    walletConnection: WalletConnection;
    constructor(walletConnection: WalletConnection, connection: Connection, accountId: string);
}
interface TransactionsSigner {
    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
}
interface SignInProvider {
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): any;
    isSignedIn(): boolean;
    getAccountId(): string;
    signOut(): boolean;
}
interface AcocuntProvider {
    account(): Account;
}
export {};
