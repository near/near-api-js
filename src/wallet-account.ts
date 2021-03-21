import depd from 'depd';
import { Account } from './account';
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
    // TODO: Replace following with single callbackUrl
    successUrl?: string;
    failureUrl?: string;
}

export class WalletConnection {
    _walletBaseUrl: string;
    _authDataKey: string;
    _keyStore: KeyStore;
    _authData: any;
    _networkId: string;

    _near: Near;
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
     * @param options An optional options object
     * @param options.contractId The NEAR account where the contract is deployed
     * @param options.successUrl URL to redirect upon success. Default: current url
     * @param options.failureUrl URL to redirect upon failure. Default: current url
     *
     * @example
     *   walletAccount.requestSignIn('account-with-deploy-contract.near', {
     *     successUrl: "https://example.com/success.html",
     *     failureUrl: "https://example.com/error.html"
     *   });
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
            newUrl.searchParams.set('contract_id', options.contractId);
            const accessKey = KeyPair.fromRandom('ed25519');
            newUrl.searchParams.set('public_key', accessKey.getPublicKey().toString());
            await this._keyStore.setKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + accessKey.getPublicKey(), accessKey);
        }
        window.location.assign(newUrl.toString());
    }

    /**
     * Requests the user to quickly sign for a transaction or batch of transactions
     * @param transactions Array of Transaction objects that will be requested to sign
     * @param callbackUrl The url to navigate to after the user is prompted to sign
     */
    async requestSignTransactions(transactions: Transaction[], callbackUrl?: string) {
        const currentUrl = new URL(window.location.href);
        const newUrl = new URL('sign', this._walletBaseUrl);

        newUrl.searchParams.set('transactions', transactions
            .map(transaction => serialize(SCHEMA, transaction))
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
     * 
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
 * {@link Account} implementation which redirects to wallet using (@link WalletConnection) when no local key is available.
 */
export class ConnectedWalletAccount extends Account {
    walletConnection: WalletConnection;

    constructor(walletConnection: WalletConnection, connection: Connection, accountId: string) {
        super(connection, accountId);
        this.walletConnection = walletConnection;
    }

    // Overriding Account methods

    protected async signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome> {
        const localKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
        let accessKey = await this.accessKeyForTransaction(receiverId, actions, localKey);
        if (!accessKey) {
            throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`);
        }

        if (localKey && localKey.toString() === accessKey.public_key) {
            try {
                return await super.signAndSendTransaction(receiverId, actions);
            } catch (e) {
                if (e.type === 'NotEnoughBalance') {
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
