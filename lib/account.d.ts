import BN from 'bn.js';
import { FinalExecutionOutcome } from './providers';
import { Connection } from './connection';
import { PublicKey } from './utils/key_pair';
export interface AccountState {
    account_id: string;
    amount: string;
    staked: string;
    code_hash: string;
}
export declare class Account {
    readonly connection: Connection;
    readonly accountId: string;
    private _state;
    private _ready;
    protected get ready(): Promise<void>;
    constructor(connection: Connection, accountId: string);
    fetchState(): Promise<void>;
    state(): Promise<AccountState>;
    private printLogs;
    private retryTxResult;
    private signAndSendTransaction;
    private findAccessKey;
    createAndDeployContract(contractId: string, publicKey: string | PublicKey, data: Uint8Array, amount: BN): Promise<Account>;
    sendMoney(receiverId: string, amount: BN): Promise<FinalExecutionOutcome>;
    createAccount(newAccountId: string, publicKey: string | PublicKey, amount: BN): Promise<FinalExecutionOutcome>;
    deleteAccount(beneficiaryId: string): Promise<FinalExecutionOutcome>;
    deployContract(data: Uint8Array): Promise<FinalExecutionOutcome>;
    functionCall(contractId: string, methodName: string, args: any, gas: number, amount?: BN): Promise<FinalExecutionOutcome>;
    addKey(publicKey: string | PublicKey, contractId?: string, methodName?: string, amount?: BN): Promise<FinalExecutionOutcome>;
    deleteKey(publicKey: string | PublicKey): Promise<FinalExecutionOutcome>;
    stake(publicKey: string | PublicKey, amount: BN): Promise<FinalExecutionOutcome>;
    private validateArgs;
    viewFunction(contractId: string, methodName: string, args: any): Promise<any>;
    getAccessKeys(): Promise<any>;
    getAccountDetails(): Promise<any>;
}
