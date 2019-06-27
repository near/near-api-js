import { Connection } from './connection';
import { Account } from './account';
import { ConnectionInfo } from './utils/web';
/**
 * Account creator provides interface to specific implementation to acutally create account.
 */
export declare abstract class AccountCreator {
    abstract createAccount(newAccountId: string, publicKey: string): Promise<void>;
}
export declare class LocalAccountCreator extends AccountCreator {
    readonly masterAccount: Account;
    readonly initialBalance: bigint;
    constructor(masterAccount: Account, initialBalance: bigint);
    createAccount(newAccountId: string, publicKey: string): Promise<void>;
}
export declare class UrlAccountCreator extends AccountCreator {
    readonly connection: Connection;
    readonly helperConnection: ConnectionInfo;
    constructor(connection: Connection, helperUrl: string);
    createAccount(newAccountId: string, publicKey: string): Promise<void>;
}
