/**
 * The classes in this module are used in conjunction with the {@link BrowserLocalStorageKeyStore}. This module exposes two classes:
 * * {@link WalletConnectionRedirect} which redirects users to {@link https://docs.near.org/docs/tools/near-wallet | NEAR Wallet} for key management.
 * * {@link ConnectedWalletAccountRedirect} is an {@link Account} implementation that uses {@link WalletConnection} to get keys
 *
 * @module walletAccount
 */
import { Account, SignAndSendTransactionOptions } from './account';
import { Near } from './near';
import { KeyStore } from './key_stores';
import { FinalExecutionOutcome } from './providers';
import { Transaction, Action } from './transaction';
import { PublicKey } from './utils';
import { Connection } from './connection';
interface SignInOptions {
    contractId?: string;
    methodNames?: string[];
    successUrl?: string;
    failureUrl?: string;
}
/**
 * Information to send NEAR wallet for signing transactions and redirecting the browser back to the calling application
 */
interface RequestSignTransactionsOptions {
    /** list of transactions to sign */
    transactions: Transaction[];
    /** url NEAR Wallet will redirect to after transaction signing is complete */
    callbackUrl?: string;
    /** meta information NEAR Wallet will send back to the application. `meta` will be attached to the `callbackUrl` as a url search param */
    meta?: string;
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
declare abstract class WalletConection implements TransactionsSigner, SignInProvider, AcocuntProvider {
    /** @hidden */
    _authDataKey: string;
    /** @hidden */
    _keyStore: KeyStore;
    /** @hidden */
    _authData: any;
    /** @hidden */
    _networkId: string;
    /** @hidden */
    _near: Near;
    /** @hidden */
    _connectedAccount: ConnectedWalletAccount;
    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): void;
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
/**
 * This class is used in conjunction with the {@link BrowserLocalStorageKeyStore}.
 * It redirects users to {@link https://docs.near.org/docs/tools/near-wallet | NEAR Wallet} for key management.
 *
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#wallet}
 * @example
 * ```js
 * // Create new WalletConnectionRedirect instance.
 * // Typically, you will want to used one of this servers:
 * // mainnetWalletUrl: 'https://wallet.near.org',
 * // testnetWalletUrl: 'https://wallet.testnet.near.org',
 * // betanetWalletUrl: 'https://wallet.betanet.near.org',
 * // localhostWalletUrl: 'http://localhost:4000/wallet',
 * const walletConnection = new WalletConnectionRedirect(near, 'my-app', 'https://wallet.testnet.near.org');
 * // If not signed in redirect to the NEAR wallet to sign in
 * // keys will be stored in the BrowserLocalStorageKeyStore
 * if(!walletConnection.isSingnedIn()) return walletConnection.requestSignIn()
 * ```
 */
export declare class WalletConnectionRedirect extends WalletConection {
    /** @hidden */
    _walletBaseUrl: string;
    /**
     * @param {Near} near Near object
     * @param {string} appKeyPrefix application identifier
     * @param {string} walletBaseUrl NEAR wallet URL, used to redirect users to their wallet for signing and sending transactions
     */
    constructor(near: Near, appKeyPrefix: string | null, walletBaseUrl: string);
    /**
     * Redirects current page to the wallet authentication page.
     * @param options An optional options object
     * @param options.contractId The NEAR account where the contract is deployed
     * @param options.successUrl URL to redirect upon success. Default: current url
     * @param options.failureUrl URL to redirect upon failure. Default: current url
     *
     * @example
     * ```js
     * const walletConnection = new WalletConnectionRedirect(near, 'my-app', walletBaseUrl);
     * // redirects to the NEAR Wallet
     * walletConnection.requestSignIn({ contractId: 'account-with-deploy-contract.near' });
     * ```
     */
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): Promise<void>;
    /**
     * Requests the user to quickly sign for a transaction or batch of transactions by redirecting to the NEAR wallet.
     */
    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
    /**
     * @hidden
     * Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.
     */
    _completeSignInWithAccessKey(): Promise<void>;
    /**
     * @hidden
     * @param accountId The NEAR account owning the given public key
     * @param publicKey The public key being set to the key store
     */
    _moveKeyFromTempToPermanent(accountId: string, publicKey: string): Promise<void>;
    /**
     * Returns the current connected wallet account
     */
    account(): Account;
}
declare abstract class ConnectedWalletAccount extends Account {
    walletConnection: WalletConection;
}
/**
 * {@link Account} implementation which redirects to wallet using {@link WalletConnectionRedirect} when no local key is available.
 */
export declare class ConnectedWalletAccountRedirect extends ConnectedWalletAccount {
    constructor(walletConnection: WalletConnectionRedirect, connection: Connection, accountId: string);
    /**
     * Sign a transaction by redirecting to the NEAR Wallet
     * @see {@link WalletConnection.requestSignTransactions}
     */
    signAndSendTransaction({ receiverId, actions, walletMeta, walletCallbackUrl }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome>;
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
export declare class WalletConnectionInjected extends WalletConection {
    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): void;
    account(): Account;
}
export declare class ConnectedWalletAccountInjected extends ConnectedWalletAccount {
    constructor(walletConnection: WalletConnectionInjected, connection: Connection, accountId: string);
}
export {};
