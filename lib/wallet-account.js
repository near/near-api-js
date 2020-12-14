"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectedWalletAccount = exports.WalletAccount = exports.WalletConnection = void 0;
const bs58_1 = __importDefault(require("bs58"));
const account_1 = require("./account");
const transaction_1 = require("./transaction");
const utils_1 = require("./utils");
const borsh_1 = require("borsh");
const borsh_2 = require("borsh");
const cached_transactions_1 = require("./cached-transactions");
const LOGIN_WALLET_URL_SUFFIX = '/login/';
const MULTISIG_HAS_METHOD = 'add_request_and_confirm';
const LOCAL_STORAGE_KEY_SUFFIX = '_wallet_auth_key';
const PENDING_ACCESS_KEY_PREFIX = 'pending_key'; // browser storage key for a pending access key (i.e. key has been generated but we are not sure it was added yet)
class WalletConnection {
    constructor(near, appKeyPrefix) {
        this._near = near;
        const authDataKey = appKeyPrefix + LOCAL_STORAGE_KEY_SUFFIX;
        const authData = JSON.parse(window.localStorage.getItem(authDataKey));
        this._completedTransactions = new cached_transactions_1.CompletedTransactions();
        this._networkId = near.config.networkId;
        this._walletBaseUrl = near.config.walletUrl;
        appKeyPrefix = appKeyPrefix || near.config.contractName || 'default';
        this._keyStore = near.connection.signer.keyStore;
        this._authData = authData || { allKeys: [] };
        this._authDataKey = authDataKey;
        if (!this.isSignedIn()) {
            this._completeSignInWithAccessKey();
        }
    }
    /**
     * A wrapper for the collection of completed, cached transactions which
     * provides safe interfaces for inspecting and removing them from the
     * underlying cache.
     *
     * If you pass `meta` data to a `changeMethod` on a {@link Contract} or to
     * {@link Account.functionCall}, the transaction will be automatically
     * added to a cache. Whether or not the function call results in a redirect
     * to NEAR Wallet, your app can then use this `completedTransactions`
     * interface to determine the outcome of the transaction and update your
     * app's state.
     *
     * Example:
     *
     * ```js
     * const id = 1; // this is specific to and tracked by your app
     * const completedTx = walletConnection.completedTransactions.remove(tx => tx.meta.id === id)
     * if (completedTx) {
     *   // do app stuff, dealing with completed transaction
     * } else {
     *   const contract = new Contract(someAccount, 'some-address', { changeMethods: ['doThing'] })
     *   contract.doThing(
     *     // arguments passed to contract's `doThing` method:
     *     { arg1: 'whatever' },
     *
     *     // options for near-api-js:
     *     { meta: { id: id } }
     *   )
     * }
     * ```
     */
    completedTransactions() {
        return this._completedTransactions;
    }
    /**
     * Returns true, if this WalletAccount is authorized with the wallet.
     * @example
     * walletAccount.isSignedIn();
     */
    isSignedIn() {
        return !!this._authData.accountId;
    }
    /**
     * Returns authorized Account ID.
     * @example
     * walletAccount.getAccountId();
     */
    getAccountId() {
        return this._authData.accountId || '';
    }
    /**
     * Redirects current page to the wallet authentication page.
     * @param contractId The NEAR account where the contract is deployed
     * @param title Name of the application that will appear as requesting access in Wallet
     * @param successUrl Optional url to redirect upon success
     * @param failureUrl Optional url to redirect upon failure
     *
     * @example
     *   walletAccount.requestSignIn(
     *     account-with-deploy-contract,
     *     "Guest Book",
     *     "https://example.com/success.html",
     *     "https://example.com/error.html");
     */
    async requestSignIn(contractId, title, successUrl, failureUrl) {
        if (this.getAccountId() || await this._keyStore.getKey(this._networkId, this.getAccountId())) {
            return Promise.resolve();
        }
        const currentUrl = new URL(window.location.href);
        const newUrl = new URL(this._walletBaseUrl + LOGIN_WALLET_URL_SUFFIX);
        newUrl.searchParams.set('title', title);
        newUrl.searchParams.set('contract_id', contractId);
        newUrl.searchParams.set('success_url', successUrl || currentUrl.href);
        newUrl.searchParams.set('failure_url', failureUrl || currentUrl.href);
        newUrl.searchParams.set('app_url', currentUrl.origin);
        const accessKey = utils_1.KeyPair.fromRandom('ed25519');
        newUrl.searchParams.set('public_key', accessKey.getPublicKey().toString());
        await this._keyStore.setKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + accessKey.getPublicKey(), accessKey);
        window.location.assign(newUrl.toString());
    }
    /**
     * Requests the user to quickly sign for a transaction or batch of transactions
     * @param transactions Array of Transaction objects that will be requested to sign
     * @param callbackUrl The url to navigate to after the user is prompted to sign
     */
    async requestSignTransactions(transactions, callbackUrl) {
        const currentUrl = new URL(window.location.href);
        const newUrl = new URL('sign', this._walletBaseUrl);
        newUrl.searchParams.set('transactions', transactions
            .map(transaction => borsh_2.serialize(transaction_1.SCHEMA, transaction))
            .map(serialized => Buffer.from(serialized).toString('base64'))
            .join(','));
        newUrl.searchParams.set('callbackUrl', callbackUrl || currentUrl.href);
        window.location.assign(newUrl.toString());
    }
    /**
     * Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.
     */
    async _completeSignInWithAccessKey() {
        const currentUrl = new URL(window.location.href);
        const publicKey = currentUrl.searchParams.get('public_key') || '';
        const allKeys = (currentUrl.searchParams.get('all_keys') || '').split(',');
        const accountId = currentUrl.searchParams.get('account_id') || '';
        // TODO: Handle situation when access key is not added
        if (accountId && publicKey) {
            this._authData = {
                accountId,
                allKeys
            };
            window.localStorage.setItem(this._authDataKey, JSON.stringify(this._authData));
            await this._moveKeyFromTempToPermanent(accountId, publicKey);
        }
        currentUrl.searchParams.delete('public_key');
        currentUrl.searchParams.delete('all_keys');
        currentUrl.searchParams.delete('account_id');
        window.history.replaceState({}, document.title, currentUrl.toString());
    }
    /**
     *
     * @param accountId The NEAR account owning the given public key
     * @param publicKey The public key being set to the key store
     */
    async _moveKeyFromTempToPermanent(accountId, publicKey) {
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
exports.WalletConnection = WalletConnection;
exports.WalletAccount = WalletConnection;
/**
 * {@link Account} implementation which redirects to wallet using (@link WalletConnection) when no local key is available.
 */
class ConnectedWalletAccount extends account_1.Account {
    constructor(walletConnection, connection, accountId) {
        super(connection, accountId);
        this.walletConnection = walletConnection;
        // Check if a redirect to NEAR Wallet for tx signing was just completed.
        // If so, check tx outcome, call markTransactionSucceeded or markTransactionFailed.
        //
        // NOTE: a constructor cannot be `async`, so this will process in the
        // background after caller already receives an initialized
        // `ConnectedWalletAccount`. It uses `Promise.all` to check all in parallel.
        Promise.all(cached_transactions_1.getCachedTransactions(tx => !tx.complete).map(({ hash }) => (connection.provider.txStatus(bs58_1.default.decode(hash), accountId).then(result => {
            console.log('in ConnectedWalletAccount#constructor, checking status of cached transaction: ', { hash, result });
            const status = result.status;
            if (status.SuccessValue) {
                cached_transactions_1.markTransactionSucceeded(hash, result);
            }
            else if (status.Failure) {
                cached_transactions_1.markTransactionFailed(hash, result, status.Failure.error_message || 'Something went wrong');
            }
        }))));
    }
    /**
     * Overrides Account.signAndSendTransaction, adds caching ability with `meta` param
     *
     * @param receiverId NEAR account receiving the transaction
     * @param actions The transaction [Action as described in the spec](https://nomicon.io/RuntimeSpec/Actions.html).
     * @param meta Free-form {@link TxMetadata}. If provided, whether it
     *   requires a redirect through NEAR Wallet or not, the transaction's
     *   outcome will be available in the {@link WalletAccount.completedTransactions} collection.
     */
    async signAndSendTransaction(receiverId, actions, meta) {
        await this.ready;
        const localKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
        let accessKey = await this.accessKeyForTransaction(receiverId, actions, localKey);
        if (!accessKey) {
            throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`);
        }
        if (localKey && localKey.toString() === accessKey.public_key) {
            try {
                // this call will cache and mark cached as successful in happy case, will not mark as failed if error thrown
                return await super.signAndSendTransaction(receiverId, actions, null, {
                    onInit: (tx) => {
                        console.log('in ConnectedWalletAccount#signAndSendTransaction, caching tx: ', { ...tx, meta });
                        if (meta)
                            cached_transactions_1.cacheTransaction({ ...tx, meta });
                    },
                    onSuccess: (txHash, result) => {
                        console.log('in ConnectedWalletAccount#signAndSendTransaction, marking successful tx: ', { txHash, result });
                        if (meta)
                            cached_transactions_1.markTransactionSucceeded(txHash, result);
                    }
                });
            }
            catch (e) {
                // TODO: Use TypedError when available
                if (e.message.includes('does not have enough balance')) {
                    accessKey = await this.accessKeyForTransaction(receiverId, actions);
                }
                else {
                    // error includes txHash & result for some reason??
                    // what's a better way to get this info here?? 😩
                    cached_transactions_1.markTransactionFailed(e.txHash, e.result, e.message);
                    throw e;
                }
            }
        }
        const publicKey = utils_1.PublicKey.from(accessKey.public_key);
        // TODO: Cache & listen for nonce updates for given access key
        const nonce = accessKey.access_key.nonce + 1;
        const status = await this.connection.provider.status();
        const blockHash = borsh_1.baseDecode(status.sync_info.latest_block_hash);
        const transaction = transaction_1.createTransaction(this.accountId, publicKey, receiverId, nonce, actions, blockHash);
        await this.walletConnection.requestSignTransactions([transaction], window.location.href);
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
    async accessKeyMatchesTransaction(accessKey, receiverId, actions) {
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
    async accessKeyForTransaction(receiverId, actions, localKey) {
        const accessKeys = await this.getAccessKeys();
        if (localKey) {
            const accessKey = accessKeys.find(key => key.public_key === localKey.toString());
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
exports.ConnectedWalletAccount = ConnectedWalletAccount;
