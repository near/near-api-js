'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const transaction_1 = require("./transaction");
const provider_1 = require("./providers/provider");
const serialize_1 = require("./utils/serialize");
// Default amount of tokens to be send with the function calls. Used to pay for the fees
// incurred while running the contract execution. The unused amount will be refunded back to
// the originator.
const DEFAULT_FUNC_CALL_AMOUNT = new bn_js_1.default(1000000000);
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
        const state = await this.connection.provider.query(`account/${this.accountId}`, '');
        this._state = state;
        this._state.amount = state.amount;
        this._state.stake = state.stake;
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
    async signAndSendTransaction(transaction) {
        const [txHash, signedTx] = await transaction_1.signTransaction(this.connection.signer, transaction, this.accountId, this.connection.networkId);
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
        const flatLogs = result.logs.reduce((acc, it) => acc.concat(it.lines), []);
        if (transaction.hasOwnProperty('contractId')) {
            this.printLogs(transaction['contractId'], flatLogs);
        }
        else if (transaction.hasOwnProperty('originator')) {
            this.printLogs(transaction['originator'], flatLogs);
        }
        if (result.status === provider_1.FinalTransactionStatus.Failed) {
            if (result.logs) {
                console.warn(flatLogs);
                const errorMessage = flatLogs.find(it => it.startsWith('ABORT:')) || flatLogs.find(it => it.startsWith('Runtime error:')) || '';
                throw new Error(`Transaction ${result.logs[0].hash} failed. ${errorMessage}`);
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
    async sendMoney(receiver, amount) {
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(transaction_1.sendMoney(this._state.nonce, this.accountId, receiver, amount));
    }
    async createAccount(newAccountId, publicKey, amount) {
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(transaction_1.createAccount(this._state.nonce, this.accountId, newAccountId, publicKey, amount));
    }
    async deployContract(data) {
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(transaction_1.deployContract(this._state.nonce, this.accountId, data));
    }
    async functionCall(contractId, methodName, args) {
        if (!args) {
            args = {};
        }
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(transaction_1.functionCall(this._state.nonce, this.accountId, contractId, methodName, Buffer.from(JSON.stringify(args)), DEFAULT_FUNC_CALL_AMOUNT));
    }
    async addKey(publicKey, contractId, methodName, balanceOwner, amount) {
        await this.ready;
        this._state.nonce++;
        const accessKey = contractId ? transaction_1.createAccessKey(contractId, methodName, balanceOwner, amount) : null;
        return this.signAndSendTransaction(transaction_1.addKey(this._state.nonce, this.accountId, publicKey, accessKey));
    }
    async deleteKey(publicKey) {
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(transaction_1.deleteKey(this._state.nonce, this.accountId, publicKey));
    }
    async stake(publicKey, amount) {
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(transaction_1.stake(this._state.nonce, this.accountId, amount, publicKey));
    }
    async viewFunction(contractId, methodName, args) {
        const result = await this.connection.provider.query(`call/${contractId}/${methodName}`, serialize_1.base_encode(JSON.stringify(args)));
        if (result.logs) {
            this.printLogs(contractId, result.logs);
        }
        return JSON.parse(Buffer.from(result.result).toString());
    }
    async getAccountDetails() {
        const response = await this.connection.provider.query(`access_key/${this.accountId}`, '');
        const result = { authorizedApps: [], transactions: [] };
        Object.keys(response).forEach((key) => {
            result.authorizedApps.push({
                contractId: response[key][1].contract_id,
                amount: response[key][1].amount,
                publicKey: serialize_1.base_encode(response[key][0]),
            });
        });
        return result;
    }
}
exports.Account = Account;
