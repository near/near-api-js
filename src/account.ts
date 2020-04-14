'use strict';

import BN from 'bn.js';
import { Action, transfer, createAccount, signTransaction, deployContract,
    addKey, functionCall, fullAccessKey, functionCallAccessKey, deleteKey, stake, AccessKey, deleteAccount } from './transaction';
import { FinalExecutionOutcome, TypedError } from './providers';
import { Connection } from './connection';
import {base_decode, base_encode} from './utils/serialize';
import { PublicKey } from './utils/key_pair';
import { PositionalArgsError } from './utils/errors';
import { parseRpcError } from './utils/rpc_errors';

// Default amount of gas to be sent with the function calls. Used to pay for the fees
// incurred while running the contract execution. The unused amount will be refunded back to
// the originator.
// Default value is set to equal to max_prepaid_gas as discussed here:
// https://github.com/near/near-api-js/pull/191#discussion_r369671912
const DEFAULT_FUNC_CALL_GAS = new BN('10000000000000000');

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

/**
 * More information on [the Account spec](https://nomicon.io/DataStructures/Account.html)
 */
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

    /**
     * Helper function when getting the state of a NEAR account
     * @returns Promise<void>
     */
    async fetchState(): Promise<void> {
        this._state = await this.connection.provider.query(`account/${this.accountId}`, '');
    }

    /**
     * Returns the state of a NEAR account
     * @returns {Promise<AccountState>}
     */
    async state(): Promise<AccountState> {
        await this.ready;
        return this._state;
    }

    private printLogs(contractId: string, logs: string[]) {
        for (const log of logs) {
            console.log(`[${contractId}]: ${log}`);
        }
    }

    /**
     * @param txHash The transaction hash to retry
     * @param accountId The NEAR account sending the transaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    private async retryTxResult(txHash: Uint8Array, accountId: string): Promise<FinalExecutionOutcome> {
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
        throw new TypedError(`Exceeded ${TX_STATUS_RETRY_NUMBER} status check attempts for transaction ${base_encode(txHash)}.`, 'RetriesExceeded');
    }

    /**
     * @param receiverId NEAR account receiving the transaction
     * @param actions The transaction [Action as described in the spec](https://nomicon.io/RuntimeSpec/Actions.html).
     * @returns {Promise<FinalExecutionOutcome>}
     */
    protected async signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome> {
        await this.ready;

        // TODO: Find matching access key based on transaction
        const accessKey = await this.findAccessKey();
        if (!accessKey) {
            throw new TypedError(`Can not sign transactions for account ${this.accountId}, no matching key pair found in Signer.`, 'KeyNotFound');
        }

        const status = await this.connection.provider.status();

        const [txHash, signedTx] = await signTransaction(
            receiverId, ++accessKey.nonce, actions, base_decode(status.sync_info.latest_block_hash), this.connection.signer, this.accountId, this.connection.networkId
        );

        let result;
        try {
            result = await this.connection.provider.sendTransaction(signedTx);
        } catch (error) {
            if (error.type === 'TimeoutError') {
                result = await this.retryTxResult(txHash, this.accountId);
            } else {
                throw error;
            }
        }

        const flatLogs = [result.transaction_outcome, ...result.receipts_outcome].reduce((acc, it) => acc.concat(it.outcome.logs), []);
        this.printLogs(signedTx.transaction.receiverId, flatLogs);

        if (typeof result.status === 'object' && typeof result.status.Failure === 'object') {
            // if error data has error_message and error_type properties, we consider that node returned an error in the old format
            if (result.status.Failure.error_message && result.status.Failure.error_type) {
                throw new TypedError(
                    `Transaction ${result.transaction_outcome.id} failed. ${result.status.Failure.error_message}`,
                    result.status.Failure.error_type);
            } else {
                throw parseRpcError(result.status.Failure);
            }
        }
        // TODO: if Tx is Unknown or Started.
        // TODO: deal with timeout on node side.
        return result;
    }

    private async findAccessKey(): Promise<AccessKey> {
        const publicKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
        if (!publicKey) {
            return null;
        }

        // TODO: Cache keys and handle nonce errors automatically

        try {
            return await this.connection.provider.query(`access_key/${this.accountId}/${publicKey.toString()}`, '');
        } catch (e) {
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
    async createAndDeployContract(contractId: string, publicKey: string | PublicKey, data: Uint8Array, amount: BN): Promise<Account> {
        const accessKey = fullAccessKey();
        await this.signAndSendTransaction(contractId, [createAccount(), transfer(amount), addKey(PublicKey.from(publicKey), accessKey), deployContract(data)]);
        const contractAccount = new Account(this.connection, contractId);
        return contractAccount;
    }

    /**
     * @param receiverId NEAR account receiving Ⓝ
     * @param amount Amount to send in yoctoⓃ
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async sendMoney(receiverId: string, amount: BN): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction(receiverId, [transfer(amount)]);
    }

    /**
     * @param newAccountId NEAR account name to be created
     * @param publicKey A public key created from the masterAccount
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async createAccount(newAccountId: string, publicKey: string | PublicKey, amount: BN): Promise<FinalExecutionOutcome> {
        const accessKey = fullAccessKey();
        return this.signAndSendTransaction(newAccountId, [createAccount(), transfer(amount), addKey(PublicKey.from(publicKey), accessKey)]);
    }

    /**
     * @param beneficiaryId The NEAR account that will receive the remaining Ⓝ balance from the account being deleted
     * @returns void
     */
    async deleteAccount(beneficiaryId: string) {
        return this.signAndSendTransaction(this.accountId, [deleteAccount(beneficiaryId)]);
    }

    /**
     * @param data The compiled contract code
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async deployContract(data: Uint8Array): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction(this.accountId, [deployContract(data)]);
    }

    /**
     * @param contractId NEAR account where the contract is deployed
     * @param methodName The method name on the contract as it is written in the contract code
     * @param args Any arguments to the contract method, wrapped in JSON
     * @param data The compiled contract code
     * @param gas An amount of yoctoⓃ attached to cover the gas cost of this function call
     * @param amount Payment in yoctoⓃ that is sent to the contract during this function call
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async functionCall(contractId: string, methodName: string, args: any, gas?: BN, amount?: BN): Promise<FinalExecutionOutcome> {
        args = args || {};
        this.validateArgs(args);
        return this.signAndSendTransaction(contractId, [functionCall(methodName, Buffer.from(JSON.stringify(args)), gas || DEFAULT_FUNC_CALL_GAS, amount)]);
    }

    /**
     * @param publicKey A public key to be associated with the contract
     * @param contractId NEAR account where the contract is deployed
     * @param methodName The method name on the contract as it is written in the contract code
     * @param amount Payment in yoctoⓃ that is sent to the contract during this function call
     * @returns {Promise<FinalExecutionOutcome>}
     * TODO: expand this API to support more options.
     */
    async addKey(publicKey: string | PublicKey, contractId?: string, methodName?: string, amount?: BN): Promise<FinalExecutionOutcome> {
        let accessKey;
        if (contractId === null || contractId === undefined || contractId === '') {
            accessKey = fullAccessKey();
        } else {
            accessKey = functionCallAccessKey(contractId, !methodName ? [] : [methodName], amount);
        }
        return this.signAndSendTransaction(this.accountId, [addKey(PublicKey.from(publicKey), accessKey)]);
    }

    /**
     * @param publicKey The public key to be deleted
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async deleteKey(publicKey: string | PublicKey): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction(this.accountId, [deleteKey(PublicKey.from(publicKey))]);
    }

    /**
     * @param publicKey The public key for the account that's staking
     * @param amount The account to stake in yoctoⓃ
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async stake(publicKey: string | PublicKey, amount: BN): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction(this.accountId, [stake(amount, PublicKey.from(publicKey))]);
    }

    private validateArgs(args: any) {
        if (Array.isArray(args) || typeof args !== 'object') {
            throw new PositionalArgsError();
        }
    }

    /**
     * @param contractId NEAR account where the contract is deployed
     * @param methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
     * @param args Any arguments to the view contract method, wrapped in JSON
     * @returns {Promise<any>}
     */
    async viewFunction(contractId: string, methodName: string, args: any): Promise<any> {
        args = args || {};
        this.validateArgs(args);
        const result = await this.connection.provider.query(`call/${contractId}/${methodName}`, base_encode(JSON.stringify(args)));
        if (result.logs) {
            this.printLogs(contractId, result.logs);
        }
        return result.result && result.result.length > 0 && JSON.parse(Buffer.from(result.result).toString());
    }

    /**
     * @returns array of {access_key: AccessKey, public_key: PublicKey} items.
     */
    async getAccessKeys(): Promise<any> {
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
