import BN from 'bn.js';
import { Connection } from './connection';
import { Account } from './account';
import { ConnectionInfo } from './utils/web';

/**
 * Account creator provides interface to specific implementation to acutally create account.
 */
export abstract class AccountCreator {
    abstract async createAccount(newAccountId: string, publicKey: string): Promise<void>;
}

export class LocalAccountCreator extends AccountCreator {
    readonly masterAccount: Account;
    readonly initialBalance: BN;

    constructor(masterAccount: Account, initialBalance: BN) {
        super();
        this.masterAccount = masterAccount;
        this.initialBalance = initialBalance;
    }

    async createAccount(newAccountId: string, publicKey: string): Promise<void> {
        await this.masterAccount.createAccount(newAccountId, publicKey, this.initialBalance);
        // TODO: check the response here for status and raise if didn't complete.
    }
}

export class UrlAccountCreator extends AccountCreator {
    readonly connection: Connection;
    readonly helperConnection: ConnectionInfo;

    constructor(connection: Connection, helperUrl: string) {
        super();
        this.connection = connection;
        this.helperConnection = { url: helperUrl };
    }

    async createAccount(newAccountId: string, publicKey: string): Promise<void> {
        // TODO: hit url to create account.
    }
}
