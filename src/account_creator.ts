import BN from 'bn.js';
import { Connection } from './connection';
import { Account } from './account';
import { fetchJson } from './utils/web';
import { PublicKey } from './utils/key_pair';

/**
 * Account creator provides an interface for implementations to actually create accounts
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

    /**
     * Creates an account using a masterAccount, meaning the new account is created from an existing account
     * @param newAccountId The name of the NEAR account to be created
     * @param publicKey The public key from the masterAccount used to create this account
     * @returns {Promise<void>}
     */
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

    /**
     * Creates an account using a helperUrl
     * This is [hosted here](https://helper.nearprotocol.com) or set up locally with the [near-contract-helper](https://github.com/nearprotocol/near-contract-helper) repository
     * @param newAccountId The name of the NEAR account to be created
     * @param publicKey The public key from the masterAccount used to create this account
     * @returns {Promise<void>}
     */
    async createAccount(newAccountId: string, publicKey: PublicKey): Promise<void> {
        await fetchJson(`${this.helperUrl}/account`, JSON.stringify({ newAccountId, newAccountPublicKey: publicKey.toString() }));
    }
}
