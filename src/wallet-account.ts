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
import { InMemorySigner } from './signer';
import { Transaction, Action, SCHEMA, createTransaction } from './transaction';
import { KeyPair, PublicKey } from './utils';
import { baseDecode } from 'borsh';
import { Connection } from './connection';
import { serialize } from 'borsh';

const LOGIN_WALLET_URL_SUFFIX = '/login/';
const MULTISIG_HAS_METHOD = 'add_request_and_confirm';
const LOCAL_STORAGE_KEY_SUFFIX = '_wallet_auth_key';
const PENDING_ACCESS_KEY_PREFIX = 'pending_key'; // browser storage key for a pending access key (i.e. key has been generated but we are not sure it was added yet)

interface SignInOptions {
    contractId?: string;
    methodNames?: string[];
    // TODO: Replace following with single callbackUrl
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
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions);
    isSignedIn(): boolean;
    getAccountId(): string;
    signOut(): void;
}

interface AcocuntProvider {
    account(): Account;
}

abstract class WalletConection implements TransactionsSigner, SignInProvider, AcocuntProvider {
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

    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void> {
        throw new Error('Method not implemented.');
    }

    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions) {
        throw new Error('Method not implemented.');
    }

    /**
     * Returns true, if this WalletConnectionRedirect is authorized with the wallet.
     * @example
     * ```js
     * const walletConnection = new WalletConnectionRedirect(near, 'my-app', walletBaseUrl);
     * walletConnection.isSignedIn();
     * ```
     */
    isSignedIn(): boolean {
        return !!this._authData.accountId;
    }

    /**
     * Returns authorized Account ID.
     * @example
     * ```js
     * const walletConnection = new WalletConnection(near, 'my-app', walletBaseUrl);
     * walletConnection.getAccountId();
     * ```
     */
    getAccountId(): string {
        return this._authData.accountId || '';
    }

    /**
    * Sign out from the current account
    * @example
    * walletConnection.signOut();
    */
    signOut(): void {
        this._authData = {};
        window.localStorage.removeItem(this._authDataKey);
    }

    account(): Account {
        throw new Error('Method not implemented.');
    }
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
export class WalletConnectionRedirect extends WalletConection {
    /** @hidden */
    _walletBaseUrl: string;

    /**
     * @param {Near} near Near object
     * @param {string} appKeyPrefix application identifier
     * @param {string} walletBaseUrl NEAR wallet URL, used to redirect users to their wallet for signing and sending transactions
     */
    constructor(near: Near, appKeyPrefix: string | null, walletBaseUrl: string) {
        super();
        this._near = near;
        const authDataKey = appKeyPrefix + LOCAL_STORAGE_KEY_SUFFIX;
        const authData = JSON.parse(window.localStorage.getItem(authDataKey));
        this._networkId = near.config.networkId;
        this._walletBaseUrl = walletBaseUrl;
        appKeyPrefix = appKeyPrefix || near.config.contractName || 'default';
        this._keyStore = (near.connection.signer as InMemorySigner).keyStore;
        this._authData = authData || { allKeys: [] };
        this._authDataKey = authDataKey;
        if (!this.isSignedIn()) {
            this._completeSignInWithAccessKey();
        }
    }

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
    async requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions) {
        const currentUrl = new URL(window.location.href);
        const newUrl = new URL(this._walletBaseUrl + LOGIN_WALLET_URL_SUFFIX);
        newUrl.searchParams.set('success_url', successUrl || currentUrl.href);
        newUrl.searchParams.set('failure_url', failureUrl || currentUrl.href);
        if (contractId) {
            /* Throws exception if contract account does not exist */
            const contractAccount = await this._near.account(contractId);
            await contractAccount.state();

            newUrl.searchParams.set('contract_id', contractId);
            const accessKey = KeyPair.fromRandom('ed25519');
            newUrl.searchParams.set('public_key', accessKey.getPublicKey().toString());
            await this._keyStore.setKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + accessKey.getPublicKey(), accessKey);
        }

        if (methodNames) {
            methodNames.forEach(methodName => {
                newUrl.searchParams.append('methodNames', methodName);
            });
        }

        window.location.assign(newUrl.toString());
    }

    /**
     * Requests the user to quickly sign for a transaction or batch of transactions by redirecting to the NEAR wallet.
     */
    async requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void> {
        const currentUrl = new URL(window.location.href);
        const newUrl = new URL('sign', this._walletBaseUrl);

        newUrl.searchParams.set('transactions', transactions
            .map(transaction => serialize(SCHEMA, transaction))
            .map(serialized => Buffer.from(serialized).toString('base64'))
            .join(','));
        newUrl.searchParams.set('callbackUrl', callbackUrl || currentUrl.href);
        if (meta) newUrl.searchParams.set('meta', meta);

        window.location.assign(newUrl.toString());
    }

    /**
     * @hidden
     * Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.
     */
    async _completeSignInWithAccessKey() {
        const currentUrl = new URL(window.location.href);
        const publicKey = currentUrl.searchParams.get('public_key') || '';
        const allKeys = (currentUrl.searchParams.get('all_keys') || '').split(',');
        const accountId = currentUrl.searchParams.get('account_id') || '';
        // TODO: Handle errors during login
        if (accountId) {
            this._authData = {
                accountId,
                allKeys
            };
            window.localStorage.setItem(this._authDataKey, JSON.stringify(this._authData));
            if (publicKey) {
                await this._moveKeyFromTempToPermanent(accountId, publicKey);
            }
        }
        currentUrl.searchParams.delete('public_key');
        currentUrl.searchParams.delete('all_keys');
        currentUrl.searchParams.delete('account_id');
        currentUrl.searchParams.delete('meta');
        currentUrl.searchParams.delete('transactionHashes');

        window.history.replaceState({}, document.title, currentUrl.toString());
    }

    /**
     * @hidden
     * @param accountId The NEAR account owning the given public key
     * @param publicKey The public key being set to the key store
     */
    async _moveKeyFromTempToPermanent(accountId: string, publicKey: string) {
        const keyPair = await this._keyStore.getKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + publicKey);
        await this._keyStore.setKey(this._networkId, accountId, keyPair);
        await this._keyStore.removeKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + publicKey);
    }

    /**
     * Returns the current connected wallet account
     */
    account(): Account {
        if (!this._connectedAccount) {
            this._connectedAccount = new ConnectedWalletAccountRedirect(this, this._near.connection, this._authData.accountId);
        }
        return this._connectedAccount;
    }
}

abstract class ConnectedWalletAccount extends Account {
    walletConnection: WalletConection;

    /**
   * Check if given access key allows the function call or method attempted in transaction
   * @param accessKey Array of {access_key: AccessKey, public_key: PublicKey} items
   * @param receiverId The NEAR account attempting to have access
   * @param actions The action(s) needed to be checked for access
   */
    async accessKeyMatchesTransaction(accessKey, receiverId: string, actions: Action[]): Promise<boolean> {
        const { access_key: { permission } } = accessKey;
        if (permission === 'FullAccess') {
            return true;
        }

        if (permission.FunctionCall) {
            const { receiver_id: allowedReceiverId, method_names: allowedMethods } = permission.FunctionCall;
            /********************************
            Accept multisig access keys and let wallets attempt to signAndSendTransaction
            If an access key has itself as receiverId and method permission add_request_and_confirm, then it is being used in a wallet with multisig contract: https://github.com/near/core-contracts/blob/671c05f09abecabe7a7e58efe942550a35fc3292/multisig/src/lib.rs#L149-L153
            ********************************/
            if (allowedReceiverId === this.accountId && allowedMethods.includes(MULTISIG_HAS_METHOD)) {
                return true;
            }
            if (allowedReceiverId === receiverId) {
                if (actions.length !== 1) {
                    return false;
                }
                const [{ functionCall }] = actions;
                return functionCall &&
                    (!functionCall.deposit || functionCall.deposit.toString() === '0') && // TODO: Should support charging amount smaller than allowance?
                    (allowedMethods.length === 0 || allowedMethods.includes(functionCall.methodName));
                // TODO: Handle cases when allowance doesn't have enough to pay for gas
            }
        }
        // TODO: Support other permissions than FunctionCall

        return false;
    }

    /**
     * Helper function returning the access key (if it exists) to the receiver that grants the designated permission
     * @param receiverId The NEAR account seeking the access key for a transaction
     * @param actions The action(s) sought to gain access to
     * @param localKey A local public key provided to check for access
     * @returns Promise<any>
     */
    async accessKeyForTransaction(receiverId: string, actions: Action[], localKey?: PublicKey): Promise<any> {
        const accessKeys = await this.getAccessKeys();

        if (localKey) {
            const accessKey = accessKeys.find(key => key.public_key.toString() === localKey.toString());
            if (accessKey && await this.accessKeyMatchesTransaction(accessKey, receiverId, actions)) {
                return accessKey;
            }
        }

        const walletKeys = this.walletConnection._authData.allKeys;
        for (const accessKey of accessKeys) {
            if (walletKeys.indexOf(accessKey.public_key) !== -1 && await this.accessKeyMatchesTransaction(accessKey, receiverId, actions)) {
                return accessKey;
            }
        }

        return null;
    }
}

/**
 * {@link Account} implementation which redirects to wallet using {@link WalletConnectionRedirect} when no local key is available.
 */
export class ConnectedWalletAccountRedirect extends ConnectedWalletAccount {
    constructor(walletConnection: WalletConnectionRedirect, connection: Connection, accountId: string) {
        super(connection, accountId);
        this.walletConnection = walletConnection;
    }

    // Overriding Account methods

    /**
     * Sign a transaction by redirecting to the NEAR Wallet
     * @see {@link WalletConnection.requestSignTransactions}
     */
    async signAndSendTransaction({ receiverId, actions, walletMeta, walletCallbackUrl = window.location.href }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
        const localKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
        let accessKey = await this.accessKeyForTransaction(receiverId, actions, localKey);
        if (!accessKey) {
            throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`);
        }

        if (localKey && localKey.toString() === accessKey.public_key) {
            try {
                return await super.signAndSendTransaction({ receiverId, actions });
            } catch (e) {
                if (e.type === 'NotEnoughAllowance') {
                    accessKey = await this.accessKeyForTransaction(receiverId, actions);
                } else {
                    throw e;
                }
            }
        }

        const block = await this.connection.provider.block({ finality: 'final' });
        const blockHash = baseDecode(block.header.hash);

        const publicKey = PublicKey.from(accessKey.public_key);
        // TODO: Cache & listen for nonce updates for given access key
        const nonce = accessKey.access_key.nonce + 1;
        const transaction = createTransaction(this.accountId, publicKey, receiverId, nonce, actions, blockHash);
        await this.walletConnection.requestSignTransactions({
            transactions: [transaction],
            meta: walletMeta,
            callbackUrl: walletCallbackUrl
        });

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Failed to redirect to sign transaction'));
            }, 1000);
        });

        // TODO: Aggregate multiple transaction request with "debounce".
        // TODO: Introduce TrasactionQueue which also can be used to watch for status?
    }
}

export class WalletConnectionInjected extends WalletConection {
    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void> {
        throw new Error('Method not implemented.');
    }
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions) {
        throw new Error('Method not implemented.');
    }
    account(): Account {
        if (!this._connectedAccount) {
            this._connectedAccount = new ConnectedWalletAccountInjected(this, this._near.connection, this._authData.accountId);
        }
        return this._connectedAccount;
    }
}

export class ConnectedWalletAccountInjected extends ConnectedWalletAccount {
    constructor(walletConnection: WalletConnectionInjected, connection: Connection, accountId: string) {
        super(connection, accountId);
        this.walletConnection = walletConnection;
    }
}
