/**
 * The classes in this module are used in conjunction with the {@link BrowserLocalStorageKeyStore}. This module exposes two classes:
 * * {@link WalletConnectionRedirect} which redirects users to {@link https://docs.near.org/docs/tools/near-wallet | NEAR Wallet} for key management.
 * * {@link ConnectedWalletAccountRedirect} is an {@link Account} implementation that uses {@link WalletConnectionWithKeyManagement} to get keys
 *
 * @module walletAccount
 */
import { Account } from '../account';
import { Near } from '../near';
import { Transaction, Action } from '../transaction';
import { PublicKey } from '../utils';
import { Connection } from '../connection';
import { KeyStore } from '../key_stores';
export interface SignInOptions {
    contractId?: string;
    methodNames?: string[];
    successUrl?: string;
    failureUrl?: string;
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
export declare abstract class WalletConnectionBase implements TransactionsSigner, SignInProvider, AcocuntProvider {
    /** @hidden */
    _near: Near;
    /**
    * @param {Near} near Near object
    * @param {string} appKeyPrefix application identifier
    */
    constructor(near: Near, appKeyPrefix: string | null);
    abstract requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
    abstract requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): any;
    abstract isSignedIn(): boolean;
    abstract getAccountId(): string;
    abstract signOut(): void;
    abstract account(): Account;
}
export declare abstract class WalletConnectionWithKeyManagement extends WalletConnectionBase {
    /** @hidden */
    _authDataKey: string;
    /** @hidden */
    _keyStore: KeyStore;
    /** @hidden */
    _authData: any;
    /** @hidden */
    _networkId: string;
    /** @hidden */
    _connectedAccount: ConnectedWalletAccount;
    /**
     * @param {Near} near Near object
     * @param {string} appKeyPrefix application identifier
     */
    constructor(near: Near, appKeyPrefix: string | null);
    abstract requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
    abstract requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): any;
    /**
     * Returns true, if this WalletConnectionRedirect is authorized with the wallet.
     * @example
     * ```js
     * const walletConnection = new WalletConnectionRedirect(near, 'my-app', walletBaseUrl);
     * walletConnection.isSignedIn();
     * ```
     */
    isSignedIn(): boolean;
    /**
     * Returns authorized Account ID.
     * @example
     * ```js
     * const walletConnection = new WalletConnection(near, 'my-app', walletBaseUrl);
     * walletConnection.getAccountId();
     * ```
     */
    getAccountId(): string;
    /**
    * Sign out from the current account
    * @example
    * walletConnection.signOut();
    */
    signOut(): void;
    account(): Account;
}
interface TransactionsSigner {
    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
}
interface SignInProvider {
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): any;
    isSignedIn(): boolean;
    getAccountId(): string;
    signOut(): void;
}
interface AcocuntProvider {
    account(): Account;
}
export declare abstract class ConnectedWalletAccount extends Account {
    walletConnection: WalletConnectionWithKeyManagement;
    constructor(walletConnection: WalletConnectionWithKeyManagement, connection: Connection, accountId: string);
    /**
   * Check if given access key allows the function call or method attempted in transaction
   * @param accessKey Array of {access_key: AccessKey, public_key: PublicKey} items
   * @param receiverId The NEAR account attempting to have access
   * @param actions The action(s) needed to be checked for access
   */
    accessKeyMatchesTransaction(accessKey: any, receiverId: string, actions: Action[]): Promise<boolean>;
    /**
     * Helper function returning the access key (if it exists) to the receiver that grants the designated permission
     * @param receiverId The NEAR account seeking the access key for a transaction
     * @param actions The action(s) sought to gain access to
     * @param localKey A local public key provided to check for access
     * @returns Promise<any>
     */
    accessKeyForTransaction(receiverId: string, actions: Action[], localKey?: PublicKey): Promise<any>;
}
export {};
