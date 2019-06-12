'use strict';

import { sendMoney, createAccount, signTransaction, deployContract,
    fromUint128, addKey, functionCall, createAccessKey, deleteKey, stake } from './transaction'
import { FinalTransactionResult, FinalTransactionStatus } from './providers/provider';
import { Connection } from './connection';
import { base_decode, base_encode } from './utils/serialize';

// Default amount of tokens to be send with the function calls. Used to pay for the fees
// incurred while running the contract execution. The unused amount will be refunded back to
// the originator.
const DEFAULT_FUNC_CALL_AMOUNT = BigInt(1000000000);

export type AccountState = {
    account_id: string,
    nonce: number,
    amount: bigint,
    stake: bigint,
    public_keys: Uint8Array[],
    code_hash: string,
};

export class Account {
    readonly connection: Connection;
    readonly accountId: string;
    private _state: AccountState;
    protected ready: Promise<void>;

    constructor(connection: Connection, accountId: string) {
        this.connection = connection;
        this.accountId = accountId;
        this.ready = Promise.resolve(this.fetchState());
    }

    async fetchState(): Promise<void> {
        const response = await this.connection.provider.query(`account/${this.accountId}`, '');
        const state = JSON.parse(base_decode(response.value).toString());
        this._state = state;
        this._state.amount = fromUint128(state.amount);
        this._state.stake = fromUint128(state.stake);
    }

    async state(): Promise<AccountState> {
        await this.ready;
        return this._state;
    }

    private printLogs(contractId: string, logs: string[]) {
        for (let i = 0; i < logs.length; ++i) {
            console.log(`[${contractId}]: ${logs[i]}`);
        }
    }

    private async signAndSendTransaction(transaction: any): Promise<FinalTransactionResult> {
        let signedTx = await signTransaction(
            this.connection.signer, transaction, this.accountId, this.connection.networkId);
        
        let result;
        try {
            result = await this.connection.provider.sendTransaction(signedTx);
        }
        catch (error) {
            if (error.message === '[-32000] Server error: send_tx_commit has timed out.') {
                // TODO: retry here few times via tx status RPC.
                throw new Error('Exceeded 1 status check attempt for getting transaction result.');
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

    async createAndDeployContract(contractId: string, publicKey: string, data: Uint8Array, amount: bigint): Promise<Account> {
        await this.createAccount(contractId, publicKey, amount);
        let contractAccount = new Account(this.connection, contractId);
        await contractAccount.ready;
        await contractAccount.deployContract(data);
        return contractAccount;
    }

    async sendMoney(receiver: string, amount: bigint): Promise<FinalTransactionResult> {
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(sendMoney(this._state.nonce, this.accountId, receiver, amount));
    }

    async createAccount(newAccountId: string, publicKey: string, amount: bigint): Promise<FinalTransactionResult> {
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

    async addKey(publicKey: string, contractId?: string, methodName?: string, balanceOwner?: string, amount?: bigint): Promise<FinalTransactionResult> {
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

    async stake(publicKey: string, amount: bigint): Promise<FinalTransactionResult> {
        await this.ready;
        this._state.nonce++;
        return this.signAndSendTransaction(stake(this._state.nonce, this.accountId, amount, publicKey));
    }

    async viewFunction(contractId: string, methodName: string, args: any): Promise<any> {
        let result = await this.connection.provider.query(`call/${contractId}/${methodName}`, base_encode(JSON.stringify(args)));
        if (!result.value) {
            throw new Error(`Function failed: ${result.info}\nFull result: ${JSON.stringify(result, null, 2)}`);
        }
        if (result.log) {
            this.printLogs(contractId, result.log.split('\n'));
        }
        return JSON.parse(base_decode(result.value).toString());
    }

    async getAccountDetails(): Promise<any> {
        const response = await this.connection.provider.query(`access_key/${this.accountId}`, '');
        const value = JSON.parse(base_decode(response.value).toString());
        const result: any = { authorizedApps: [], transactions: [] };
        Object.keys(value).forEach((key) => {
            result.authorizedApps.push({
                contractId: value[key][1].contract_id,
                amount: value[key][1].amount,
                publicKey: base_encode(value[key][0]),
            });
        });
        return result;
    }
}
