import { PublicKey } from '@near-js/crypto';
import { exponentialBackoff } from '@near-js/providers';
import {
    actionCreators,
    Action,
    buildDelegateAction,
    signDelegateAction,
    signTransaction,
    SignedDelegate,
    SignedTransaction,
    stringifyJsonOrBytes,
} from '@near-js/transactions';
import {
    PositionalArgsError,
    FinalExecutionOutcome,
    TypedError,
    ErrorContext,
    AccountView,
    AccessKeyView,
    AccessKeyViewRaw,
    AccessKeyList,
    AccessKeyInfoView,
    FunctionCallPermissionView,
    BlockReference,
} from '@near-js/types';
import {
    baseDecode,
    baseEncode,
    Logger,
    parseResultError,
    DEFAULT_FUNCTION_CALL_GAS,
    printTxOutcomeLogsAndFailures,
} from '@near-js/utils';

import { Connection } from './connection';
import { viewFunction, viewState } from './utils';
import { ChangeFunctionCallOptions, IntoConnection, ViewFunctionCallOptions } from './interface';

const {
    addKey,
    createAccount,
    deleteAccount,
    deleteKey,
    deployContract,
    fullAccessKey,
    functionCall,
    functionCallAccessKey,
    stake,
    transfer,
} = actionCreators;

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
     * @see RequestSignTransactionsOptions
     */
    walletMeta?: string;
    /**
     * Callback url to send the NEAR Wallet if using it to sign transactions.
     * @see RequestSignTransactionsOptions
     */
    walletCallbackUrl?: string;
    returnError?: boolean;
}

interface StakedBalance {
    validatorId: string;
    amount?: string;
    error?: string;
}

interface ActiveDelegatedStakeBalance {
    stakedValidators: StakedBalance[];
    failedValidators: StakedBalance[];
    total: bigint | string;
}

interface SignedDelegateOptions {
    actions: Action[];
    blockHeightTtl: number;
    receiverId: string;
}

/**
 * This class provides common account related RPC calls including signing transactions with a {@link "@near-js/crypto".key_pair.KeyPair | KeyPair}.
 */
export class Account implements IntoConnection {
    readonly connection: Connection;
    readonly accountId: string;

    constructor(connection: Connection, accountId: string) {
        this.connection = connection;
        this.accountId = accountId;
    }

    getConnection(): Connection {
        return this.connection;
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

    /**
     * Create a signed transaction which can be broadcast to the network
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the transaction
     * @see {@link "@near-js/providers".json-rpc-provider.JsonRpcProvider.sendTransaction | JsonRpcProvider.sendTransaction}
     */
    protected async signTransaction(receiverId: string, actions: Action[]): Promise<[Uint8Array, SignedTransaction]> {
        const accessKeyInfo = await this.findAccessKey(receiverId, actions);
        if (!accessKeyInfo) {
            throw new TypedError(`Can not sign transactions for account ${this.accountId} on network ${this.connection.networkId}, no matching key pair exists for this account`, 'KeyNotFound');
        }
        const { accessKey } = accessKeyInfo;

        const block = await this.connection.provider.block({ finality: 'final' });
        const blockHash = block.header.hash;

        const nonce = accessKey.nonce + BigInt(1);
        return await signTransaction(
            receiverId, nonce, actions, baseDecode(blockHash), this.connection.signer, this.accountId, this.connection.networkId
        );
    }

    /**
     * Sign a transaction to perform a list of actions and broadcast it using the RPC API.
     * @see {@link "@near-js/providers".json-rpc-provider.JsonRpcProvider | JsonRpcProvider }
     * 
     * @param options The options for signing and sending the transaction.
     * @param options.receiverId The NEAR account ID of the transaction receiver.
     * @param options.actions The list of actions to be performed in the transaction.
     * @param options.returnError Whether to return an error if the transaction fails.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the transaction.
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
                    Logger.warn(`Retrying transaction ${receiverId}:${baseEncode(txHash)} with new nonce.`);
                    delete this.accessKeyByPublicKeyCache[publicKey.toString()];
                    return null;
                }
                if (error.type === 'Expired') {
                    Logger.warn(`Retrying transaction ${receiverId}:${baseEncode(txHash)} due to expired block hash`);
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

        printTxOutcomeLogsAndFailures({ contractId: signedTx.transaction.receiverId, outcome: result });

        // Should be falsy if result.status.Failure is null
        if (!returnError && typeof result.status === 'object' && typeof result.status.Failure === 'object' && result.status.Failure !== null) {
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

    /**
     * Sign and send a transaction asynchronously, returning the transaction hash immediately
     * without waiting for the transaction to complete.
     * 
     * @param options The options for signing and sending the transaction
     * @returns Promise<string> The base58-encoded transaction hash
     */
    async signAndSendTransactionAsync({ receiverId, actions }: SignAndSendTransactionOptions): Promise<string> {
        const result = await exponentialBackoff(TX_NONCE_RETRY_WAIT, TX_NONCE_RETRY_NUMBER, TX_NONCE_RETRY_WAIT_BACKOFF, async () => {
            const [txHash, signedTx] = await this.signTransaction(receiverId, actions);
            const publicKey = signedTx.transaction.publicKey;

            try {
                // Wait for the async operation to complete or throw
                await this.connection.provider.sendTransactionAsync(signedTx);
                return baseEncode(txHash);
            } catch (error) {
                if (error.type === 'InvalidNonce') {
                    Logger.warn(`Retrying transaction ${receiverId}:${baseEncode(txHash)} with new nonce.`);
                    delete this.accessKeyByPublicKeyCache[publicKey.toString()];
                    return null;
                }
                if (error.type === 'Expired') {
                    Logger.warn(`Retrying transaction ${receiverId}:${baseEncode(txHash)} due to expired block hash`);
                    return null;
                }
    
                error.context = new ErrorContext(baseEncode(txHash));
                throw error;
            }
        });

        if (!result) {
            throw new TypedError('nonce retries exceeded for transaction. This usually means there are too many parallel requests with the same access key.', 'RetriesExceeded');
        }

        return result;
    }

    /**
     * Send a signed transaction to the network and wait for its completion
     * 
     * @param hash The hash of the transaction to be sent
     * @param signedTx The signed transaction to be sent
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the transaction
     */
    async sendTransaction(hash: Uint8Array, signedTx: SignedTransaction): Promise<FinalExecutionOutcome> {
        const result = await exponentialBackoff(TX_NONCE_RETRY_WAIT, TX_NONCE_RETRY_NUMBER, TX_NONCE_RETRY_WAIT_BACKOFF, async () => {
            const publicKey = signedTx.transaction.publicKey;

            try {
                return await this.connection.provider.sendTransaction(signedTx);
            } catch (error) {
                if (error.type === 'InvalidNonce') {
                    Logger.warn(`Retrying transaction ${signedTx.transaction.receiverId}:${baseEncode(hash)} with new nonce.`);
                    delete this.accessKeyByPublicKeyCache[publicKey.toString()];
                    return null;
                }
                if (error.type === 'Expired') {
                    Logger.warn(`Retrying transaction ${signedTx.transaction.receiverId}:${baseEncode(hash)} due to expired block hash`);
                    return null;
                }

                error.context = new ErrorContext(baseEncode(hash));
                throw error;
            }
        });
        if (!result) {
            // TODO: This should have different code actually, as means "transaction not submitted for sure"
            throw new TypedError('nonce retries exceeded for transaction. This usually means there are too many parallel requests with the same access key.', 'RetriesExceeded');
        }

        printTxOutcomeLogsAndFailures({ contractId: signedTx.transaction.receiverId, outcome: result });

        // Should be falsy if result.status.Failure is null
        if (typeof result.status === 'object' && typeof result.status.Failure === 'object' && result.status.Failure !== null) {
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
     * Finds the {@link AccessKeyView} associated with the accounts {@link PublicKey} stored in the {@link "@near-js/keystores".keystore.KeyStore | Keystore}.
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

            // store nonce as BigInt to preserve precision on big number
            const accessKey = {
                ...rawAccessKey,
                nonce: BigInt(rawAccessKey.nonce || 0)
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
    async createAndDeployContract(contractId: string, publicKey: string | PublicKey, data: Uint8Array, amount: bigint): Promise<Account> {
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
    async sendMoney(receiverId: string, amount: bigint): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId,
            actions: [transfer(amount)]
        });
    }

    /**
     * @param newAccountId NEAR account name to be created
     * @param publicKey A public key created from the masterAccount
     */
    async createAccount(newAccountId: string, publicKey: string | PublicKey, amount: bigint): Promise<FinalExecutionOutcome> {
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
        Logger.log('Deleting an account does not automatically transfer NFTs and FTs to the beneficiary address. Ensure to transfer assets before deleting.');
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
     * Execute a function call.
     * @param options The options for the function call.
     * @param options.contractId The NEAR account ID of the smart contract.
     * @param options.methodName The name of the method to be called on the smart contract.
     * @param options.args The arguments to be passed to the method.
     * @param options.gas The maximum amount of gas to be used for the function call.
     * @param options.attachedDeposit The amount of NEAR tokens to be attached to the function call.
     * @param options.walletMeta Metadata for wallet integration.
     * @param options.walletCallbackUrl The callback URL for wallet integration.
     * @param options.stringify A function to convert input arguments into bytes array
     * @param options.jsContract Whether the contract is from JS SDK, automatically encodes args from JS SDK to binary.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the function call.
     */
    async functionCall({ contractId, methodName, args = {}, gas = DEFAULT_FUNCTION_CALL_GAS, attachedDeposit, walletMeta, walletCallbackUrl, stringify, jsContract }: ChangeFunctionCallOptions): Promise<FinalExecutionOutcome> {
        this.validateArgs(args);
        let functionCallArgs;

        if (jsContract) {
            const encodedArgs = this.encodeJSContractArgs(contractId, methodName, JSON.stringify(args));
            functionCallArgs = ['call_js_contract', encodedArgs, gas, attachedDeposit, null, true];
        } else {
            const stringifyArg = stringify === undefined ? stringifyJsonOrBytes : stringify;
            functionCallArgs = [methodName, args, gas, attachedDeposit, stringifyArg, false];
        }

        return this.signAndSendTransaction({
            receiverId: jsContract ? this.connection.jsvmAccountId : contractId,
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
    async addKey(publicKey: string | PublicKey, contractId?: string, methodNames?: string | string[], amount?: bigint): Promise<FinalExecutionOutcome> {
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
    async stake(publicKey: string | PublicKey, amount: bigint): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [stake(amount, PublicKey.from(publicKey))]
        });
    }

    /**
     * Compose and sign a SignedDelegate action to be executed in a transaction on behalf of this Account instance
     *
     * @param options Options for the transaction.
     * @param options.actions Actions to be included in the meta transaction
     * @param options.blockHeightTtl Number of blocks past the current block height for which the SignedDelegate action may be included in a meta transaction
     * @param options.receiverId Receiver account of the meta transaction
     */
    async signedDelegate({
        actions,
        blockHeightTtl,
        receiverId,
    }: SignedDelegateOptions): Promise<SignedDelegate> {
        const { provider, signer } = this.connection;
        const { header } = await provider.block({ finality: 'final' });
        const { accessKey, publicKey } = await this.findAccessKey(null, null);

        const delegateAction = buildDelegateAction({
            actions,
            maxBlockHeight: BigInt(header.height) + BigInt(blockHeightTtl),
            nonce: BigInt(accessKey.nonce) + BigInt(1),
            publicKey,
            receiverId,
            senderId: this.accountId,
        });

        const { signedDelegateAction } = await signDelegateAction({
            delegateAction,
            signer: {
                sign: async (message) => {
                    const { signature } = await signer.signMessage(
                        message,
                        delegateAction.senderId,
                        this.connection.networkId
                    );

                    return signature;
                },
            }
        });

        return signedDelegateAction;
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
     * @param options Function call options.
     * @param options.contractId NEAR account where the contract is deployed
     * @param options.methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
     * @param options.args Any arguments to the view contract method, wrapped in JSON
     * @param options.parse Parse the result of the call. Receives a Buffer (bytes array) and converts it to any object. By default result will be treated as json.
     * @param options.stringify Convert input arguments into a bytes array. By default the input is treated as a JSON.
     * @param options.jsContract Is contract from JS SDK, automatically encodes args from JS SDK to binary.
     * @param options.blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
     * @returns {Promise<any>}
     */

    async viewFunction(options: ViewFunctionCallOptions): Promise<any> {
        return await viewFunction(this.connection, options);
    }

    /**
     * Returns the state (key value pairs) of this account's contract based on the key prefix.
     * Pass an empty string for prefix if you would like to return the entire state.
     * @see [https://docs.near.org/api/rpc/contracts#view-contract-state](https://docs.near.org/api/rpc/contracts#view-contract-state)
     *
     * @param prefix allows to filter which keys should be returned. Empty prefix means all keys. String prefix is utf-8 encoded.
     * @param blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
     */
    async viewState(prefix: string | Uint8Array, blockQuery: BlockReference = { finality: 'optimistic' }): Promise<Array<{ key: Buffer; value: Buffer }>> {
        return await viewState(this.connection, this.accountId, prefix, blockQuery);
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
        // Replace raw nonce into a new BigInt
        return response?.keys?.map((key) => ({ ...key, access_key: { ...key.access_key, nonce: BigInt(key.access_key.nonce) } }));
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

        const costPerByte = BigInt(protocolConfig.runtime_config.storage_amount_per_byte);
        const stateStaked = BigInt(state.storage_usage) * costPerByte;
        const staked = BigInt(state.locked);
        const totalBalance = BigInt(state.amount) + staked;
        const availableBalance = totalBalance - (staked > stateStaked ? staked : stateStaked);

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
    async getActiveDelegatedStakeBalance(): Promise<ActiveDelegatedStakeBalance> {
        const block = await this.connection.provider.block({ finality: 'final' });
        const blockHash = block.header.hash;
        const epochId = block.header.epoch_id;
        const { current_validators, next_validators, current_proposals } = await this.connection.provider.validators(epochId);
        const pools: Set<string> = new Set();
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
                const currentBN = BigInt(state.value);
                if (currentBN !== BigInt(0)) {
                    return {
                        ...result,
                        stakedValidators: [...result.stakedValidators, { validatorId, amount: currentBN.toString() }],
                        total: result.total + currentBN,
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
            { stakedValidators: [], failedValidators: [], total: BigInt(0) });

        return {
            ...summary,
            total: summary.total.toString(),
        };
    }
}
