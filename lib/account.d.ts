import BN from 'bn.js';
import { FinalTransactionResult } from './providers/provider';
import { Connection } from './connection';
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
    private _access_key;
    private _ready;
    protected readonly ready: Promise<void>;
    constructor(connection: Connection, accountId: string);
    fetchState(): Promise<void>;
    state(): Promise<AccountState>;
    private printLogs;
    private retryTxResult;
    private signAndSendTransaction;
    createAndDeployContract(contractId: string, publicKey: string, data: Uint8Array, amount: BN): Promise<Account>;
    sendMoney(receiverId: string, amount: BN): Promise<FinalTransactionResult>;
    createAccount(newAccountId: string, publicKey: string, amount: BN): Promise<FinalTransactionResult>;
    deployContract(data: Uint8Array): Promise<FinalTransactionResult>;
    functionCall(contractId: string, methodName: string, args: any, gas: number, amount?: BN): Promise<FinalTransactionResult>;
    addKey(publicKey: string, contractId?: string, methodName?: string, balanceOwner?: string, amount?: BN): Promise<FinalTransactionResult>;
    deleteKey(publicKey: string): Promise<FinalTransactionResult>;
    stake(publicKey: string, amount: BN): Promise<FinalTransactionResult>;
    viewFunction(contractId: string, methodName: string, args: any): Promise<any>;
    getAccountDetails(): Promise<any>;
}
