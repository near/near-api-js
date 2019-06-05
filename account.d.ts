import { FinalTransactionResult } from './providers/provider';
import { Connection } from './connection';
import { ConnectionInfo } from './utils/web';
export declare class Account {
    readonly connection: Connection;
    readonly accountId: string;
    constructor(connection: Connection, accountId: string);
    private signTransaction;
    sendMoney(nonce: number, receiver: string, amount: bigint): Promise<FinalTransactionResult>;
    createAccount(newAccountId: string, publicKey: string, amount: bigint): Promise<FinalTransactionResult>;
}
/**
 * Account creator provides interface to specific implementation to acutally create account.
 */
export declare abstract class AccountCreator {
    abstract createAccount(newAccountId: string): Promise<Account>;
}
export declare class LocalAccountCreator {
    readonly connection: Connection;
    readonly masterAccount: Account;
    constructor(connection: Connection, masterAccount: Account);
    createAccount(newAccountId: string, publicKey: string): Promise<Account>;
}
export declare class UrlAccountCreator {
    readonly connection: Connection;
    readonly helperConnection: ConnectionInfo;
    constructor(connection: Connection, helperUrl: string);
    createAccount(newAccountId: string, publicKey: string): Promise<Account>;
}
