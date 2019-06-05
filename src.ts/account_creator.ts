import { Connection } from './connection';
import { Account } from './account';
import { ConnectionInfo } from './utils/web';

/**
 * Account creator provides interface to specific implementation to acutally create account.
 */
export abstract class AccountCreator {
    abstract async createAccount(newAccountId: string, publicKey: string): Promise<void>;
}

export class LocalAccountCreator {
    readonly masterAccount: Account;

    constructor(masterAccount: Account) {
        this.masterAccount = masterAccount;
    }

    async createAccount(newAccountId: string, publicKey: string): Promise<void> {
        await this.masterAccount.createAccount(newAccountId, publicKey, BigInt(1000 * 1000 * 1000 * 1000));
        // TODO: check the response here for status and raise if didn't complete.
    }
}

export class UrlAccountCreator {
    readonly connection: Connection;
    readonly helperConnection: ConnectionInfo;

    constructor(connection: Connection, helperUrl: string) {
        this.connection = connection;
        this.helperConnection = { url: helperUrl };
    }

    async createAccount(newAccountId: string, publicKey: string): Promise<void> {
        // TODO: hit url to create account.
    }
}
