import { SignAndSendTransactionOptions } from '../../account';
import { SignInOptions, Wallet, RequestSignTransactionsOptions } from '../interface';
import { Near } from '../../near';
import { KeyStore } from '../../key_stores';
import { Action } from '../../transaction';
export declare class WalletRedirect implements Wallet {
    /** @hidden */
    _walletBaseUrl: string;
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
    constructor(near: Near, appKeyPrefix: string | null, walletBaseUrl: string);
    /**
     * Redirects current page to the wallet authentication page.
     */
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): Promise<void>;
    /**
     * Returns true, if authorized with the wallet.
     */
    isSignedIn(): boolean;
    /**
     * Sign out from the current account
     */
    signOut(): boolean;
    /**
     * Returns authorized Account ID.
     */
    getAccountId(): string;
    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
    requestSignTransaction({ receiverId, actions, walletMeta, walletCallbackUrl, }: SignAndSendTransactionOptions): Promise<unknown>;
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
     * @hidden
     * Helper function returning the access key (if it exists) to the receiver that grants the designated permission
     * @param accountId
     * @param receiverId The NEAR account seeking the access key for a transaction
     * @param actions The action(s) sought to gain access to
     * @returns Promise<any>
     */
    accessKeyFromWalletForTransaction(accountId: string, receiverId: string, actions: Action[]): Promise<any>;
}
