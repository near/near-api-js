/// <reference types="node" />
import BN from 'bn.js';
import { AccessKey, Action, SignedTransaction } from './transaction';
import { FinalExecutionOutcome } from './providers';
import { Finality, BlockId } from './providers/provider';
import { Connection } from './connection';
import { PublicKey } from './utils/key_pair';
export interface AccountState {
    amount: string;
    code_hash: string;
    storage_usage: number;
    locked: string;
}
export interface AccountBalance {
    total: string;
    stateStaked: string;
    staked: string;
    available: string;
}
declare function parseJsonFromRawResponse(response: Uint8Array): any;
/**
 * More information on [the Account spec](https://nomicon.io/DataStructures/Account.html)
 */
export declare class Account {
    readonly connection: Connection;
    readonly accountId: string;
    private _state;
    private _ready;
    protected get ready(): Promise<void>;
    constructor(connection: Connection, accountId: string);
    /**
     * Helper function when getting the state of a NEAR account
     * @returns Promise<void>
     */
    fetchState(): Promise<void>;
    /**
     * Returns the state of a NEAR account
     * @returns {Promise<AccountState>}
     */
    state(): Promise<AccountState>;
    private printLogsAndFailures;
    private printLogs;
    protected signTransaction(receiverId: string, actions: Action[]): Promise<[Uint8Array, SignedTransaction]>;
    /**
     * @param receiverId NEAR account receiving the transaction
     * @param actions The transaction [Action as described in the spec](https://nomicon.io/RuntimeSpec/Actions.html).
     * @returns {Promise<FinalExecutionOutcome>}
     */
    protected signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>;
    accessKeyByPublicKeyCache: {
        [key: string]: AccessKey;
    };
    private findAccessKey;
    /**
     * @param contractId NEAR account where the contract is deployed
     * @param publicKey The public key to add while signing and sending the transaction
     * @param data The compiled contract code
     * @returns {Promise<Account>}
     */
    createAndDeployContract(contractId: string, publicKey: string | PublicKey, data: Uint8Array, amount: BN): Promise<Account>;
    /**
     * @param receiverId NEAR account receiving Ⓝ
     * @param amount Amount to send in yoctoⓃ
     * @returns {Promise<FinalExecutionOutcome>}
     */
    sendMoney(receiverId: string, amount: BN): Promise<FinalExecutionOutcome>;
    /**
     * @param newAccountId NEAR account name to be created
     * @param publicKey A public key created from the masterAccount
     * @returns {Promise<FinalExecutionOutcome>}
     */
    createAccount(newAccountId: string, publicKey: string | PublicKey, amount: BN): Promise<FinalExecutionOutcome>;
    /**
     * @param beneficiaryId The NEAR account that will receive the remaining Ⓝ balance from the account being deleted
     * @returns void
     */
    deleteAccount(beneficiaryId: string): Promise<FinalExecutionOutcome>;
    /**
     * @param data The compiled contract code
     * @returns {Promise<FinalExecutionOutcome>}
     */
    deployContract(data: Uint8Array): Promise<FinalExecutionOutcome>;
    /**
     * @param contractId NEAR account where the contract is deployed
     * @param methodName The method name on the contract as it is written in the contract code
     * @param args arguments to pass to method. Can be either plain JS object which gets serialized as JSON automatically
     *  or `Uint8Array` instance which represents bytes passed as is.
     * @param gas max amount of gas that method call can use
      * @param deposit amount of NEAR (in yoctoNEAR) to send together with the call
     * @returns {Promise<FinalExecutionOutcome>}
     */
    functionCall(contractId: string, methodName: string, args: any, gas?: BN, amount?: BN): Promise<FinalExecutionOutcome>;
    /**
     * @param publicKey A public key to be associated with the contract
     * @param contractId NEAR account where the contract is deployed
     * @param methodNames The method names on the contract that should be allowed to be called. Pass null for no method names and '' or [] for any method names.
     * @param amount Payment in yoctoⓃ that is sent to the contract during this function call
     * @returns {Promise<FinalExecutionOutcome>}
     * TODO: expand this API to support more options.
     */
    addKey(publicKey: string | PublicKey, contractId?: string, methodNames?: string | string[], amount?: BN): Promise<FinalExecutionOutcome>;
    /**
     * @param publicKey The public key to be deleted
     * @returns {Promise<FinalExecutionOutcome>}
     */
    deleteKey(publicKey: string | PublicKey): Promise<FinalExecutionOutcome>;
    /**
     * @param publicKey The public key for the account that's staking
     * @param amount The account to stake in yoctoⓃ
     * @returns {Promise<FinalExecutionOutcome>}
     */
    stake(publicKey: string | PublicKey, amount: BN): Promise<FinalExecutionOutcome>;
    private validateArgs;
    /**
     * @param contractId NEAR account where the contract is deployed
     * @param methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
     * @param args Any arguments to the view contract method, wrapped in JSON
     * @returns {Promise<any>}
     */
    viewFunction(contractId: string, methodName: string, args: any, { parse }?: {
        parse?: typeof parseJsonFromRawResponse;
    }): Promise<any>;
    /**
     * See https://docs.near.org/docs/api/rpc#view-contract-state
     *
     * Returns the state (key value pairs) of this account's contract based on the key prefix.
     * Pass an empty string for prefix if you would like to return the entire state.
     *
     * @param prefix allows to filter which keys should be returned. Empty prefix means all keys. String prefix is utf-8 encoded.
     * @param blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
     */
    viewState(prefix: string | Uint8Array, blockQuery: {
        blockId: BlockId;
    } | {
        finality: Finality;
    }): Promise<Array<{
        key: Buffer;
        value: Buffer;
    }>>;
    /**
     * @returns array of {access_key: AccessKey, public_key: PublicKey} items.
     */
    getAccessKeys(): Promise<any>;
    /**
     * Returns account details in terms of authorized apps and transactions
     * @returns {Promise<any>}
     */
    getAccountDetails(): Promise<any>;
    /**
     * Returns calculated account balance
     * @returns {Promise<AccountBalance>}
     */
    getAccountBalance(): Promise<AccountBalance>;
}
export {};
