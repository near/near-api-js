'use strict';

import BN from 'bn.js';
import { Action, transfer, createAccount, signTransaction, deployContract,
    addKey, functionCall, fullAccessKey, functionCallAccessKey, deleteKey, stake, AccessKey } from './transaction';
import { FinalTransactionResult, FinalTransactionStatus } from './providers/provider';
import { Connection } from './connection';
import {base_decode, base_encode} from './utils/serialize';
import { PublicKey } from './utils/key_pair';

// Default amount of tokens to be send with the function calls. Used to pay for the fees
// incurred while running the contract execution. The unused amount will be refunded back to
// the originator.
const DEFAULT_FUNC_CALL_AMOUNT = 2000000;

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
    amount: string;
    staked: string;
    code_hash: string;
}

export class Account {
    readonly connection: Connection;
    readonly accountId: string;
    private _state: AccountState;
    private _accessKey: AccessKey;

    private _ready: Promise<void>;
    protected get ready(): Promise<void> {
        return this._ready || (this._ready = Promise.resolve(this.fetchState()));
    }

    constructor(connection: Connection, accountId: string) {
        this.connection = connection;
        this.accountId = accountId;
    }

    async fetchState(): Promise<void> {
        this._state = await this.connection.provider.query(`account/${this.accountId}`, '');
        try {
            const publicKey = (await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId)).toString();
            this._accessKey = await this.connection.provider.query(`access_key/${this.accountId}/${publicKey}`, '');
            if (this._accessKey === null) {
                throw new Error(`Failed to fetch access key for '${this.accountId}' with public key ${publicKey}`);
            }
        } catch {
            this._accessKey = null;
        }
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

    private async signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalTransactionResult> {
        await this.ready;
        if (this._accessKey === null) {
            throw new Error(`Can not sign transactions, initialize account with available public key in Signer.`);
        }

        const status = await this.connection.provider.status();

        const [txHash, signedTx] = await signTransaction(
            receiverId, ++this._accessKey.nonce, actions, base_decode(status.sync_info.latest_block_hash), this.connection.signer, this.accountId, this.connection.networkId
        );

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

        const flatLogs = result.transactions.reduce((acc, it) => acc.concat(it.result.logs), []);
        this.printLogs(signedTx.transaction.receiverId, flatLogs);

        if (result.status === FinalTransactionStatus.Failed) {
            if (flatLogs) {
                const errorMessage = flatLogs.find(it => it.startsWith('ABORT:')) || flatLogs.find(it => it.startsWith('Runtime error:')) || '';
                throw new Error(`Transaction ${result.transactions[0].hash} failed. ${errorMessage}`);
            }
        }
        // TODO: if Tx is Unknown or Started.
        // TODO: deal with timeout on node side.
        return result;
    }

    async createAndDeployContract(contractId: string, publicKey: string | PublicKey, data: Uint8Array, amount: BN): Promise<Account> {
        const accessKey = fullAccessKey();
        await this.signAndSendTransaction(contractId, [createAccount(), transfer(amount), addKey(PublicKey.from(publicKey), accessKey), deployContract(data)]);
        const contractAccount = new Account(this.connection, contractId);
        return contractAccount;
    }

    async sendMoney(receiverId: string, amount: BN): Promise<FinalTransactionResult> {
        return this.signAndSendTransaction(receiverId, [transfer(amount)]);
    }

    async createAccount(newAccountId: string, publicKey: string | PublicKey, amount: BN): Promise<FinalTransactionResult> {
        const accessKey = fullAccessKey();
        return this.signAndSendTransaction(newAccountId, [createAccount(), transfer(amount), addKey(PublicKey.from(publicKey), accessKey)]);
    }

    async deployContract(data: Uint8Array): Promise<FinalTransactionResult> {
        return this.signAndSendTransaction(this.accountId, [deployContract(data)]);
    }

    async functionCall(contractId: string, methodName: string, args: any, gas: number, amount?: BN): Promise<FinalTransactionResult> {
        if (!args) {
            args = {};
        }
        return this.signAndSendTransaction(contractId, [functionCall(methodName, Buffer.from(JSON.stringify(args)), gas || DEFAULT_FUNC_CALL_AMOUNT, amount)]);
    }

    // TODO: expand this API to support more options.
    async addKey(publicKey: string | PublicKey, contractId?: string, methodName?: string, amount?: BN): Promise<FinalTransactionResult> {
        let accessKey;
        if (contractId === null || contractId === undefined || contractId === '') {
            accessKey = fullAccessKey();
        } else {
            accessKey = functionCallAccessKey(contractId, !methodName ? [] : [methodName], amount);
        }
        return this.signAndSendTransaction(this.accountId, [addKey(PublicKey.from(publicKey), accessKey)]);
    }

    async deleteKey(publicKey: string | PublicKey): Promise<FinalTransactionResult> {
        return this.signAndSendTransaction(this.accountId, [deleteKey(PublicKey.from(publicKey))]);
    }

    async stake(publicKey: string | PublicKey, amount: BN): Promise<FinalTransactionResult> {
        return this.signAndSendTransaction(this.accountId, [stake(amount, PublicKey.from(publicKey))]);
    }

    async viewFunction(contractId: string, methodName: string, args: any): Promise<any> {
        const result = await this.connection.provider.query(`call/${contractId}/${methodName}`, base_encode(JSON.stringify(args)));
        if (result.logs) {
            this.printLogs(contractId, result.logs);
        }
        return JSON.parse(Buffer.from(result.result).toString());
    }

    /// Returns array of {access_key: AccessKey, public_key: PublicKey} items.
    async getAccessKeys(): Promise<any> {
        const response = await this.connection.provider.query(`access_key/${this.accountId}`, '');
        return response;
    }

    async getAccountDetails(): Promise<any> {
        // TODO: update the response value to return all the different keys, not just app keys.
        // Also if we need this function, or getAccessKeys is good enough.
        const accessKeys = await this.getAccessKeys();
        const result: any = { authorizedApps: [], transactions: [] };
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
