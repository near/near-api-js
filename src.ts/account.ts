'use strict';

import BN from 'bn.js';
import { sendMoney, createAccount, signTransaction, deployContract,
    addKey, functionCall, createAccessKey, deleteKey, stake } from './transaction';
import { FinalTransactionResult, FinalTransactionStatus } from './providers/provider';
import { Connection } from './connection';
import { base_encode } from './utils/serialize';

// Default amount of tokens to be send with the function calls. Used to pay for the fees
// incurred while running the contract execution. The unused amount will be refunded back to
// the originator.
const DEFAULT_FUNC_CALL_AMOUNT = new BN(1000000000);

// Default number of retries before giving up on a transactioin.
const TX_STATUS_RETRY_NUMBER = 10;

// Default wait until next retry in millis.
const TX_STATUS_RETRY_WAIT = 500;

// Exponential back off for waiting to retry.
const TX_STATUS_RETRY_WAIT_BACKOFF = 1.5;

// Sleep given number of millis.
function sleep(millis: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, millis));
}

export interface AccountState {
    account_id: string;
    nonce: number;
    amount: string;
    stake: string;
    public_keys: Uint8Array[];
    code_hash: string;
}

export class Account {
    readonly connection: Connection;
    readonly accountId: string;
    private _state: AccountState;

    private _ready: Promise<void>;
    protected get ready(): Promise<void> {
        return this._ready || (this._ready = Promise.resolve(this.fetchState()));
    }

    constructor(connection: Connection, accountId: string) {
        this.connection = connection;
        this.accountId = accountId;
    }

    async fetchState(): Promise<void> {
        const state = await this.connection.provider.query(`account/${this.accountId}`, '');
        this._state = state;
        this._state.amount = state.amount;
        this._state.stake = state.stake;
    }

    async state(): Promise<AccountState> {
        await this.ready;
        return this._state;
    }

    private printLogs(contractId: string, logs: string[]) {
        for (const log of logs) {
            console.log(`[${contractId}]: ${log}`);
        }
    }

    private async retryTxResult(txHash: Uint8Array): Promise<FinalTransactionResult> {
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
        throw new Error(`Exceeded ${TX_STATUS_RETRY_NUMBER} status check attempts for transaction ${base_encode(txHash)}.`);
    }

    private async signAndSendTransaction(transaction: any): Promise<FinalTransactionResult> {
        const [txHash, signedTx] = await signTransaction(
            this.connection.signer, transaction, this.accountId, this.connection.networkId);

        let result;
        try {
            result = await this.connection.provider.sendTransaction(signedTx);
        } catch (error) {
            if (error.message === '[-32000] Server error: send_tx_commit has timed out.') {
                result = await this.retryTxResult(txHash);
            } else {
                throw error;
            }
        }

        const flatLogs = result.logs.reduce((acc, it) => acc.concat(it.lines), []);
        if (transaction.hasOwnProperty('contractId')) {
            this.printLogs(transaction['contractId'], flatLogs);
        } else if (transaction.hasOwnProperty('originator')) {
            this.printLogs(transaction['originator'], flatLogs);
        }

        if (result.status === FinalTransactionStatus.Failed) {
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

    async createAndDeployContract(contractId: string, publicKey: string, data: Uint8Array, amount: BN): Promise<Account> {
        await this.createAccount(contractId, publicKey, amount);
        const contractAccount = new Account(this.connection, contractId);
        await contractAccount.ready;
        await contractAccount.deployContract(data);
        return contractAccount;
    }

    async sendMoney(receiver: string, amount: BN): Promise<FinalTransactionResult> {
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(sendMoney(this._state.nonce, this.accountId, receiver, amount));
    }

    async createAccount(newAccountId: string, publicKey: string, amount: BN): Promise<FinalTransactionResult> {
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(createAccount(this._state.nonce, this.accountId, newAccountId, publicKey, amount));
    }

    async deployContract(data: Uint8Array): Promise<FinalTransactionResult> {
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(deployContract(this._state.nonce, this.accountId, data));
    }

    async functionCall(contractId: string, methodName: string, args: any): Promise<FinalTransactionResult> {
        if (!args) {
            args = {};
        }
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(functionCall(this._state.nonce, this.accountId, contractId, methodName, Buffer.from(JSON.stringify(args)), DEFAULT_FUNC_CALL_AMOUNT));
    }

    async addKey(publicKey: string, contractId?: string, methodName?: string, balanceOwner?: string, amount?: BN): Promise<FinalTransactionResult> {
        await this.ready;
        this._state.nonce++;
        const accessKey = contractId ? createAccessKey(contractId, methodName, balanceOwner, amount) : null;
        return this.signAndSendTransaction(addKey(this._state.nonce, this.accountId, publicKey, accessKey));
    }

    async deleteKey(publicKey: string): Promise<FinalTransactionResult> {
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(deleteKey(this._state.nonce, this.accountId, publicKey));
    }

    async stake(publicKey: string, amount: BN): Promise<FinalTransactionResult> {
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(stake(this._state.nonce, this.accountId, amount, publicKey));
    }

    async viewFunction(contractId: string, methodName: string, args: any): Promise<any> {
        const result = await this.connection.provider.query(`call/${contractId}/${methodName}`, base_encode(JSON.stringify(args)));
        if (result.logs) {
            this.printLogs(contractId, result.logs);
        }
        return JSON.parse(Buffer.from(result.result).toString());
    }

    async getAccountDetails(): Promise<any> {
        const response = await this.connection.provider.query(`access_key/${this.accountId}`, '');
        const result: any = { authorizedApps: [], transactions: [] };
        Object.keys(response).forEach((key) => {
            result.authorizedApps.push({
                contractId: response[key][1].contract_id,
                amount: response[key][1].amount,
                publicKey: base_encode(response[key][0]),
            });
        });
        return result;
    }
}
