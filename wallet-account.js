/**
 * Wallet based account and signer that uses external wallet through the iframe to sign transactions.
 */

const BrowserLocalStorageKeystore = require('./signing/browser_local_storage_key_store');
const KeyPair = require('./signing/key_pair');
const SimpleKeyStoreSigner = require('./signing/simple_key_store_signer');

const LOGIN_WALLET_URL_SUFFIX = '/login/';

const LOCAL_STORAGE_KEY_SUFFIX = '_wallet_auth_key';
const PENDING_ACCESS_KEY_PREFIX = 'pending_key'; // browser storage key for a pending access key (i.e. key has been generated but we are not sure it was added yet)

/**
 * Wallet based account and signer that uses external wallet through the iframe to sign transactions.
 * @example 
 * // if importing WalletAccount directly
 * const walletAccount = new WalletAccount(contractName, walletBaseUrl)
 * // if importing in all of nearLib and calling from variable 
 * const walletAccount = new nearlib.WalletAccount(contractName, walletBaseUrl)
 * // To access wallet globally use:
 * window.walletAccount = new nearlib.WalletAccount(config.contractName, walletBaseUrl);
 */
class WalletAccount {

    constructor(appKeyPrefix, walletBaseUrl = 'https://wallet.nearprotocol.com', keyStore = new BrowserLocalStorageKeystore()) {
        this._walletBaseUrl =  walletBaseUrl;
        this._authDataKey = appKeyPrefix + LOCAL_STORAGE_KEY_SUFFIX;
        this._keyStore = keyStore;

        this._authData = JSON.parse(window.localStorage.getItem(this._authDataKey) || '{}');

        if (!this.isSignedIn()) {
            this._completeSignInWithAccessKey();
        }
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
     * @param {string} contract_id contract ID of the application
     * @param {string} title name of the application
     * @param {string} success_url url to redirect on success
     * @param {string} failure_url url to redirect on failure
     * @example
     *   walletAccount.requestSignIn(
     *     myContractId,
     *     title,
     *     onSuccessHref,
     *     onFailureHref);
     */
    requestSignIn(contract_id, title, success_url, failure_url) {
        const currentUrl = new URL(window.location.href);
        let newUrl = new URL(this._walletBaseUrl + LOGIN_WALLET_URL_SUFFIX);
        newUrl.searchParams.set('title', title);
        newUrl.searchParams.set('contract_id', contract_id);
        newUrl.searchParams.set('success_url', success_url || currentUrl.href);
        newUrl.searchParams.set('failure_url', failure_url || currentUrl.href);
        newUrl.searchParams.set('app_url', currentUrl.origin);
        if (!this.getAccountId() || !this._keyStore.getKey(this.getAccountId())) {
            const accessKey = KeyPair.fromRandomSeed();
            newUrl.searchParams.set('public_key', accessKey.getPublicKey());
            this._keyStore.setKey(PENDING_ACCESS_KEY_PREFIX + accessKey.getPublicKey(), accessKey).then(window.location.replace(newUrl.toString()));
        }
    }

    /**
     * Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.
     */
    _completeSignInWithAccessKey() {
        let currentUrl = new URL(window.location.href);
        let publicKey = currentUrl.searchParams.get('public_key') || '';
        let accountId = currentUrl.searchParams.get('account_id') || '';
        if (accountId && publicKey) {
            this._moveKeyFromTempToPermanent(accountId, publicKey);
        }
    }

    async _moveKeyFromTempToPermanent(accountId, publicKey) {
        let keyPair = await this._keyStore.getKey(PENDING_ACCESS_KEY_PREFIX + publicKey);
        this._authData = {
            accountId
        };
        window.localStorage.setItem(this._authDataKey, JSON.stringify(this._authData));
        await this._keyStore.setKey(accountId, keyPair);
        await this._keyStore.removeKey(PENDING_ACCESS_KEY_PREFIX + publicKey);
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
     * Sign a buffer. If the key for originator is not present,
     * this operation will fail.
     * @param {Uint8Array} buffer
     * @param {string} originator
     */
    async signBuffer(buffer, originator) {
        if (!this.isSignedIn() || originator !== this.getAccountId()) {
            throw 'Unauthorized account_id ' + originator;
        }
        const signer = new SimpleKeyStoreSigner(this._keyStore);
        let signature = await signer.signBuffer(buffer, originator);
        return signature;
    }

}

module.exports = WalletAccount;
