/**
 * The classes in this module are used in conjunction with the {@link BrowserLocalStorageKeyStore}. This module exposes two classes:
 * * {@link WalletConnection} which redirects users to {@link https://docs.near.org/docs/tools/near-wallet | NEAR Wallet} for key management.
 * * {@link ConnectedWalletAccount} is an {@link Account} implementation that uses {@link WalletConnection} to get keys
 * 
 * @module walletAccount
 */
import depd from 'depd';
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

/**
 * This class is used in conjunction with the {@link BrowserLocalStorageKeyStore}.
 * It redirects users to {@link https://docs.near.org/docs/tools/near-wallet | NEAR Wallet} for key management.
 * 
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#wallet}
 * @example
 * ```js
 * // create new WalletConnection instance
 * const wallet = new WalletConnection(near, 'my-app');
 * 
 * // If not signed in redirect to the NEAR wallet to sign in
 * // keys will be stored in the BrowserLocalStorageKeyStore
 * if(!wallet.isSingnedIn()) return wallet.requestSignIn()
 * ```
 */
export class WalletConnection {
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

    /** @hidden */
    _connectedAccount: ConnectedWalletAccount;

    constructor(near: Near, appKeyPrefix: string | null) {
        this._near = near;
        const authDataKey = appKeyPrefix + LOCAL_STORAGE_KEY_SUFFIX;
        const authData = JSON.parse(window.localStorage.getItem(authDataKey));
        this._networkId = near.config.networkId;
        this._walletBaseUrl = near.config.walletUrl;
        appKeyPrefix = appKeyPrefix || near.config.contractName || 'default';
        this._keyStore = (near.connection.signer as InMemorySigner).keyStore;
        this._authData = authData || { allKeys: [] };
        this._authDataKey = authDataKey;
        if (!this.isSignedIn()) {
            this._completeSignInWithAccessKey();
        }
    }

    /**
     * Returns true, if this WalletAccount is authorized with the wallet.
     * @example
     * ```js
     * const wallet = new WalletConnection(near, 'my-app');
     * wallet.isSignedIn();
     * ```
     */
    isSignedIn() {
        return !!this._authData.accountId;
    }

    /**
     * Returns authorized Account ID.
     * @example
     * ```js
     * const wallet = new WalletConnection(near, 'my-app');
     * wallet.getAccountId();
     * ```
     */
    getAccountId() {
        return this._authData.accountId || '';
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
     * const wallet = new WalletConnection(near, 'my-app');
     * // redirects to the NEAR Wallet
     * wallet.requestSignIn('account-with-deploy-contract.near');
     * ```
     */
    async requestSignIn(
        contractIdOrOptions: string | SignInOptions = {},
        title?: string,
        successUrl?: string,
        failureUrl?: string
    ) {
        let options: SignInOptions;
        if (typeof contractIdOrOptions === 'string') {
            const deprecate = depd('requestSignIn(contractId, title)');
            deprecate('`title` ignored; use `requestSignIn({ contractId, successUrl, failureUrl })` instead');
            options = { contractId: contractIdOrOptions, successUrl, failureUrl };
        } else {
            options = contractIdOrOptions as SignInOptions;
        }

        const currentUrl = new URL(window.location.href);
        const newUrl = new URL(this._walletBaseUrl + LOGIN_WALLET_URL_SUFFIX);
        newUrl.searchParams.set('success_url', options.successUrl || currentUrl.href);
        newUrl.searchParams.set('failure_url', options.failureUrl || currentUrl.href);
        if (options.contractId) {            
            /* Throws exception if contract account does not exist */
            const contractAccount = await this._near.account(options.contractId);
            await contractAccount.state();

            newUrl.searchParams.set('contract_id', options.contractId);
            const accessKey = KeyPair.fromRandom('ed25519');
            newUrl.searchParams.set('public_key', accessKey.getPublicKey().toString());
            await this._keyStore.setKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + accessKey.getPublicKey(), accessKey);
        }

        if (options.methodNames) {
            options.methodNames.forEach(methodName => {
                newUrl.searchParams.append('methodNames', methodName);
            });
        }

        window.location.assign(newUrl.toString());
    }

    /**
     * Requests the user to quickly sign for a transaction or batch of transactions by redirecting to the NEAR wallet.
     */
    requestSignTransactions(options: RequestSignTransactionsOptions): Promise<void>
    /**
     * @deprecated
     * Requests the user to quickly sign for a transaction or batch of transactions by redirecting to the NEAR wallet.
     * @param transactions Array of Transaction objects that will be requested to sign
     * @param callbackUrl The url to navigate to after the user is prompted to sign
     */
    requestSignTransactions(transactions: Transaction[], callbackUrl?: string, meta?: string): Promise<void>

    async requestSignTransactions(...args: any[]) {
        if(Array.isArray(args[0])) {
            const deprecate = depd('WalletConnection.requestSignTransactions(transactions, callbackUrl, meta)');
            deprecate('use `WalletConnection.requestSignTransactions(RequestSignTransactionsOptions)` instead');
            return this._requestSignTransactions({
                transactions: args[0],
                callbackUrl: args[1],
                meta: args[2]
            });
        }

        return this._requestSignTransactions(args[0]);
    }

    private async _requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void> {
        const currentUrl = new URL(window.location.href);
        const newUrl = new URL('sign', this._walletBaseUrl);

        newUrl.searchParams.set('transactions', transactions
            .map(transaction => serialize(SCHEMA, transaction))
            .map(serialized => Buffer.from(serialized).toString('base64'))
            .join(','));
        newUrl.searchParams.set('callbackUrl', callbackUrl || currentUrl.href);
        if(meta) newUrl.searchParams.set('meta', meta);

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
     * Sign out from the current account
     * @example
     * walletAccount.signOut();
     */
    signOut() {
        this._authData = {};
        window.localStorage.removeItem(this._authDataKey);
    }

    /**
     * Returns the current connected wallet account
     */
    account() {
        if (!this._connectedAccount) {
            this._connectedAccount = new ConnectedWalletAccount(this, this._near.connection, this._authData.accountId);
        }
        return this._connectedAccount;
    }
}

export const WalletAccount = WalletConnection;

/**
 * {@link Account} implementation which redirects to wallet using {@link WalletConnection} when no local key is available.
 */
export class ConnectedWalletAccount extends Account {
    walletConnection: WalletConnection;

    constructor(walletConnection: WalletConnection, connection: Connection, accountId: string) {
        super(connection, accountId);
        this.walletConnection = walletConnection;
    }

    // Overriding Account methods

    /**
     * Sign a transaction by redirecting to the NEAR Wallet
     * @see {@link WalletConnection.requestSignTransactions}
     */
    protected signAndSendTransaction(...args: any[]): Promise<FinalExecutionOutcome> {
        if(typeof args[0] === 'string') {
            return this._signAndSendTransaction({ receiverId: args[0], actions: args[1] });
        }

        return this._signAndSendTransaction(args[0]);
    }

    private async _signAndSendTransaction({ receiverId, actions, walletMeta, walletCallbackUrl = window.location.href }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
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
