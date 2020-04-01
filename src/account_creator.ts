import BN from 'bn.js';
import { Connection } from './connection';
import { Account } from './account';
import { fetchJson } from './utils/web';
import { PublicKey } from './utils/key_pair';

/**
 * Account creator provides interface to specific implementation to acutally create account.
 */
export abstract class AccountCreator {
    abstract async createAccount(newAccountId: string, publicKey: PublicKey): Promise<void>;
}

export class LocalAccountCreator extends AccountCreator {
    readonly masterAccount: Account;
    readonly initialBalance: BN;

    constructor(masterAccount: Account, initialBalance: BN) {
        super();
        this.masterAccount = masterAccount;
        this.initialBalance = initialBalance;
    }

    async createAccount(newAccountId: string, publicKey: PublicKey): Promise<void> {
        await this.masterAccount.createAccount(newAccountId, publicKey, this.initialBalance);
    }
}

export class UrlAccountCreator extends AccountCreator {
    readonly connection: Connection;
    readonly helperUrl: string;

    constructor(connection: Connection, helperUrl: string) {
        super();
        this.connection = connection;
        this.helperUrl = helperUrl;
    }

    async createAccount(newAccountId: string, publicKey: PublicKey): Promise<void> {
        await fetchJson(`${this.helperUrl}/account`, JSON.stringify({ newAccountId, newAccountPublicKey: publicKey.toString() }));
    }
}
