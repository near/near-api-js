import { Account } from './account';
import { Near } from './near';
import { KeyStore } from './key_stores';
import { FinalExecutionOutcome } from './providers';
import { Transaction, Action } from './transaction';
import { PublicKey } from './utils';
import { Connection } from './connection';
interface SignInOptions {
    contractId?: string;
    successUrl?: string;
    failureUrl?: string;
}
export declare class WalletConnection {
    _walletBaseUrl: string;
    _authDataKey: string;
    _keyStore: KeyStore;
    _authData: any;
    _networkId: string;
    _near: Near;
    _connectedAccount: ConnectedWalletAccount;
    constructor(near: Near, appKeyPrefix: string | null);
    /**
     * Returns true, if this WalletAccount is authorized with the wallet.
     * @example
     * walletAccount.isSignedIn();
     */
    isSignedIn(): boolean;
    /**
     * Returns authorized Account ID.
     * @example
     * walletAccount.getAccountId();
     */
    getAccountId(): any;
    /**
     * Redirects current page to the wallet authentication page.
     * @param options An optional options object
     * @param options.contractId The NEAR account where the contract is deployed
     * @param options.successUrl URL to redirect upon success. Default: current url
     * @param options.failureUrl URL to redirect upon failure. Default: current url
     *
     * @example
     *   walletAccount.requestSignIn('account-with-deploy-contract.near', {
     *     successUrl: "https://example.com/success.html",
     *     failureUrl: "https://example.com/error.html"
     *   });
     */
    requestSignIn(contractIdOrOptions?: string | SignInOptions, title?: string, successUrl?: string, failureUrl?: string): Promise<void>;
    /**
     * Requests the user to quickly sign for a transaction or batch of transactions
     * @param transactions Array of Transaction objects that will be requested to sign
     * @param callbackUrl The url to navigate to after the user is prompted to sign
     */
    requestSignTransactions(transactions: Transaction[], callbackUrl?: string): Promise<void>;
    /**
     * Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.
     */
    _completeSignInWithAccessKey(): Promise<void>;
    /**
     *
     * @param accountId The NEAR account owning the given public key
     * @param publicKey The public key being set to the key store
     */
    _moveKeyFromTempToPermanent(accountId: string, publicKey: string): Promise<void>;
    /**
     * Sign out from the current account
     * @example
     * walletAccount.signOut();
     */
    signOut(): void;
    /**
     * Returns the current connected wallet account
     */
    account(): ConnectedWalletAccount;
}
export declare const WalletAccount: typeof WalletConnection;
/**
 * {@link Account} implementation which redirects to wallet using (@link WalletConnection) when no local key is available.
 */
export declare class ConnectedWalletAccount extends Account {
    walletConnection: WalletConnection;
    constructor(walletConnection: WalletConnection, connection: Connection, accountId: string);
    protected signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>;
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
