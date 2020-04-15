import BN from 'bn.js';
import { Action } from './transaction';
import { FinalExecutionOutcome } from './providers';
import { Connection } from './connection';
import { PublicKey } from './utils/key_pair';
export interface AccountState {
    account_id: string;
    amount: string;
    staked: string;
    code_hash: string;
}
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
    private printLogs;
    /**
     * @param txHash The transaction hash to retry
     * @param accountId The NEAR account sending the transaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    private retryTxResult;
    /**
     * @param receiverId NEAR account receiving the transaction
     * @param actions The transaction [Action as described in the spec](https://nomicon.io/RuntimeSpec/Actions.html).
     * @returns {Promise<FinalExecutionOutcome>}
     */
    protected signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>;
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
     * @param args Any arguments to the contract method, wrapped in JSON
     * @param data The compiled contract code
     * @param gas An amount of yoctoⓃ attached to cover the gas cost of this function call
     * @param amount Payment in yoctoⓃ that is sent to the contract during this function call
     * @returns {Promise<FinalExecutionOutcome>}
     */
    functionCall(contractId: string, methodName: string, args: any, gas?: BN, amount?: BN): Promise<FinalExecutionOutcome>;
    /**
     * @param publicKey A public key to be associated with the contract
     * @param contractId NEAR account where the contract is deployed
     * @param methodName The method name on the contract as it is written in the contract code
     * @param amount Payment in yoctoⓃ that is sent to the contract during this function call
     * @returns {Promise<FinalExecutionOutcome>}
     * TODO: expand this API to support more options.
     */
    addKey(publicKey: string | PublicKey, contractId?: string, methodName?: string, amount?: BN): Promise<FinalExecutionOutcome>;
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
    viewFunction(contractId: string, methodName: string, args: any): Promise<any>;
    /**
     * @returns array of {access_key: AccessKey, public_key: PublicKey} items.
     */
    getAccessKeys(): Promise<any>;
    /**
     * Returns account details in terms of authorized apps and transactions
     * @returns {Promise<any>}
     */
    getAccountDetails(): Promise<any>;
}
