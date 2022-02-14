import { Account, SignAndSendTransactionOptions } from '../../account';
import { Near } from '../../near';
import { RequestSignTransactionsOptions, SignInOptions } from '../wallet-interface';
import { ConnectedWalletAccountWithKeyManagement, WalletConnectionWithKeyManagement } from '../wallet-connection-with-key-management';
import { FinalExecutionOutcome } from '../../providers';
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
export declare class WalletConnectionRedirect extends WalletConnectionWithKeyManagement {
    /** @hidden */
    _walletBaseUrl: string;
    /**
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
/**
 * {@link Account} implementation which redirects to wallet using {@link WalletConnectionRedirect} when no local key is available.
 */
export declare class ConnectedWalletAccountRedirect extends ConnectedWalletAccountWithKeyManagement {
    /**
     * Sign a transaction by redirecting to the NEAR Wallet
     * @see {@link WalletConnectionWithKeyManagement.requestSignTransactions}
     */
    signAndSendTransaction({ receiverId, actions, walletMeta, walletCallbackUrl }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome>;
}
