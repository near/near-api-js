import BN from 'bn.js';
import { Connection } from './connection';
import { Account } from './account';
import { PublicKey } from './utils/key_pair';
/**
 * Account creator provides interface to specific implementation to acutally create account.
 */
export declare abstract class AccountCreator {
    abstract createAccount(newAccountId: string, publicKey: PublicKey): Promise<void>;
}
export declare class LocalAccountCreator extends AccountCreator {
    readonly masterAccount: Account;
    readonly initialBalance: BN;
    constructor(masterAccount: Account, initialBalance: BN);
    createAccount(newAccountId: string, publicKey: PublicKey): Promise<void>;
}
export declare class UrlAccountCreator extends AccountCreator {
    readonly connection: Connection;
    readonly helperUrl: string;
    constructor(connection: Connection, helperUrl: string);
    createAccount(newAccountId: string, publicKey: PublicKey): Promise<void>;
}
