import { FinalTransactionResult } from './providers/provider';
import { Connection } from './connection';
export interface AccountState {
    account_id: string;
    nonce: number;
    amount: bigint;
    stake: bigint;
    public_keys: Uint8Array[];
    code_hash: string;
}
export declare class Account {
    readonly connection: Connection;
    readonly accountId: string;
    private _state;
    private _ready;
    protected readonly ready: Promise<void>;
    constructor(connection: Connection, accountId: string);
    fetchState(): Promise<void>;
    state(): Promise<AccountState>;
    private printLogs;
    private retryTxResult;
    private signAndSendTransaction;
    createAndDeployContract(contractId: string, publicKey: string, data: Uint8Array, amount: bigint): Promise<Account>;
    sendMoney(receiver: string, amount: bigint): Promise<FinalTransactionResult>;
    createAccount(newAccountId: string, publicKey: string, amount: bigint): Promise<FinalTransactionResult>;
    deployContract(data: Uint8Array): Promise<FinalTransactionResult>;
    functionCall(contractId: string, methodName: string, args: any): Promise<FinalTransactionResult>;
    addKey(publicKey: string, contractId?: string, methodName?: string, balanceOwner?: string, amount?: bigint): Promise<FinalTransactionResult>;
    deleteKey(publicKey: string): Promise<FinalTransactionResult>;
    stake(publicKey: string, amount: bigint): Promise<FinalTransactionResult>;
    viewFunction(contractId: string, methodName: string, args: any): Promise<any>;
    getAccountDetails(): Promise<any>;
}
