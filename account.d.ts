import { FinalTransactionResult } from './providers/provider';
import { Connection } from './connection';
export declare type AccountState = {
    account_id: string;
    nonce: number;
    amount: bigint;
    stake: bigint;
    public_keys: Uint8Array[];
    code_hash: string;
};
export declare class Account {
    readonly connection: Connection;
    readonly accountId: string;
    constructor(connection: Connection, accountId: string);
    private signTransaction;
    state(): Promise<AccountState>;
    sendMoney(nonce: number, receiver: string, amount: bigint): Promise<FinalTransactionResult>;
    createAccount(newAccountId: string, publicKey: string, amount: bigint): Promise<FinalTransactionResult>;
}
