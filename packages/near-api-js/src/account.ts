import BN from 'bn.js';

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
    SignedTransaction,
    stringifyJsonOrBytes
} from './transaction';
import { FinalExecutionOutcome, TypedError, ErrorContext } from './providers';
import {
    ViewStateResult,
    AccountView,
    AccessKeyView,
    AccessKeyViewRaw,
    CodeResult,
    AccessKeyList,
    AccessKeyInfoView,
    FunctionCallPermissionView,
    BlockReference
} from './providers/provider';
import { Connection } from './connection';
import { baseDecode, baseEncode } from 'borsh';
import { PublicKey } from './utils/key_pair';
import { logWarning, PositionalArgsError } from './utils/errors';
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
    returnError?: boolean;
}

/**
 * Options used to initiate a function call (especially a change function call)
 * @see {@link account!Account#viewFunction} to initiate a view function call
 */
export interface FunctionCallOptions {
    /** The NEAR account id where the contract is deployed */
    contractId: string;
    /** The name of the method to invoke */
    methodName: string;
    /**
     * named arguments to pass the method `{ messageText: 'my message' }`
     */
    args?: object;
    /** max amount of gas that method call can use */
    gas?: BN;
    /** amount of NEAR (in yoctoNEAR) to send together with the call */
    attachedDeposit?: BN;
    /**
     * Convert input arguments into bytes array.
     */
    stringify?: (input: any) => Buffer;
    /**
     * Is contract from JS SDK, automatically encodes args from JS SDK to binary.
     */
    jsContract?: boolean;
}

export interface ChangeFunctionCallOptions extends FunctionCallOptions {
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
export interface ViewFunctionCallOptions extends FunctionCallOptions { 
    parse?: (response: Uint8Array) => any; 
    blockQuery?: BlockReference; 
}

interface ReceiptLogWithFailure {
    receiptIds: [string];
    logs: [string];
    failure: ServerError;
}

interface StakedBalance {
    validatorId: string;
    amount?: string;
    error?: string;
}

interface ActiveDelegatedStakeBalance {
    stakedValidators: StakedBalance[];
    failedValidators: StakedBalance[];
    total: BN | string;
}

function parseJsonFromRawResponse(response: Uint8Array): any {
    return JSON.parse(Buffer.from(response).toString());
}

function bytesJsonStringify(input: any): Buffer {
    return Buffer.from(JSON.stringify(input));
}

/**
 * This class provides common account related RPC calls including signing transactions with a {@link utils/key_pair!KeyPair}.
 *
 * @hint Use {@link walletAccount!WalletConnection} in the browser to redirect to [NEAR Wallet](https://wallet.near.org/) for Account/key management using the {@link key_stores/browser_local_storage_key_store!BrowserLocalStorageKeyStore}.
 * @see [https://docs.near.org/docs/develop/front-end/naj-quick-reference#account](https://docs.near.org/tools/near-api-js/quick-reference#account)
 * @see [Account Spec](https://nomicon.io/DataStructures/Account.html)
 */
export class Account {
    readonly connection: Connection;
    readonly accountId: string;

    constructor(connection: Connection, accountId: string) {
        this.connection = connection;
        this.accountId = accountId;
    }

    /**
     * Returns basic NEAR account information via the `view_account` RPC query method
     * @see [https://docs.near.org/api/rpc/contracts#view-account](https://docs.near.org/api/rpc/contracts#view-account)
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
        if (!process.env['NEAR_NO_LOGS']) {
            for (const result of results) {
                console.log(`Receipt${result.receiptIds.length > 1 ? 's' : ''}: ${result.receiptIds.join(', ')}`);
                this.printLogs(contractId, result.logs, '\t');
                if (result.failure) {
                    console.warn(`\tFailure [${contractId}]: ${result.failure}`);
                }
            }
        }
    }

    /** @hidden */
    private printLogs(contractId: string, logs: string[], prefix = '') {
        if (!process.env['NEAR_NO_LOGS']) {
            for (const log of logs) {
                console.log(`${prefix}Log [${contractId}]: ${log}`);
            }
        }
    }

    /**
     * Create a signed transaction which can be broadcast to the network
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the transaction
     * @see {@link providers/json-rpc-provider!JsonRpcProvider#sendTransaction | JsonRpcProvider.sendTransaction}
     */
    protected async signTransaction(receiverId: string, actions: Action[]): Promise<[Uint8Array, SignedTransaction]> {
        const accessKeyInfo = await this.findAccessKey(receiverId, actions);
        if (!accessKeyInfo) {
            throw new TypedError(`Can not sign transactions for account ${this.accountId} on network ${this.connection.networkId}, no matching key pair exists for this account`, 'KeyNotFound');
        }
        const { accessKey } = accessKeyInfo;

        const block = await this.connection.provider.block({ finality: 'final' });
        const blockHash = block.header.hash;

        const nonce = accessKey.nonce.add(new BN(1));
        return await signTransaction(
            receiverId, nonce, actions, baseDecode(blockHash), this.connection.signer, this.accountId, this.connection.networkId
        );
    }

    /**
     * Sign a transaction to preform a list of actions and broadcast it using the RPC API.
     * @see {@link providers/json-rpc-provider!JsonRpcProvider#sendTransaction | JsonRpcProvider.sendTransaction}
     */
    async signAndSendTransaction({ receiverId, actions, returnError }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
        let txHash, signedTx;
        // TODO: TX_NONCE (different constants for different uses of exponentialBackoff?)
        const result = await exponentialBackoff(TX_NONCE_RETRY_WAIT, TX_NONCE_RETRY_NUMBER, TX_NONCE_RETRY_WAIT_BACKOFF, async () => {
            [txHash, signedTx] = await this.signTransaction(receiverId, actions);
            const publicKey = signedTx.transaction.publicKey;

            try {
                return await this.connection.provider.sendTransaction(signedTx);
            } catch (error) {
                if (error.type === 'InvalidNonce') {
                    logWarning(`Retrying transaction ${receiverId}:${baseEncode(txHash)} with new nonce.`);
                    delete this.accessKeyByPublicKeyCache[publicKey.toString()];
                    return null;
                }
                if (error.type === 'Expired') {
                    logWarning(`Retrying transaction ${receiverId}:${baseEncode(txHash)} due to expired block hash`);
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

        // Should be falsy if result.status.Failure is null
        if (!returnError && typeof result.status === 'object' && typeof result.status.Failure === 'object'  && result.status.Failure !== null) {
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
    accessKeyByPublicKeyCache: { [key: string]: AccessKeyView } = {};

    /**
     * Finds the {@link providers/provider!AccessKeyView} associated with the accounts {@link utils/key_pair!PublicKey} stored in the {@link key_stores/keystore!KeyStore}.
     *
     * @todo Find matching access key based on transaction (i.e. receiverId and actions)
     *
     * @param receiverId currently unused (see todo)
     * @param actions currently unused (see todo)
     * @returns `{ publicKey PublicKey; accessKey: AccessKeyView }`
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async findAccessKey(receiverId: string, actions: Action[]): Promise<{ publicKey: PublicKey; accessKey: AccessKeyView }> {
        // TODO: Find matching access key based on transaction (i.e. receiverId and actions)
        const publicKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
        if (!publicKey) {
            throw new TypedError(`no matching key pair found in ${this.connection.signer}`, 'PublicKeyNotFound');
        }

        const cachedAccessKey = this.accessKeyByPublicKeyCache[publicKey.toString()];
        if (cachedAccessKey !== undefined) {
            return { publicKey, accessKey: cachedAccessKey };
        }

        try {
            const rawAccessKey = await this.connection.provider.query<AccessKeyViewRaw>({
                request_type: 'view_access_key',
                account_id: this.accountId,
                public_key: publicKey.toString(),
                finality: 'optimistic'
            });

            // store nonce as BN to preserve precision on big number
            const accessKey = {
                ...rawAccessKey,
                nonce: new BN(rawAccessKey.nonce),
            };
            // this function can be called multiple times and retrieve the same access key
            // this checks to see if the access key was already retrieved and cached while
            // the above network call was in flight. To keep nonce values in line, we return
            // the cached access key.
            if (this.accessKeyByPublicKeyCache[publicKey.toString()]) {
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
        if (!process.env['NEAR_NO_LOGS']) {
            console.log('Deleting an account does not automatically transfer NFTs and FTs to the beneficiary address. Ensure to transfer assets before deleting.');
        }
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

    /** @hidden */
    private encodeJSContractArgs(contractId: string, method: string, args) {
        return Buffer.concat([Buffer.from(contractId), Buffer.from([0]), Buffer.from(method), Buffer.from([0]), Buffer.from(args)]);
    }

    /**
     * Execute function call
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async functionCall({ contractId, methodName, args = {}, gas = DEFAULT_FUNCTION_CALL_GAS, attachedDeposit, walletMeta, walletCallbackUrl, stringify, jsContract }: ChangeFunctionCallOptions): Promise<FinalExecutionOutcome> {
        this.validateArgs(args);
        let functionCallArgs;

        if(jsContract){
            const encodedArgs = this.encodeJSContractArgs( contractId, methodName, JSON.stringify(args) );
            functionCallArgs =  ['call_js_contract', encodedArgs, gas, attachedDeposit, null, true ];
        } else{
            const stringifyArg = stringify === undefined ? stringifyJsonOrBytes : stringify;
            functionCallArgs = [methodName, args, gas, attachedDeposit, stringifyArg, false];
        }

        return this.signAndSendTransaction({
            receiverId: jsContract ? this.connection.jsvmAccountId: contractId,
            // eslint-disable-next-line prefer-spread
            actions: [functionCall.apply(void 0, functionCallArgs)],
            walletMeta,
            walletCallbackUrl
        });
    }

    /**
     * @see [https://docs.near.org/concepts/basics/accounts/access-keys](https://docs.near.org/concepts/basics/accounts/access-keys)
     * @todo expand this API to support more options.
     * @param publicKey A public key to be associated with the contract
     * @param contractId NEAR account where the contract is deployed
     * @param methodNames The method names on the contract that should be allowed to be called. Pass null for no method names and '' or [] for any method names.
     * @param amount Payment in yoctoⓃ that is sent to the contract during this function call
     */
    async addKey(publicKey: string | PublicKey, contractId?: string, methodNames?: string | string[], amount?: BN): Promise<FinalExecutionOutcome> {
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
     * @see [https://near-nodes.io/validator/staking-and-delegation](https://near-nodes.io/validator/staking-and-delegation)
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
     * @see [https://docs.near.org/api/rpc/contracts#call-a-contract-function](https://docs.near.org/api/rpc/contracts#call-a-contract-function)
     *
     * @param viewFunctionCallOptions.contractId NEAR account where the contract is deployed
     * @param viewFunctionCallOptions.methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
     * @param viewFunctionCallOptions.args Any arguments to the view contract method, wrapped in JSON
     * @param viewFunctionCallOptions.parse Parse the result of the call. Receives a Buffer (bytes array) and converts it to any object. By default result will be treated as json.
     * @param viewFunctionCallOptions.stringify Convert input arguments into a bytes array. By default the input is treated as a JSON.
     * @param viewFunctionCallOptions.jsContract Is contract from JS SDK, automatically encodes args from JS SDK to binary.
     * @param viewFunctionCallOptions.blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
     * @returns {Promise<any>}
     */

    async viewFunction({
        contractId,
        methodName,
        args = {},
        parse = parseJsonFromRawResponse,
        stringify = bytesJsonStringify,
        jsContract = false,
        blockQuery = { finality: 'optimistic' }
    }: ViewFunctionCallOptions): Promise<any> {
        let encodedArgs;
        
        this.validateArgs(args);
    
        if(jsContract){
            encodedArgs = this.encodeJSContractArgs(contractId, methodName, Object.keys(args).length >  0 ? JSON.stringify(args): '');
        } else{
            encodedArgs =  stringify(args);
        }

        const result = await this.connection.provider.query<CodeResult>({
            request_type: 'call_function',
            ...blockQuery,
            account_id: jsContract ? this.connection.jsvmAccountId : contractId,
            method_name: jsContract ? 'view_js_contract'  : methodName,
            args_base64: encodedArgs.toString('base64')
        });

        if (result.logs) {
            this.printLogs(contractId, result.logs);
        }

        return result.result && result.result.length > 0 && parse(Buffer.from(result.result));
    }

    /**
     * Returns the state (key value pairs) of this account's contract based on the key prefix.
     * Pass an empty string for prefix if you would like to return the entire state.
     * @see [https://docs.near.org/api/rpc/contracts#view-contract-state](https://docs.near.org/api/rpc/contracts#view-contract-state)
     *
     * @param prefix allows to filter which keys should be returned. Empty prefix means all keys. String prefix is utf-8 encoded.
     * @param blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
     */
    async viewState(prefix: string | Uint8Array, blockQuery: BlockReference = { finality: 'optimistic' } ): Promise<Array<{ key: Buffer; value: Buffer}>> {
        const { values } = await this.connection.provider.query<ViewStateResult>({
            request_type: 'view_state',
            ...blockQuery,
            account_id: this.accountId,
            prefix_base64: Buffer.from(prefix).toString('base64')
        });

        return values.map(({ key, value }) => ({
            key: Buffer.from(key, 'base64'),
            value: Buffer.from(value, 'base64')
        }));
    }

    /**
     * Get all access keys for the account
     * @see [https://docs.near.org/api/rpc/access-keys#view-access-key-list](https://docs.near.org/api/rpc/access-keys#view-access-key-list)
     */
    async getAccessKeys(): Promise<AccessKeyInfoView[]> {
        const response = await this.connection.provider.query<AccessKeyList>({
            request_type: 'view_access_key_list',
            account_id: this.accountId,
            finality: 'optimistic'
        });
        // Replace raw nonce into a new BN
        return response?.keys?.map((key) => ({ ...key, access_key: { ...key.access_key, nonce: new BN(key.access_key.nonce) } }));
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

    /**
     * Returns the NEAR tokens balance and validators of a given account that is delegated to the staking pools that are part of the validators set in the current epoch.
     * 
     * NOTE: If the tokens are delegated to a staking pool that is currently on pause or does not have enough tokens to participate in validation, they won't be accounted for.
     * @returns {Promise<ActiveDelegatedStakeBalance>}
     */
    async getActiveDelegatedStakeBalance(): Promise<ActiveDelegatedStakeBalance>  {
        const block = await this.connection.provider.block({ finality: 'final' });
        const blockHash = block.header.hash;
        const epochId = block.header.epoch_id;
        const { current_validators, next_validators, current_proposals } = await this.connection.provider.validators(epochId);
        const pools:Set<string> = new Set();
        [...current_validators, ...next_validators, ...current_proposals]
            .forEach((validator) => pools.add(validator.account_id));

        const uniquePools = [...pools];
        const promises = uniquePools
            .map((validator) => (
                this.viewFunction({
                    contractId: validator,
                    methodName: 'get_account_total_balance',
                    args: { account_id: this.accountId },
                    blockQuery: { blockId: blockHash }
                })
            ));

        const results = await Promise.allSettled(promises);

        const hasTimeoutError = results.some((result) => {
            if (result.status === 'rejected' && result.reason.type === 'TimeoutError') {
                return true;
            }
            return false;
        });

        // When RPC is down and return timeout error, throw error
        if (hasTimeoutError) {
            throw new Error('Failed to get delegated stake balance');
        }
        const summary = results.reduce((result, state, index) => {
            const validatorId = uniquePools[index];
            if (state.status === 'fulfilled') {
                const currentBN = new BN(state.value);
                if (!currentBN.isZero()) {
                    return {
                        ...result,
                        stakedValidators: [...result.stakedValidators, { validatorId, amount: currentBN.toString() }],
                        total: result.total.add(currentBN),
                    };
                }
            }
            if (state.status === 'rejected') {
                return {
                    ...result,
                    failedValidators: [...result.failedValidators, { validatorId, error: state.reason }],
                };
            }
            return result;
        },
        { stakedValidators: [], failedValidators: [], total: new BN(0) });

        return {
            ...summary,
            total: summary.total.toString(),
        };
    }
}
