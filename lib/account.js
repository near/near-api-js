'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("./transaction");
const provider_1 = require("./providers/provider");
const serialize_1 = require("./utils/serialize");
// Default amount of tokens to be send with the function calls. Used to pay for the fees
// incurred while running the contract execution. The unused amount will be refunded back to
// the originator.
const DEFAULT_FUNC_CALL_AMOUNT = 1000000;
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
    get ready() {
        return this._ready || (this._ready = Promise.resolve(this.fetchState()));
    }
    constructor(connection, accountId) {
        this.connection = connection;
        this.accountId = accountId;
    }
    async fetchState() {
        this._state = await this.connection.provider.query(`account/${this.accountId}`, '');
        try {
            const publicKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
            this._accessKey = await this.connection.provider.query(`access_key/${this.accountId}/${publicKey}`, '');
        }
        catch {
            this._accessKey = null;
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
    async retryTxResult(txHash) {
        let result;
        let waitTime = TX_STATUS_RETRY_WAIT;
        for (let i = 0; i < TX_STATUS_RETRY_NUMBER; i++) {
            result = await this.connection.provider.txStatus(txHash);
            if (result.status === 'Failed' || result.status === 'Completed') {
                return result;
            }
            await sleep(waitTime);
            waitTime *= TX_STATUS_RETRY_WAIT_BACKOFF;
            i++;
        }
        throw new Error(`Exceeded ${TX_STATUS_RETRY_NUMBER} status check attempts for transaction ${serialize_1.base_encode(txHash)}.`);
    }
    async signAndSendTransaction(receiverId, actions) {
        await this.ready;
        if (this._accessKey === null) {
            throw new Error(`Can not sign transactions, initialize account with available public key in Signer.`);
        }
        const [txHash, signedTx] = await transaction_1.signTransaction(receiverId, ++this._accessKey.nonce, actions, this.connection.signer, this.accountId, this.connection.networkId);
        let result;
        try {
            result = await this.connection.provider.sendTransaction(signedTx);
        }
        catch (error) {
            if (error.message === '[-32000] Server error: send_tx_commit has timed out.') {
                result = await this.retryTxResult(txHash);
            }
            else {
                throw error;
            }
        }
        const flatLogs = result.transactions.reduce((acc, it) => acc.concat(it.result.logs), []);
        this.printLogs(signedTx.transaction.receiverId, flatLogs);
        if (result.status === provider_1.FinalTransactionStatus.Failed) {
            if (flatLogs) {
                const errorMessage = flatLogs.find(it => it.startsWith('ABORT:')) || flatLogs.find(it => it.startsWith('Runtime error:')) || '';
                throw new Error(`Transaction ${result.transactions[0].hash} failed. ${errorMessage}`);
            }
        }
        // TODO: if Tx is Unknown or Started.
        // TODO: deal with timeout on node side.
        return result;
    }
    async createAndDeployContract(contractId, publicKey, data, amount) {
        await this.createAccount(contractId, publicKey, amount);
        const contractAccount = new Account(this.connection, contractId);
        await contractAccount.ready;
        await contractAccount.deployContract(data);
        return contractAccount;
    }
    async sendMoney(receiverId, amount) {
        return this.signAndSendTransaction(receiverId, [transaction_1.transfer(amount)]);
    }
    async createAccount(newAccountId, publicKey, amount) {
        const accessKey = transaction_1.fullAccessKey();
        return this.signAndSendTransaction(newAccountId, [transaction_1.createAccount(), transaction_1.transfer(amount), transaction_1.addKey(publicKey, accessKey)]);
    }
    async deployContract(data) {
        return this.signAndSendTransaction(this.accountId, [transaction_1.deployContract(data)]);
    }
    async functionCall(contractId, methodName, args, gas, amount) {
        if (!args) {
            args = {};
        }
        return this.signAndSendTransaction(contractId, [transaction_1.functionCall(methodName, Buffer.from(JSON.stringify(args)), gas || DEFAULT_FUNC_CALL_AMOUNT, amount)]);
    }
    // TODO: expand this API to support more options.
    async addKey(publicKey, contractId, methodName, amount) {
        let accessKey;
        if (contractId === null || contractId === undefined) {
            accessKey = transaction_1.fullAccessKey();
        }
        else {
            accessKey = transaction_1.functionCallAccessKey(contractId, !methodName ? [] : [methodName], amount);
        }
        return this.signAndSendTransaction(this.accountId, [transaction_1.addKey(publicKey, accessKey)]);
    }
    async deleteKey(publicKey) {
        return this.signAndSendTransaction(this.accountId, [transaction_1.deleteKey(publicKey)]);
    }
    async stake(publicKey, amount) {
        return this.signAndSendTransaction(this.accountId, [transaction_1.stake(amount, publicKey)]);
    }
    async viewFunction(contractId, methodName, args) {
        const result = await this.connection.provider.query(`call/${contractId}/${methodName}`, serialize_1.base_encode(JSON.stringify(args)));
        if (result.logs) {
            this.printLogs(contractId, result.logs);
        }
        return JSON.parse(Buffer.from(result.result).toString());
    }
    /// Returns array of {access_key: AccessKey, public_key: PublicKey} items.
    async getAccessKeys() {
        const response = await this.connection.provider.query(`access_key/${this.accountId}`, '');
        return response;
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
                    publicKey: item.public_key.data,
                });
            }
        });
        return result;
    }
}
exports.Account = Account;
