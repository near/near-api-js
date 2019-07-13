import { Near } from './near';
import { KeyStore } from './key_stores';
export declare class WalletAccount {
    _walletBaseUrl: string;
    _authDataKey: string;
    _keyStore: KeyStore;
    _authData: any;
    _networkId: string;
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
     * @param {string} contractId contract ID of the application
     * @param {string} title name of the application
     * @param {string} successUrl url to redirect on success
     * @param {string} failureUrl url to redirect on failure
     * @example
     *   walletAccount.requestSignIn(
     *     myContractId,
     *     title,
     *     onSuccessHref,
     *     onFailureHref);
     */
    requestSignIn(contractId: string, title: string, successUrl: string, failureUrl: string): Promise<void>;
    /**
     * Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.
     */
    _completeSignInWithAccessKey(): Promise<void>;
    _moveKeyFromTempToPermanent(accountId: string, publicKey: string): Promise<void>;
    /**
     * Sign out from the current account
     * @example
     * walletAccount.signOut();
     */
    signOut(): void;
}
