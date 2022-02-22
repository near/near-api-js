"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectedWalletAccount = exports.WalletConnection = void 0;
const account_1 = require("../account");
const utils_1 = require("./utils");
class WalletConnection {
    /**
    * @param {Near} _near Near object
    * @param {Walle} wallet Wallet object
    */
    constructor(near, wallet) {
        this._near = near;
        this.wallet = wallet;
    }
    /**
    * Returns the current connected wallet account
    */
    account() {
        if (this.wallet.isSignedIn()) {
            return new ConnectedWalletAccount(this, this._near.connection, this.wallet.getAccountId());
        }
        console.warn("Can not create account object, user is not signed in");
        return null;
    }
}
exports.WalletConnection = WalletConnection;
/**
 * Object of this class should be returned by WalletConnection.account() method
 */
class ConnectedWalletAccount extends account_1.Account {
    constructor(walletConnection, connection, accountId) {
        super(connection, accountId);
        this._walletConnection = walletConnection;
    }
    /** Account.signAndSendTransaction() is using  requestSignTransaction()
     * function from wallet instead of standard implementation
     */
    async signAndSendTransaction(options) {
        /* TODO: we are trying to use a key from connection here, instead of key from wallet. Should we do that?
        * At can be considered as redundant "magic". If user is using WalletConneciton, he is not expected to use local key.
        */
        const localKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
        let accessKey = await this.accessKeyLocalForTransaction(this.accountId, options.receiverId, options.actions, localKey);
        if (!accessKey) {
            throw new Error(`Cannot find matching key for transaction sent to ${options.receiverId}`);
        }
        if (localKey && localKey.toString() === accessKey.public_key) {
            try {
                return await super.signAndSendTransaction({ receiverId: options.receiverId, actions: options.actions });
            }
            catch (e) {
                if (e.type === 'NotEnoughAllowance') {
                    // continue signing with wallet
                }
                else {
                    throw e;
                }
            }
        }
        this._walletConnection.wallet.requestSignTransaction(options);
        // TODO: refactor to return result (use callbacks?)
        return null;
    }
    /**
     * //TODO
     * @param accountId
     * @param receiverId
     * @param actions
     * @param localKey
     * @returns
     */
    async accessKeyLocalForTransaction(accountId, receiverId, actions, localKey) {
        const account = new account_1.Account(this.connection, accountId);
        const accessKeys = await account.getAccessKeys();
        const accessKey = accessKeys.find(key => key.public_key.toString() === localKey.toString());
        if (accessKey && await utils_1.accessKeyMatchesTransaction(accountId, accessKey, receiverId, actions)) {
            return accessKey;
        }
        return null;
    }
}
exports.ConnectedWalletAccount = ConnectedWalletAccount;
