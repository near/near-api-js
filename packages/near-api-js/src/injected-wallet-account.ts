/**
 * The classes in this module are used in conjunction with the {@link providers/wallet.types!Wallet}.
 * This module exposes two classes:
 * * {@link InjectedWalletConnection} which using NEAR extension wallet for key management.
 * * {@link InjectedWalletAccount} is an {@link account!Account} implementation that uses {@link InjectedWalletConnection} to get keys
 * 
 * @module injectedWalletAccount
 */
import { Account, SignAndSendTransactionOptions } from './account';
import { Near } from './near';
import { KeyStore } from './key_stores';
import { FinalExecutionOutcome, Wallet, WalletRpcProvider } from './providers';
import { InMemorySigner } from './signer';
import { createTransaction, } from './transaction';
import { PublicKey } from './utils';
import { baseDecode } from 'borsh';
import { Connection } from './connection';
import BN from 'bn.js';
const LOCAL_STORAGE_KEY_SUFFIX = '_wallet_auth_key';
  
/**
   * This class is used in conjunction with the {@link providers/wallet.types!Wallet}.
   * It uses NEAR extension wallet for key management.
   * This class is not intended for use outside the browser. Without `window` (i.e. in server contexts), it will instantiate but will throw a clear error when used.
   * 
   * @example
   * ```js
   * // create new injectedWalletConnection instance
   * // when creating near instance, should transfer config.wallet property.
   * const wallet = new injectedWalletConnection(near);
   * 
   * // If not signed in, open NEAR extension wallet to request user's approval to sign in.
   * // keys were stored in the wallet and connected (accountId, publicKey) will be stored in the browser local storage.
   * if(!wallet.isSignedIn()) return await wallet.signIn()
   * ```
   */
export class InjectedWalletConnection {
    /** @hidden */
    _wallet: Wallet;
  
    /** @hidden */
    _authDataKey: string;
  
    /** @hidden */
    _keyStore: KeyStore;
  
    /** @hidden */
    _authData: { accountId?: string; publicKey?: string };
  
    /** @hidden */
    _networkId: string;
  
    /** @hidden */
    _near: Near;
  
    /** @hidden */
    _connectedAccount: InjectedWalletAccount;
  
    constructor(near: Near) {
        if(typeof window === 'undefined') {
            return new Proxy(this, {
                get(target, property) {
                    if(property === 'isSignedIn') {
                        return () => false;
                    }
                    if(property === 'getAccountId') {
                        return () => '';
                    }
                    if(target[property] && typeof target[property] === 'function') {
                        return () => {
                            throw new Error('No window found in context, please ensure you are using WalletConnection on the browser');
                        };
                    }
                    return target[property];
                }
            });
        }
        this._near = near;
        const authDataKey = near.config.wallet.id + LOCAL_STORAGE_KEY_SUFFIX;
        const data = window.localStorage.getItem(authDataKey);
        let authData;
        if (data) {
            authData = JSON.parse(data);
        }
        this._networkId = near.config.networkId;
        this._keyStore = (near.connection.signer as InMemorySigner).keyStore;
        this._authData = authData || {};
        this._authDataKey = authDataKey;
        this._wallet = near.config.wallet;
    }
  
    /**
       * Returns true, if this InjectedWalletConnection is authorized with the wallet.
       * @example
       * ```js
       * const wallet = new InjectedWalletConnection(near);
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
       * const wallet = new InjectedWalletConnection(near);
       * wallet.getAccountId();
       * ```
       */
    getAccountId() {
        return this._authData.accountId || '';
    }
 
    /**
      * If not signed in, open NEAR extension wallet to request user's approval to sign in.
      * If the user approves, store the current connected accountId and publicKey in the browser's local storage.
      *
      * @example
      * ```js
      * const wallet = new InjectedWalletConnection(near);
      * // open NEAR extension wallet if not signed in
      * await wallet.signIn();
      * ```
      */
    async signIn() {
        if (!this._wallet.connected) {
            await this._wallet.connect();
        }
        const account = this._wallet.accounts[0];
        this._authData = {accountId: account.accountId, publicKey: account.publicKey.toString()};
        window.localStorage.setItem(this._authDataKey, JSON.stringify(this._authData));
    }
  
    /**
       * Sign out from the current account
       * @example
       * injectedWalletConnection.signOut();
       */
    async signOut() {
        this._authData = {};
        window.localStorage.removeItem(this._authDataKey);
        await this._wallet.disconnect();
    }
  
    /**
       * Returns the current connected wallet account
       */
    account() {
        if (!this._connectedAccount) {
            if (!this._authData.accountId) {
                throw new Error('There is no connected account');
            }
            this._connectedAccount = new InjectedWalletAccount(this, this._near.connection, this._authData.accountId);
        }
        return this._connectedAccount;
    }
}
  
/**
   * {@link account!Account} implementation using NEAR extension wallet in {@link InjectedWalletConnection} as RPC provider and key storage.
   */
export class InjectedWalletAccount extends Account {
    walletConnection: InjectedWalletConnection;
  
    constructor(walletConnection: InjectedWalletConnection, connection: Connection, accountId: string) {
        super(connection, accountId);
        this.walletConnection = walletConnection;
    }
  
    // Overriding Account methods
  
    /**
       * Sign and send a transaction by using the Extension Wallet.
       * This request should require approval from the user.
       * @see {@link WalletConnection.requestSignTransactions}
       */
    async signAndSendTransaction({ receiverId, actions }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
        const publicKey = await this.connection.signer.getPublicKey(this.accountId); 
        console.log('publicKey > ', publicKey);
 
        const accessKey = await this.confirmFullAccess(publicKey);
        console.log('accessKey > ', accessKey);
        const nonce = accessKey.access_key.nonce.add(new BN(1));
 
        const block = await this.connection.provider.block({ finality: 'final' });
        const blockHash = baseDecode(block.header.hash);
        const transaction = createTransaction(this.accountId, publicKey, receiverId, nonce, actions, blockHash);
 
        try {
            return await (this.connection.provider as WalletRpcProvider).signAndSendTransaction(transaction);
        } catch (error) {
            // if Wallet didn't implement a signAndSendTransaction method
            const signedTx = await this.walletConnection._wallet.signTransaction({
                transaction: {
                    receiverId: receiverId,
                    actions: actions,
                    signerId: this.accountId,
                }
            });
            return await this.connection.provider.sendTransaction(signedTx);
        }
    }
 
    /**
      * Helper function returning the access key (if it exists) to the receiver that grants the full access permission.
      * @param publicKey A local public key provided to check for access
      */
    async confirmFullAccess(publicKey: PublicKey): Promise<any> {
 
        const accessKeys = await this.getAccessKeys();
        const accessKey = accessKeys.find((a) => a.public_key === publicKey.toString());
 
        if (accessKey?.access_key.permission === 'FullAccess') {
            return accessKey;
        }
 
        return null;
    }
 
}
  