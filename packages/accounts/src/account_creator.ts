import type { PublicKey } from '@near-js/crypto';
import depd from 'depd';
import type { Account } from './account.js';
import type { Connection } from './connection.js';

/**
 * @deprecated Will be removed in the next major release
 *
 * Account creator provides an interface for implementations to actually create accounts
 */
export abstract class AccountCreator {
    constructor() {
        const deprecate = depd('AccountCreator');
        deprecate(
            `${this.constructor.name} is deprecated and will be removed in the next major release`,
        );
    }

    abstract createAccount(
        newAccountId: string,
        publicKey: PublicKey,
    ): Promise<void>;
}

/** @deprecated Will be removed in the next major release */
export class LocalAccountCreator extends AccountCreator {
    readonly masterAccount: Account;
    readonly initialBalance: bigint;

    constructor(masterAccount: Account, initialBalance: bigint) {
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
    async createAccount(
        newAccountId: string,
        publicKey: PublicKey,
    ): Promise<void> {
        await this.masterAccount.createAccount(
            newAccountId,
            publicKey,
            this.initialBalance,
        );
    }
}

/** @deprecated Will be removed in the next major release */
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
    async createAccount(
        newAccountId: string,
        publicKey: PublicKey,
    ): Promise<void> {
        await fetch(`${this.helperUrl}/account`, {
            body: JSON.stringify({
                newAccountId,
                newAccountPublicKey: publicKey.toString(),
            }),
            method: 'POST',
        });
    }
}
