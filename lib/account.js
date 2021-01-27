'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const transaction_1 = require("./transaction");
const providers_1 = require("./providers");
const borsh_1 = require("borsh");
const key_pair_1 = require("./utils/key_pair");
const errors_1 = require("./utils/errors");
const rpc_errors_1 = require("./utils/rpc_errors");
const exponential_backoff_1 = __importDefault(require("./utils/exponential-backoff"));
// Default amount of gas to be sent with the function calls. Used to pay for the fees
// incurred while running the contract execution. The unused amount will be refunded back to
// the originator.
// Due to protocol changes that charge upfront for the maximum possible gas price inflation due to
// full blocks, the price of max_prepaid_gas is decreased to `300 * 10**12`.
// For discussion see https://github.com/nearprotocol/NEPs/issues/67
const DEFAULT_FUNC_CALL_GAS = new bn_js_1.default('30000000000000');
// Default number of retries with different nonce before giving up on a transaction.
const TX_NONCE_RETRY_NUMBER = 12;
// Default number of retries before giving up on a transaction.
const TX_STATUS_RETRY_NUMBER = 12;
// Default wait until next retry in millis.
const TX_STATUS_RETRY_WAIT = 500;
// Exponential back off for waiting to retry.
const TX_STATUS_RETRY_WAIT_BACKOFF = 1.5;
function parseJsonFromRawResponse(response) {
    return JSON.parse(Buffer.from(response).toString());
}
/**
 * More information on [the Account spec](https://nomicon.io/DataStructures/Account.html)
 */
class Account {
    constructor(connection, accountId) {
        this.accessKeyByPublicKeyCache = {};
        this.connection = connection;
        this.accountId = accountId;
    }
    get ready() {
        return this._ready || (this._ready = Promise.resolve(this.fetchState()));
    }
    /**
     * Helper function when getting the state of a NEAR account
     * @returns Promise<void>
     */
    async fetchState() {
        this._state = await this.connection.provider.query(`account/${this.accountId}`, '');
    }
    /**
     * Returns the state of a NEAR account
     * @returns {Promise<AccountState>}
     */
    async state() {
        await this.ready;
        return this._state;
    }
    printLogsAndFailures(contractId, results) {
        for (const result of results) {
            console.log(`Receipt${result.receiptIds.length > 1 ? 's' : ''}: ${result.receiptIds.join(', ')}`);
            this.printLogs(contractId, result.logs, '\t');
            if (result.failure) {
                console.warn(`\tFailure [${contractId}]: ${result.failure}`);
            }
        }
    }
    printLogs(contractId, logs, prefix = '') {
        for (const log of logs) {
            console.log(`${prefix}Log [${contractId}]: ${log}`);
        }
    }
    async signTransaction(receiverId, actions) {
        await this.ready;
        const accessKeyInfo = await this.findAccessKey(receiverId, actions);
        if (!accessKeyInfo) {
            throw new providers_1.TypedError(`Can not sign transactions for account ${this.accountId} on network ${this.connection.networkId}, no matching key pair found in ${this.connection.signer}.`, 'KeyNotFound');
        }
        const { accessKey } = accessKeyInfo;
        const block = await this.connection.provider.block({ finality: 'final' });
        const blockHash = block.header.hash;
        const nonce = ++accessKey.nonce;
        return await transaction_1.signTransaction(receiverId, nonce, actions, borsh_1.baseDecode(blockHash), this.connection.signer, this.accountId, this.connection.networkId);
    }
    /**
     * @param receiverId NEAR account receiving the transaction
     * @param actions The transaction [Action as described in the spec](https://nomicon.io/RuntimeSpec/Actions.html).
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async signAndSendTransaction(receiverId, actions) {
        await this.ready;
        let txHash, signedTx;
        // TODO: TX_NONCE (different constants for different uses of exponentialBackoff?)
        const result = await exponential_backoff_1.default(TX_STATUS_RETRY_WAIT, TX_NONCE_RETRY_NUMBER, TX_STATUS_RETRY_WAIT_BACKOFF, async () => {
            [txHash, signedTx] = await this.signTransaction(receiverId, actions);
            const publicKey = signedTx.transaction.publicKey;
            try {
                const result = await exponential_backoff_1.default(TX_STATUS_RETRY_WAIT, TX_STATUS_RETRY_NUMBER, TX_STATUS_RETRY_WAIT_BACKOFF, async () => {
                    try {
                        return await this.connection.provider.sendTransaction(signedTx);
                    }
                    catch (error) {
                        // TODO: Somehow getting still:
                        // Error: send_tx_commit has timed out.
                        if (error.type === 'TimeoutError') {
                            console.warn(`Retrying transaction ${receiverId}:${borsh_1.baseEncode(txHash)} as it has timed out`);
                            return null;
                        }
                        throw error;
                    }
                });
                if (!result) {
                    throw new providers_1.TypedError(`Exceeded ${TX_STATUS_RETRY_NUMBER} attempts for transaction ${borsh_1.baseEncode(txHash)}.`, 'RetriesExceeded', new providers_1.ErrorContext(borsh_1.baseEncode(txHash)));
                }
                return result;
            }
            catch (error) {
                if (error.message.match(/Transaction nonce \d+ must be larger than nonce of the used access key \d+/)) {
                    console.warn(`Retrying transaction ${receiverId}:${borsh_1.baseEncode(txHash)} with new nonce.`);
                    delete this.accessKeyByPublicKeyCache[publicKey.toString()];
                    return null;
                }
                error.context = new providers_1.ErrorContext(borsh_1.baseEncode(txHash));
                throw error;
            }
        });
        if (!result) {
            // TODO: This should have different code actually, as means "transaction not submitted for sure"
            throw new providers_1.TypedError('nonce retries exceeded for transaction. This usually means there are too many parallel requests with the same access key.', 'RetriesExceeded');
        }
        const flatLogs = [result.transaction_outcome, ...result.receipts_outcome].reduce((acc, it) => {
            if (it.outcome.logs.length ||
                (typeof it.outcome.status === 'object' && typeof it.outcome.status.Failure === 'object')) {
                return acc.concat({
                    'receiptIds': it.outcome.receipt_ids,
                    'logs': it.outcome.logs,
                    'failure': typeof it.outcome.status.Failure != 'undefined' ? rpc_errors_1.parseRpcError(it.outcome.status.Failure) : null
                });
            }
            else
                return acc;
        }, []);
        this.printLogsAndFailures(signedTx.transaction.receiverId, flatLogs);
        if (typeof result.status === 'object' && typeof result.status.Failure === 'object') {
            // if error data has error_message and error_type properties, we consider that node returned an error in the old format
            if (result.status.Failure.error_message && result.status.Failure.error_type) {
                throw new providers_1.TypedError(`Transaction ${result.transaction_outcome.id} failed. ${result.status.Failure.error_message}`, result.status.Failure.error_type);
            }
            else {
                throw rpc_errors_1.parseResultError(result);
            }
        }
        // TODO: if Tx is Unknown or Started.
        return result;
    }
    async findAccessKey(receiverId, actions) {
        // TODO: Find matching access key based on transaction
        const publicKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
        if (!publicKey) {
            return null;
        }
        const cachedAccessKey = this.accessKeyByPublicKeyCache[publicKey.toString()];
        if (cachedAccessKey !== undefined) {
            return { publicKey, accessKey: cachedAccessKey };
        }
        try {
            const accessKey = await this.connection.provider.query(`access_key/${this.accountId}/${publicKey.toString()}`, '');
            this.accessKeyByPublicKeyCache[publicKey.toString()] = accessKey;
            return { publicKey, accessKey };
        }
        catch (e) {
            // TODO: Check based on .type when nearcore starts returning query errors in structured format
            if (e.message.includes('does not exist while viewing')) {
                return null;
            }
            throw e;
        }
    }
    /**
     * @param contractId NEAR account where the contract is deployed
     * @param publicKey The public key to add while signing and sending the transaction
     * @param data The compiled contract code
     * @returns {Promise<Account>}
     */
    async createAndDeployContract(contractId, publicKey, data, amount) {
        const accessKey = transaction_1.fullAccessKey();
        await this.signAndSendTransaction(contractId, [transaction_1.createAccount(), transaction_1.transfer(amount), transaction_1.addKey(key_pair_1.PublicKey.from(publicKey), accessKey), transaction_1.deployContract(data)]);
        const contractAccount = new Account(this.connection, contractId);
        return contractAccount;
    }
    /**
     * @param receiverId NEAR account receiving Ⓝ
     * @param amount Amount to send in yoctoⓃ
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async sendMoney(receiverId, amount) {
        return this.signAndSendTransaction(receiverId, [transaction_1.transfer(amount)]);
    }
    /**
     * @param newAccountId NEAR account name to be created
     * @param publicKey A public key created from the masterAccount
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async createAccount(newAccountId, publicKey, amount) {
        const accessKey = transaction_1.fullAccessKey();
        return this.signAndSendTransaction(newAccountId, [transaction_1.createAccount(), transaction_1.transfer(amount), transaction_1.addKey(key_pair_1.PublicKey.from(publicKey), accessKey)]);
    }
    /**
     * @param beneficiaryId The NEAR account that will receive the remaining Ⓝ balance from the account being deleted
     * @returns void
     */
    async deleteAccount(beneficiaryId) {
        return this.signAndSendTransaction(this.accountId, [transaction_1.deleteAccount(beneficiaryId)]);
    }
    /**
     * @param data The compiled contract code
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async deployContract(data) {
        return this.signAndSendTransaction(this.accountId, [transaction_1.deployContract(data)]);
    }
    /**
     * @param contractId NEAR account where the contract is deployed
     * @param methodName The method name on the contract as it is written in the contract code
     * @param args arguments to pass to method. Can be either plain JS object which gets serialized as JSON automatically
     *  or `Uint8Array` instance which represents bytes passed as is.
     * @param gas max amount of gas that method call can use
      * @param deposit amount of NEAR (in yoctoNEAR) to send together with the call
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async functionCall(contractId, methodName, args, gas, amount) {
        args = args || {};
        this.validateArgs(args);
        return this.signAndSendTransaction(contractId, [transaction_1.functionCall(methodName, args, gas || DEFAULT_FUNC_CALL_GAS, amount)]);
    }
    /**
     * @param publicKey A public key to be associated with the contract
     * @param contractId NEAR account where the contract is deployed
     * @param methodNames The method names on the contract that should be allowed to be called. Pass null for no method names and '' or [] for any method names.
     * @param amount Payment in yoctoⓃ that is sent to the contract during this function call
     * @returns {Promise<FinalExecutionOutcome>}
     * TODO: expand this API to support more options.
     */
    async addKey(publicKey, contractId, methodNames, amount) {
        if (!methodNames) {
            methodNames = [];
        }
        if (!Array.isArray(methodNames)) {
            methodNames = [methodNames];
        }
        let accessKey;
        if (!contractId) {
            accessKey = transaction_1.fullAccessKey();
        }
        else {
            accessKey = transaction_1.functionCallAccessKey(contractId, methodNames, amount);
        }
        return this.signAndSendTransaction(this.accountId, [transaction_1.addKey(key_pair_1.PublicKey.from(publicKey), accessKey)]);
    }
    /**
     * @param publicKey The public key to be deleted
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async deleteKey(publicKey) {
        return this.signAndSendTransaction(this.accountId, [transaction_1.deleteKey(key_pair_1.PublicKey.from(publicKey))]);
    }
    /**
     * @param publicKey The public key for the account that's staking
     * @param amount The account to stake in yoctoⓃ
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async stake(publicKey, amount) {
        return this.signAndSendTransaction(this.accountId, [transaction_1.stake(amount, key_pair_1.PublicKey.from(publicKey))]);
    }
    validateArgs(args) {
        const isUint8Array = args.byteLength !== undefined && args.byteLength === args.length;
        if (isUint8Array) {
            return;
        }
        if (Array.isArray(args) || typeof args !== 'object') {
            throw new errors_1.PositionalArgsError();
        }
    }
    /**
     * @param contractId NEAR account where the contract is deployed
     * @param methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
     * @param args Any arguments to the view contract method, wrapped in JSON
     * @returns {Promise<any>}
     */
    async viewFunction(contractId, methodName, args, { parse = parseJsonFromRawResponse } = {}) {
        args = args || {};
        this.validateArgs(args);
        const result = await this.connection.provider.query(`call/${contractId}/${methodName}`, borsh_1.baseEncode(JSON.stringify(args)));
        if (result.logs) {
            this.printLogs(contractId, result.logs);
        }
        return result.result && result.result.length > 0 && parse(Buffer.from(result.result));
    }
    /**
     * See https://docs.near.org/docs/api/rpc#view-contract-state
     *
     * Returns the state (key value pairs) of this account's contract based on the key prefix.
     * Pass an empty string for prefix if you would like to return the entire state.
     *
     * @param prefix allows to filter which keys should be returned. Empty prefix means all keys. String prefix is utf-8 encoded.
     * @param blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
     */
    async viewState(prefix, blockQuery) {
        const { blockId, finality } = blockQuery || {};
        const { values } = await this.connection.provider.query({
            request_type: 'view_state',
            block_id: blockId,
            finality: blockId ? undefined : finality || 'optimistic',
            account_id: this.accountId,
            prefix_base64: Buffer.from(prefix).toString('base64')
        });
        return values.map(({ key, value }) => ({
            key: Buffer.from(key, 'base64'),
            value: Buffer.from(value, 'base64')
        }));
    }
    /**
     * @returns array of {access_key: AccessKey, public_key: PublicKey} items.
     */
    async getAccessKeys() {
        const response = await this.connection.provider.query(`access_key/${this.accountId}`, '');
        // A breaking API change introduced extra information into the
        // response, so it now returns an object with a `keys` field instead
        // of an array: https://github.com/nearprotocol/nearcore/pull/1789
        if (Array.isArray(response)) {
            return response;
        }
        return response.keys;
    }
    /**
     * Returns account details in terms of authorized apps and transactions
     * @returns {Promise<any>}
     */
    async getAccountDetails() {
        // TODO: update the response value to return all the different keys, not just app keys.
        // Also if we need this function, or getAccessKeys is good enough.
        const accessKeys = await this.getAccessKeys();
        const result = { authorizedApps: [], transactions: [] };
        accessKeys.map((item) => {
            if (item.access_key.permission.FunctionCall !== undefined) {
                const perm = item.access_key.permission.FunctionCall;
                result.authorizedApps.push({
                    contractId: perm.receiver_id,
                    amount: perm.allowance,
                    publicKey: item.public_key,
                });
            }
        });
        return result;
    }
    /**
     * Returns calculated account balance
     * @returns {Promise<AccountBalance>}
     */
    async getAccountBalance() {
        const genesisConfig = await this.connection.provider.experimental_genesisConfig();
        const state = await this.state();
        const costPerByte = new bn_js_1.default(genesisConfig.runtime_config.storage_amount_per_byte);
        const stateStaked = new bn_js_1.default(state.storage_usage).mul(costPerByte);
        const staked = new bn_js_1.default(state.locked);
        const totalBalance = new bn_js_1.default(state.amount).add(staked);
        const availableBalance = totalBalance.sub(bn_js_1.default.max(staked, stateStaked));
        return {
            total: totalBalance.toString(),
            stateStaked: stateStaked.toString(),
            staked: staked.toString(),
            available: availableBalance.toString()
        };
    }
}
exports.Account = Account;
