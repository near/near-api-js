"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectedWalletAccount = exports.WalletConnectionWithKeyManagement = exports.WalletConnectionBase = void 0;
//TODO: update this description
/**
 * The classes in this module are used in conjunction with the {@link BrowserLocalStorageKeyStore}. This module exposes two classes:
 * * {@link WalletConnectionRedirect} which redirects users to {@link https://docs.near.org/docs/tools/near-wallet | NEAR Wallet} for key management.
 * * {@link ConnectedWalletAccountRedirect} is an {@link Account} implementation that uses {@link WalletConnectionWithKeyManagement} to get keys
 *
 * @module walletAccount
 */
const account_1 = require("../account");
const MULTISIG_HAS_METHOD = 'add_request_and_confirm';
const LOCAL_STORAGE_KEY_SUFFIX = '_wallet_auth_key';
class WalletConnectionBase {
    /**
    * @param {Near} near Near object
    * @param {string} appKeyPrefix application identifier
    */
    constructor(near, appKeyPrefix) {
        this._near = near;
        appKeyPrefix = appKeyPrefix || near.config.contractName || 'default';
    }
}
exports.WalletConnectionBase = WalletConnectionBase;
class WalletConnectionWithKeyManagement extends WalletConnectionBase {
    /**
     * @param {Near} near Near object
     * @param {string} appKeyPrefix application identifier
     */
    constructor(near, appKeyPrefix) {
        const authDataKey = appKeyPrefix + LOCAL_STORAGE_KEY_SUFFIX;
        super(near, appKeyPrefix); // NOTE: super called here for backward compatability
        const authData = JSON.parse(window.localStorage.getItem(authDataKey));
        this._networkId = near.config.networkId;
        this._keyStore = near.connection.signer.keyStore;
        this._authData = authData || { allKeys: [] };
        this._authDataKey = authDataKey;
    }
    /**
     * Returns true, if this WalletConnectionRedirect is authorized with the wallet.
     * @example
     * ```js
     * const walletConnection = new WalletConnectionRedirect(near, 'my-app', walletBaseUrl);
     * walletConnection.isSignedIn();
     * ```
     */
    isSignedIn() {
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
    getAccountId() {
        return this._authData.accountId || '';
    }
    /**
    * Sign out from the current account
    * @example
    * walletConnection.signOut();
    */
    signOut() {
        this._authData = {};
        window.localStorage.removeItem(this._authDataKey);
    }
    account() {
        throw new Error('Method not implemented.');
    }
}
exports.WalletConnectionWithKeyManagement = WalletConnectionWithKeyManagement;
class ConnectedWalletAccount extends account_1.Account {
    constructor(walletConnection, connection, accountId) {
        super(connection, accountId);
        this.walletConnection = walletConnection;
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
exports.ConnectedWalletAccount = ConnectedWalletAccount;
