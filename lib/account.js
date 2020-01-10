'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("./transaction");
const providers_1 = require("./providers");
const serialize_1 = require("./utils/serialize");
const key_pair_1 = require("./utils/key_pair");
const rpc_errors_1 = require("./utils/rpc_errors");
const errors_1 = require("./utils/errors");
// Default amount of tokens to be send with the function calls. Used to pay for the fees
// incurred while running the contract execution. The unused amount will be refunded back to
// the originator.
const DEFAULT_FUNC_CALL_AMOUNT = 2000000 * 1000000;
// Default number of retries before giving up on a transactioin.
const TX_STATUS_RETRY_NUMBER = 10;
// Default wait until next retry in millis.
const TX_STATUS_RETRY_WAIT = 500;
// Exponential back off for waiting to retry.
const TX_STATUS_RETRY_WAIT_BACKOFF = 1.5;
// Sleep given number of millis.
function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
class Account {
    constructor(connection, accountId) {
        this.connection = connection;
        this.accountId = accountId;
    }
    get ready() {
        return this._ready || (this._ready = Promise.resolve(this.fetchState()));
    }
    async fetchState() {
        this._accessKey = null;
        this._state = await this.connection.provider.query(`account/${this.accountId}`, '');
        const publicKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
        if (!publicKey) {
            return;
        }
        this._accessKey = await this.connection.provider.query(`access_key/${this.accountId}/${publicKey.toString()}`, '');
        if (!this._accessKey) {
            throw new Error(`Failed to fetch access key for '${this.accountId}' with public key ${publicKey.toString()}`);
        }
    }
    async state() {
        await this.ready;
        return this._state;
    }
    printLogs(contractId, logs) {
        for (const log of logs) {
            console.log(`[${contractId}]: ${log}`);
        }
    }
    async retryTxResult(txHash, accountId) {
        let result;
        let waitTime = TX_STATUS_RETRY_WAIT;
        for (let i = 0; i < TX_STATUS_RETRY_NUMBER; i++) {
            result = await this.connection.provider.txStatus(txHash, accountId);
            if (typeof result.status === 'object' &&
                (typeof result.status.SuccessValue === 'string' || typeof result.status.Failure === 'object')) {
                return result;
            }
            await sleep(waitTime);
            waitTime *= TX_STATUS_RETRY_WAIT_BACKOFF;
            i++;
        }
        throw new providers_1.TypedError(`Exceeded ${TX_STATUS_RETRY_NUMBER} status check attempts for transaction ${serialize_1.base_encode(txHash)}.`, 'RetriesExceeded');
    }
    async signAndSendTransaction(receiverId, actions) {
        await this.ready;
        if (!this._accessKey) {
            throw new providers_1.TypedError(`Can not sign transactions, no matching key pair found in Signer.`, 'KeyNotFound');
        }
        const status = await this.connection.provider.status();
        const [txHash, signedTx] = await transaction_1.signTransaction(receiverId, ++this._accessKey.nonce, actions, serialize_1.base_decode(status.sync_info.latest_block_hash), this.connection.signer, this.accountId, this.connection.networkId);
        let result;
        try {
            result = await this.connection.provider.sendTransaction(signedTx);
        }
        catch (error) {
            if (error.type === 'TimeoutError') {
                result = await this.retryTxResult(txHash, this.accountId);
            }
            else {
                throw error;
            }
        }
        const flatLogs = [result.transaction_outcome, ...result.receipts_outcome].reduce((acc, it) => acc.concat(it.outcome.logs), []);
        this.printLogs(signedTx.transaction.receiverId, flatLogs);
        if (typeof result.status === 'object' && typeof result.status.Failure === 'object') {
            if (result.status.Failure.error_message && result.status.Failure.error_type) {
                throw new providers_1.TypedError(`Transaction ${result.transaction_outcome.id} failed. ${result.status.Failure.error_message}`, result.status.Failure.error_type);
            }
            else {
                const typedError = rpc_errors_1.parseIntoOldTypedError(result.status.Failure);
                throw new providers_1.TypedError(`Transaction ${result.transaction_outcome.id} failed. ${typedError.message}`, '');
            }
        }
        // TODO: if Tx is Unknown or Started.
        // TODO: deal with timeout on node side.
        return result;
    }
    async createAndDeployContract(contractId, publicKey, data, amount) {
        const accessKey = transaction_1.fullAccessKey();
        await this.signAndSendTransaction(contractId, [transaction_1.createAccount(), transaction_1.transfer(amount), transaction_1.addKey(key_pair_1.PublicKey.from(publicKey), accessKey), transaction_1.deployContract(data)]);
        const contractAccount = new Account(this.connection, contractId);
        return contractAccount;
    }
    async sendMoney(receiverId, amount) {
        return this.signAndSendTransaction(receiverId, [transaction_1.transfer(amount)]);
    }
    async createAccount(newAccountId, publicKey, amount) {
        const accessKey = transaction_1.fullAccessKey();
        return this.signAndSendTransaction(newAccountId, [transaction_1.createAccount(), transaction_1.transfer(amount), transaction_1.addKey(key_pair_1.PublicKey.from(publicKey), accessKey)]);
    }
    async deleteAccount(beneficiaryId) {
        return this.signAndSendTransaction(this.accountId, [transaction_1.deleteAccount(beneficiaryId)]);
    }
    async deployContract(data) {
        return this.signAndSendTransaction(this.accountId, [transaction_1.deployContract(data)]);
    }
    async functionCall(contractId, methodName, args, gas, amount) {
        args = args || {};
        this.validateArgs(args);
        return this.signAndSendTransaction(contractId, [transaction_1.functionCall(methodName, Buffer.from(JSON.stringify(args)), gas || DEFAULT_FUNC_CALL_AMOUNT, amount)]);
    }
    // TODO: expand this API to support more options.
    async addKey(publicKey, contractId, methodName, amount) {
        let accessKey;
        if (contractId === null || contractId === undefined || contractId === '') {
            accessKey = transaction_1.fullAccessKey();
        }
        else {
            accessKey = transaction_1.functionCallAccessKey(contractId, !methodName ? [] : [methodName], amount);
        }
        return this.signAndSendTransaction(this.accountId, [transaction_1.addKey(key_pair_1.PublicKey.from(publicKey), accessKey)]);
    }
    async deleteKey(publicKey) {
        return this.signAndSendTransaction(this.accountId, [transaction_1.deleteKey(key_pair_1.PublicKey.from(publicKey))]);
    }
    async stake(publicKey, amount) {
        return this.signAndSendTransaction(this.accountId, [transaction_1.stake(amount, key_pair_1.PublicKey.from(publicKey))]);
    }
    validateArgs(args) {
        if (Array.isArray(args) || typeof args !== 'object') {
            throw new errors_1.PositionalArgsError();
        }
    }
    async viewFunction(contractId, methodName, args) {
        args = args || {};
        this.validateArgs(args);
        const result = await this.connection.provider.query(`call/${contractId}/${methodName}`, serialize_1.base_encode(JSON.stringify(args)));
        if (result.logs) {
            this.printLogs(contractId, result.logs);
        }
        return result.result && result.result.length > 0 && JSON.parse(Buffer.from(result.result).toString());
    }
    /// Returns array of {access_key: AccessKey, public_key: PublicKey} items.
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
}
exports.Account = Account;
