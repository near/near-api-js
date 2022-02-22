"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRedirect = void 0;
const account_1 = require("../../account");
const utils_1 = require("../utils");
const transaction_1 = require("../../transaction");
const utils_2 = require("../../utils");
const borsh_1 = require("borsh");
const borsh_2 = require("borsh");
const LOGIN_WALLET_URL_SUFFIX = '/login/';
const LOCAL_STORAGE_KEY_SUFFIX = '_wallet_auth_key';
const PENDING_ACCESS_KEY_PREFIX = 'pending_key'; // browser storage key for a pending access key (i.e. key has been generated but we are not sure it was added yet)
class WalletRedirect {
    constructor(near, appKeyPrefix, walletBaseUrl) {
        this._near = near;
        const authDataKey = appKeyPrefix + LOCAL_STORAGE_KEY_SUFFIX;
        const authData = JSON.parse(window.localStorage.getItem(authDataKey));
        this._networkId = near.config.networkId;
        this._walletBaseUrl = walletBaseUrl;
        appKeyPrefix = appKeyPrefix || near.config.contractName || 'default';
        this._keyStore = near.connection.signer.keyStore;
        this._authData = authData || { allKeys: [] };
        this._authDataKey = authDataKey;
        if (!this.isSignedIn()) {
            this._completeSignInWithAccessKey();
        }
    }
    /**
     * Redirects current page to the wallet authentication page.
     */
    async requestSignIn({ contractId, methodNames, successUrl, failureUrl }) {
        const currentUrl = new URL(window.location.href);
        const newUrl = new URL(this._walletBaseUrl + LOGIN_WALLET_URL_SUFFIX);
        newUrl.searchParams.set('success_url', successUrl || currentUrl.href);
        newUrl.searchParams.set('failure_url', failureUrl || currentUrl.href);
        if (contractId) {
            /* Throws exception if contract account does not exist */
            const contractAccount = await this._near.account(contractId);
            await contractAccount.state();
            newUrl.searchParams.set('contract_id', contractId);
            const accessKey = utils_2.KeyPair.fromRandom('ed25519');
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
     * Returns true, if authorized with the wallet.
     */
    isSignedIn() {
        return !!this._authData.accountId;
    }
    /**
     * Sign out from the current account
     */
    signOut() {
        this._authData = {};
        window.localStorage.removeItem(this._authDataKey);
        return true;
    }
    /**
     * Returns authorized Account ID.
     */
    getAccountId() {
        return this._authData.accountId || '';
    }
    async requestSignTransactions({ transactions, meta, callbackUrl }) {
        if (!this.isSignedIn()) {
            throw new Error('Can not execute requestSignTransactions() while not Signed In');
        }
        const currentUrl = new URL(window.location.href);
        const newUrl = new URL('sign', this._walletBaseUrl);
        newUrl.searchParams.set('transactions', transactions
            .map(transaction => borsh_2.serialize(transaction_1.SCHEMA, transaction))
            .map(serialized => Buffer.from(serialized).toString('base64'))
            .join(','));
        newUrl.searchParams.set('callbackUrl', callbackUrl || currentUrl.href);
        if (meta)
            newUrl.searchParams.set('meta', meta);
        window.location.assign(newUrl.toString());
    }
    async requestSignTransaction({ receiverId, actions, walletMeta, walletCallbackUrl, }) {
        if (!this.isSignedIn()) {
            throw new Error('Can not execute requestSignTransaction() while not Signed In');
        }
        const accessKey = await this.accessKeyFromWalletForTransaction(this.getAccountId(), receiverId, actions);
        const block = await this._near.connection.provider.block({ finality: 'final' });
        const blockHash = borsh_1.baseDecode(block.header.hash);
        const publicKey = utils_2.PublicKey.from(accessKey.public_key);
        // TODO: Cache & listen for nonce updates for given access key
        const nonce = accessKey.access_key.nonce + 1;
        const transaction = transaction_1.createTransaction(this.getAccountId(), publicKey, receiverId, nonce, actions, blockHash);
        await this.requestSignTransactions({
            transactions: [transaction],
            meta: walletMeta,
            callbackUrl: walletCallbackUrl
        });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Failed to redirect to sign transaction'));
            }, 1000);
        });
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
    async _moveKeyFromTempToPermanent(accountId, publicKey) {
        const keyPair = await this._keyStore.getKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + publicKey);
        await this._keyStore.setKey(this._networkId, accountId, keyPair);
        await this._keyStore.removeKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + publicKey);
    }
    /**
     * @hidden
     * Helper function returning the access key (if it exists) to the receiver that grants the designated permission
     * @param accountId
     * @param receiverId The NEAR account seeking the access key for a transaction
     * @param actions The action(s) sought to gain access to
     * @returns Promise<any>
     */
    async accessKeyFromWalletForTransaction(accountId, receiverId, actions) {
        //TODO: what is the differance between accountId and recieverId here?
        const account = new account_1.Account(this._near.connection, accountId);
        const accessKeys = await account.getAccessKeys();
        const walletKeys = this._authData.allKeys;
        for (const accessKey of accessKeys) {
            if (walletKeys.indexOf(accessKey.public_key) !== -1 && await utils_1.accessKeyMatchesTransaction(accountId, accessKey, receiverId, actions)) {
                return accessKey;
            }
        }
        return null;
    }
}
exports.WalletRedirect = WalletRedirect;
