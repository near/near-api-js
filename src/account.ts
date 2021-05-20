import BN from 'bn.js';
import depd from 'depd';
import {
    transfer,
    createAccount,
    signTransaction,
    deployContract,
    addKey,
    functionCall,
    fullAccessKey,
    functionCallAccessKey,
    deleteKey,
    stake,
    deleteAccount,
    Action,
    SignedTransaction
} from './transaction';
import { FinalExecutionOutcome, TypedError, ErrorContext } from './providers';
import { Finality, BlockId, ViewStateResult, AccountView, AccessKeyView, CodeResult, AccessKeyList, AccessKeyInfoView, FunctionCallPermissionView } from './providers/provider';
import { Connection } from './connection';
import { baseDecode, baseEncode } from 'borsh';
import { PublicKey } from './utils/key_pair';
import { PositionalArgsError } from './utils/errors';
import { parseRpcError, parseResultError } from './utils/rpc_errors';
import { ServerError } from './utils/rpc_errors';
import { DEFAULT_FUNCTION_CALL_GAS } from './constants';

import exponentialBackoff from './utils/exponential-backoff';

// Default number of retries with different nonce before giving up on a transaction.
const TX_NONCE_RETRY_NUMBER = 12;

// Default wait until next retry in millis.
const TX_NONCE_RETRY_WAIT = 500;

// Exponential back off for waiting to retry.
const TX_NONCE_RETRY_WAIT_BACKOFF = 1.5;

export interface AccountBalance {
    total: string;
    stateStaked: string;
    staked: string;
    available: string;
}

export interface AccountAuthorizedApp {
    contractId: string;
    amount: string;
    publicKey: string;
}

/**
 * Options used to initiate sining and sending transactions
 */
export interface SignAndSendTransactionOptions {
    receiverId: string;
    actions: Action[];
    /**
     * Metadata to send the NEAR Wallet if using it to sign transactions.
     * @see {@link RequestSignTransactionsOptions}
     */
    walletMeta?: string;
    /**
     * Callback url to send the NEAR Wallet if using it to sign transactions.
     * @see {@link RequestSignTransactionsOptions}
     */
    walletCallbackUrl?: string;
}

/**
 * Options used to initiate a function call (especially a change function call)
 * @see {@link viewFunction} to initiate a view function call
 */
export interface FunctionCallOptions {
    /** The NEAR account id where the contract is deployed */
    contractId: string;
    /** The name of the method to invoke */
    methodName: string;
    /**
     * named arguments to pass the method `{ messageText: 'my message' }`
     */
    args: object;
    /** max amount of gas that method call can use */
    gas?: BN;
    /** amount of NEAR (in yoctoNEAR) to send together with the call */
    attachedDeposit?: BN;
    /**
     * Metadata to send the NEAR Wallet if using it to sign transactions.
     * @see {@link RequestSignTransactionsOptions}
     */
    walletMeta?: string;
    /**
     * Callback url to send the NEAR Wallet if using it to sign transactions.
     * @see {@link RequestSignTransactionsOptions}
     */
    walletCallbackUrl?: string;
}

interface ReceiptLogWithFailure {
    receiptIds: [string];
    logs: [string];
    failure: ServerError;
}

function parseJsonFromRawResponse (response: Uint8Array): any {
    return JSON.parse(Buffer.from(response).toString());
}

/**
 * This class provides common account related RPC calls including signing transactions with a {@link KeyPair}.
 * 
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#account}
 * @hint Use {@link WalletConnection} in the browser to redirect to {@link https://docs.near.org/docs/tools/near-wallet | NEAR Wallet} for Account/key management using the {@link BrowserLocalStorageKeyStore}.
 * @see {@link https://nomicon.io/DataStructures/Account.html | Account Spec}
 */
export class Account {
    readonly connection: Connection;
    readonly accountId: string;

    /** @hidden */
    protected get ready(): Promise<void> {
        const deprecate = depd('Account.ready()');
        deprecate('not needed anymore, always ready');
        return Promise.resolve();
    }

    constructor(connection: Connection, accountId: string) {
        this.connection = connection;
        this.accountId = accountId;
    }

    async fetchState(): Promise<void> {
        const deprecate = depd('Account.fetchState()');
        deprecate('use `Account.state()` instead');
    }

    /**
     * Returns basic NEAR account information via the `view_account` RPC query method
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#view-account}
     */
    async state(): Promise<AccountView> {
        return this.connection.provider.query<AccountView>({
            request_type: 'view_account',
            account_id: this.accountId,
            finality: 'optimistic'
        });
    }

    /** @hidden */
    private printLogsAndFailures(contractId: string, results: [ReceiptLogWithFailure]) {
        for (const result of results) {
            console.log(`Receipt${result.receiptIds.length > 1 ? 's' : ''}: ${result.receiptIds.join(', ')}`);
            this.printLogs(contractId, result.logs, '\t');
            if (result.failure) {
                console.warn(`\tFailure [${contractId}]: ${result.failure}`);
            }
        }
    }

    /** @hidden */
    private printLogs(contractId: string, logs: string[], prefix = '') {
        for (const log of logs) {
            console.log(`${prefix}Log [${contractId}]: ${log}`);
        }
    }

    /**
     * Create a signed transaction which can be broadcast to the network
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the transaction
     * @see {@link JsonRpcProvider.sendTransaction}
     */
    protected async signTransaction(receiverId: string, actions: Action[]): Promise<[Uint8Array, SignedTransaction]> {
        const accessKeyInfo = await this.findAccessKey(receiverId, actions);
        if (!accessKeyInfo) {
            throw new TypedError(`Can not sign transactions for account ${this.accountId} on network ${this.connection.networkId}, no matching key pair found in ${this.connection.signer}.`, 'KeyNotFound');
        }
        const { accessKey } = accessKeyInfo;

        const block = await this.connection.provider.block({ finality: 'final' });
        const blockHash = block.header.hash;

        const nonce = ++accessKey.nonce;
        return await signTransaction(
            receiverId, nonce, actions, baseDecode(blockHash), this.connection.signer, this.accountId, this.connection.networkId
        );
    }

    /**
     * Sign a transaction to preform a list of actions and broadcast it using the RPC API.
     * @see {@link JsonRpcProvider.sendTransaction}
     */
    protected signAndSendTransaction({ receiverId, actions }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome>
    /**
     * @deprecated
     * Sign a transaction to preform a list of actions and broadcast it using the RPC API.
     * @see {@link JsonRpcProvider.sendTransaction}
     * 
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the transaction
     */
    protected signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>
    protected signAndSendTransaction(...args: any): Promise<FinalExecutionOutcome> {
        if(typeof args[0] === 'string') {
            return this.signAndSendTransactionV1(args[0], args[1]);
        } else {
            return this.signAndSendTransactionV2(args[0]);
        }
    }

    private signAndSendTransactionV1(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome> {
        const deprecate = depd('Account.signAndSendTransaction(receiverId, actions');
        deprecate('use `Account.signAndSendTransaction(SignAndSendTransactionOptions)` instead');
        return this.signAndSendTransactionV2({ receiverId, actions });
    }

    private async signAndSendTransactionV2({ receiverId, actions }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
        let txHash, signedTx;
        // TODO: TX_NONCE (different constants for different uses of exponentialBackoff?)
        const result = await exponentialBackoff(TX_NONCE_RETRY_WAIT, TX_NONCE_RETRY_NUMBER, TX_NONCE_RETRY_WAIT_BACKOFF, async () => {
            [txHash, signedTx] = await this.signTransaction(receiverId, actions);
            const publicKey = signedTx.transaction.publicKey;

            try {
                return await this.connection.provider.sendTransaction(signedTx);
            } catch (error) {
                if (error.type === 'InvalidNonce') {
                    console.warn(`Retrying transaction ${receiverId}:${baseEncode(txHash)} with new nonce.`);
                    delete this.accessKeyByPublicKeyCache[publicKey.toString()];
                    return null;
                }

                error.context = new ErrorContext(baseEncode(txHash));
                throw error;
            }
        });
        if (!result) {
            // TODO: This should have different code actually, as means "transaction not submitted for sure"
            throw new TypedError('nonce retries exceeded for transaction. This usually means there are too many parallel requests with the same access key.', 'RetriesExceeded');
        }

        const flatLogs = [result.transaction_outcome, ...result.receipts_outcome].reduce((acc, it) => {
            if (it.outcome.logs.length ||
                (typeof it.outcome.status === 'object' && typeof it.outcome.status.Failure === 'object')) {
                return acc.concat({
                    'receiptIds': it.outcome.receipt_ids,
                    'logs': it.outcome.logs,
                    'failure': typeof it.outcome.status.Failure != 'undefined' ? parseRpcError(it.outcome.status.Failure) : null
                });
            } else return acc;
        }, []);
        this.printLogsAndFailures(signedTx.transaction.receiverId, flatLogs);

        if (typeof result.status === 'object' && typeof result.status.Failure === 'object') {
            // if error data has error_message and error_type properties, we consider that node returned an error in the old format
            if (result.status.Failure.error_message && result.status.Failure.error_type) {
                throw new TypedError(
                    `Transaction ${result.transaction_outcome.id} failed. ${result.status.Failure.error_message}`,
                    result.status.Failure.error_type);
            } else {
                throw parseResultError(result);
            }
        }
        // TODO: if Tx is Unknown or Started.
        return result;
    }

    /** @hidden */
    accessKeyByPublicKeyCache: { [key: string]: AccessKeyView } = {}

    /**
     * Finds the {@link AccessKeyView} associated with the accounts {@link PublicKey} stored in the {@link KeyStore}.
     * 
     * @todo Find matching access key based on transaction (i.e. receiverId and actions)
     * 
     * @param receiverId currently unused (see todo)
     * @param actions currently unused (see todo)
     * @returns `{ publicKey PublicKey; accessKey: AccessKeyView }`
     */
    async findAccessKey(receiverId: string, actions: Action[]): Promise<{publicKey: PublicKey; accessKey: AccessKeyView}> {
        // TODO: Find matching access key based on transaction (i.e. receiverId and actions)
        const publicKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
        if (!publicKey) {
            return null;
        }

        const cachedAccessKey = this.accessKeyByPublicKeyCache[publicKey.toString()];
        if (cachedAccessKey !== undefined) {
            return { publicKey, accessKey: cachedAccessKey };
        }

        try {
            const accessKey = await this.connection.provider.query<AccessKeyView>({
                request_type: 'view_access_key',
                account_id: this.accountId,
                public_key: publicKey.toString(),
                finality: 'optimistic'
            });

            // this function can be called multiple times and retrieve the same access key
            // this checks to see if the access key was already retrieved and cached while
            // the above network call was in flight. To keep nonce values in line, we return
            // the cached access key.
            if(this.accessKeyByPublicKeyCache[publicKey.toString()]) {
                return { publicKey, accessKey: this.accessKeyByPublicKeyCache[publicKey.toString()] };
            }

            this.accessKeyByPublicKeyCache[publicKey.toString()] = accessKey;
            return { publicKey, accessKey };
        } catch (e) {
            if (e.type == 'AccessKeyDoesNotExist') {
                return null;
            }

            throw e;
        }
    }

    /**
     * Create a new account and deploy a contract to it
     * 
     * @param contractId NEAR account where the contract is deployed
     * @param publicKey The public key to add to the created contract account
     * @param data The compiled contract code
     * @param amount of NEAR to transfer to the created contract account. Transfer enough to pay for storage https://docs.near.org/docs/concepts/storage-staking
     */
    async createAndDeployContract(contractId: string, publicKey: string | PublicKey, data: Uint8Array, amount: BN): Promise<Account> {
        const accessKey = fullAccessKey();
        await this.signAndSendTransaction({
            receiverId: contractId,
            actions: [createAccount(), transfer(amount), addKey(PublicKey.from(publicKey), accessKey), deployContract(data)]
        });
        const contractAccount = new Account(this.connection, contractId);
        return contractAccount;
    }

    /**
     * @param receiverId NEAR account receiving Ⓝ
     * @param amount Amount to send in yoctoⓃ
     */
    async sendMoney(receiverId: string, amount: BN): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId,
            actions: [transfer(amount)]
        });
    }

    /**
     * @param newAccountId NEAR account name to be created
     * @param publicKey A public key created from the masterAccount
     */
    async createAccount(newAccountId: string, publicKey: string | PublicKey, amount: BN): Promise<FinalExecutionOutcome> {
        const accessKey = fullAccessKey();
        return this.signAndSendTransaction({
            receiverId: newAccountId,
            actions: [createAccount(), transfer(amount), addKey(PublicKey.from(publicKey), accessKey)]
        });
    }

    /**
     * @param beneficiaryId The NEAR account that will receive the remaining Ⓝ balance from the account being deleted
     */
    async deleteAccount(beneficiaryId: string) {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [deleteAccount(beneficiaryId)]
        });
    }

    /**
     * @param data The compiled contract code
     */
    async deployContract(data: Uint8Array): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [deployContract(data)]
        });
    }

    async functionCall(props: FunctionCallOptions): Promise<FinalExecutionOutcome>;
    /**
     * @deprecated
     * 
     * @param contractId NEAR account where the contract is deployed
     * @param methodName The method name on the contract as it is written in the contract code
     * @param args arguments to pass to method. Can be either plain JS object which gets serialized as JSON automatically
     *  or `Uint8Array` instance which represents bytes passed as is.
     * @param gas max amount of gas that method call can use
     * @param amount amount of NEAR (in yoctoNEAR) to send together with the call
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async functionCall(contractId: string, methodName: string, args: any, gas?: BN, amount?: BN): Promise<FinalExecutionOutcome> 
    async functionCall(...args: any[]): Promise<FinalExecutionOutcome> {
        if(typeof args[0] === 'string') {
            return this.functionCallV1(args[0], args[1], args[2], args[3], args[4]);
        } else {
            return this.functionCallV2(args[0]);
        }
    }

    private functionCallV1(contractId: string, methodName: string, args: any, gas?: BN, amount?: BN): Promise<FinalExecutionOutcome> {
        const deprecate = depd('Account.functionCall(contractId, methodName, args, gas, amount)');
        deprecate('use `Account.functionCall(FunctionCallOptions)` instead');

        args = args || {};
        this.validateArgs(args);
        return this.signAndSendTransaction({
            receiverId: contractId,
            actions: [functionCall(methodName, args, gas || DEFAULT_FUNCTION_CALL_GAS, amount)]
        });
    }

    private functionCallV2({ contractId, methodName, args = {}, gas = DEFAULT_FUNCTION_CALL_GAS, attachedDeposit, walletMeta, walletCallbackUrl }: FunctionCallOptions): Promise<FinalExecutionOutcome> {
        this.validateArgs(args);
        return this.signAndSendTransaction({
            receiverId: contractId,
            actions: [functionCall(methodName, args, gas, attachedDeposit)],
            walletMeta,
            walletCallbackUrl
        });
    }

    /**
     * @see {@link https://docs.near.org/docs/concepts/account#access-keys}
     * @todo expand this API to support more options.
     * @param publicKey A public key to be associated with the contract
     * @param contractId NEAR account where the contract is deployed
     * @param methodNames The method names on the contract that should be allowed to be called. Pass null for no method names and '' or [] for any method names.
     * @param amount Payment in yoctoⓃ that is sent to the contract during this function call
     */
    async addKey(publicKey: string | PublicKey, contractId?: string, methodNames?: string|string[], amount?: BN): Promise<FinalExecutionOutcome> {
        if (!methodNames) {
            methodNames = [];
        }
        if (!Array.isArray(methodNames)) {
            methodNames = [methodNames];
        }
        let accessKey;
        if (!contractId) {
            accessKey = fullAccessKey();
        } else {
            accessKey = functionCallAccessKey(contractId, methodNames, amount);
        }
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [addKey(PublicKey.from(publicKey), accessKey)]
        });
    }

    /**
     * @param publicKey The public key to be deleted
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async deleteKey(publicKey: string | PublicKey): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [deleteKey(PublicKey.from(publicKey))]
        });
    }

    /**
     * @see {@link https://docs.near.org/docs/validator/staking-overview}
     * 
     * @param publicKey The public key for the account that's staking
     * @param amount The account to stake in yoctoⓃ
     */
    async stake(publicKey: string | PublicKey, amount: BN): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [stake(amount, PublicKey.from(publicKey))]
        });
    }

    /** @hidden */
    private validateArgs(args: any) {
        const isUint8Array = args.byteLength !== undefined && args.byteLength === args.length;
        if (isUint8Array) {
            return;
        }

        if (Array.isArray(args) || typeof args !== 'object') {
            throw new PositionalArgsError();
        }
    }

    /**
     * Invoke a contract view function using the RPC API.
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#call-a-contract-function}
     * 
     * @param contractId NEAR account where the contract is deployed
     * @param methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
     * @param args Any arguments to the view contract method, wrapped in JSON
     * @returns {Promise<any>}
     */
    async viewFunction(
        contractId: string,
        methodName: string,
        args: any = {},
        { parse = parseJsonFromRawResponse } = {}
    ): Promise<any> {
        this.validateArgs(args);
        
        const result = await this.connection.provider.query<CodeResult>({
            request_type: 'call_function',
            account_id: contractId,
            method_name: methodName,
            args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
            finality: 'optimistic'
        });

        if (result.logs) {
            this.printLogs(contractId, result.logs);
        }

        return result.result && result.result.length > 0 && parse(Buffer.from(result.result));
    }

    /**
     * Returns the state (key value pairs) of this account's contract based on the key prefix.
     * Pass an empty string for prefix if you would like to return the entire state.
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#view-contract-state}
     *
     * @param prefix allows to filter which keys should be returned. Empty prefix means all keys. String prefix is utf-8 encoded.
     * @param blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
     */
    async viewState(prefix: string | Uint8Array, blockQuery: { blockId: BlockId } | { finality: Finality } = { finality: 'optimistic' } ): Promise<Array<{ key: Buffer; value: Buffer}>> {
        const { values } = await this.connection.provider.query<ViewStateResult>({
            request_type: 'view_state',
            ...blockQuery,
            account_id: this.accountId,
            prefix_base64: Buffer.from(prefix).toString('base64')
        });

        return values.map(({key, value}) => ({
            key: Buffer.from(key, 'base64'),
            value: Buffer.from(value, 'base64')
        }));
    }

    /**
     * Get all access keys for the account
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#view-access-key-list}
     */
    async getAccessKeys(): Promise<AccessKeyInfoView[]> {
        const response = await this.connection.provider.query<AccessKeyList>({
            request_type: 'view_access_key_list',
            account_id: this.accountId,
            finality: 'optimistic'
        });
        // A breaking API change introduced extra information into the
        // response, so it now returns an object with a `keys` field instead
        // of an array: https://github.com/nearprotocol/nearcore/pull/1789
        if (Array.isArray(response)) {
            return response;
        }
        return response.keys;
    }

    /**
     * Returns a list of authorized apps
     * @todo update the response value to return all the different keys, not just app keys.
     */
    async getAccountDetails(): Promise<{ authorizedApps: AccountAuthorizedApp[] }> {
        // TODO: update the response value to return all the different keys, not just app keys.
        // Also if we need this function, or getAccessKeys is good enough.
        const accessKeys = await this.getAccessKeys();
        const authorizedApps = accessKeys
            .filter(item => item.access_key.permission !== 'FullAccess')
            .map(item => {
                const perm = (item.access_key.permission as FunctionCallPermissionView);
                return {
                    contractId: perm.FunctionCall.receiver_id,
                    amount: perm.FunctionCall.allowance,
                    publicKey: item.public_key,
                };
            });
        return { authorizedApps };
    }

    /**
     * Returns calculated account balance
     */
    async getAccountBalance(): Promise<AccountBalance> {
        const protocolConfig = await this.connection.provider.experimental_protocolConfig({ finality: 'final' });
        const state = await this.state();

        const costPerByte = new BN(protocolConfig.runtime_config.storage_amount_per_byte);
        const stateStaked = new BN(state.storage_usage).mul(costPerByte);
        const staked = new BN(state.locked);
        const totalBalance = new BN(state.amount).add(staked);
        const availableBalance = totalBalance.sub(BN.max(staked, stateStaked));

        return {
            total: totalBalance.toString(),
            stateStaked: stateStaked.toString(),
            staked: staked.toString(),
            available: availableBalance.toString()
        };
    }
}
