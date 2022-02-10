import { Account } from '../account';
import { Connection } from '../connection';
import { Near } from '../near';
import {
    Transaction,
} from '../transaction';

export abstract class WalletConnection implements TransactionsSigner, SignInProvider, AcocuntProvider {
    /** @hidden */
    _near: Near;

    /** @hidden */
    _connectedAccount: ConnectedWalletAccount;

    /**
    * @param {Near} near Near object
    * @param {string} appKeyPrefix application identifier
    */
    constructor(near: Near, appKeyPrefix: string | null) {
        this._near = near;
        appKeyPrefix = appKeyPrefix || near.config.contractName || 'default';
    }

    abstract requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
    abstract requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions);
    abstract isSignedIn(): boolean;
    abstract getAccountId(): string;
    abstract signOut(): boolean;
    abstract account(): Account;
}

/**
 * Object of this class should be returned by WalletConnection.account() method
 */
export abstract class ConnectedWalletAccount extends Account {
    walletConnection: WalletConnection;

    constructor(walletConnection: WalletConnection, connection: Connection, accountId: string) {
        super(connection, accountId);
        this.walletConnection = walletConnection;
    }
}

/**
 * Information to send NEAR wallet for signing transactions and redirecting the browser back to the calling application
 */
export interface RequestSignTransactionsOptions {
    /** list of transactions to sign */
    transactions: Transaction[];
    /** url NEAR Wallet will redirect to after transaction signing is complete */
    callbackUrl?: string;
    /** meta information NEAR Wallet will send back to the application. `meta` will be attached to the `callbackUrl` as a url search param */
    meta?: string;
}

export interface SignInOptions {
    contractId?: string;
    methodNames?: string[];
    // TODO: Replace following with single callbackUrl
    successUrl?: string;
    failureUrl?: string;
}

interface TransactionsSigner {
    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
}

interface SignInProvider {
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions);
    isSignedIn(): boolean;
    getAccountId(): string;
    signOut(): boolean;
}

interface AcocuntProvider {
    account(): Account;
}