'use strict';

import { SignedTransaction } from './signed_transaction_pb'
import { sendMoney, createAccount, signedTransaction } from './transaction'
import { FinalTransactionResult } from './providers/provider';
import { Connection } from './connection';
import { ConnectionInfo } from './utils/web';

export class Account {
    readonly connection: Connection;
    readonly accountId: string;

    constructor(connection: Connection, accountId: string) {
        this.connection = connection;
        this.accountId = accountId;
    }

    private async signTransaction(transaction: any): Promise<SignedTransaction> {
        let signature = await this.connection.signer.signMessage(transaction.serializeBinary());
        return signedTransaction(transaction, signature);
    }

    async sendMoney(nonce: number, receiver: string, amount: bigint): Promise<FinalTransactionResult> {
        let signedTx = await this.signTransaction(sendMoney(nonce, this.accountId, receiver, amount));
        return this.connection.provider.sendTransaction(signedTx);
    }

    async createAccount(newAccountId: string, publicKey: string, amount: bigint): Promise<FinalTransactionResult> {
        let signedTx = await this.signTransaction(createAccount(this.accountId, newAccountId, publicKey, amount));
        return this.connection.provider.sendTransaction(signedTx);
    }
}

/**
 * Account creator provides interface to specific implementation to acutally create account.
 */
export abstract class AccountCreator {
    abstract async createAccount(newAccountId: string): Promise<Account>;
}

export class LocalAccountCreator {
    readonly connection: Connection;
    readonly masterAccount: Account;

    constructor(connection: Connection, masterAccount: Account) {
        this.connection = connection;
        this.masterAccount = masterAccount;
    }

    async createAccount(newAccountId: string, publicKey: string): Promise<Account> {
        let _response = await this.masterAccount.createAccount(newAccountId, publicKey, BigInt(1000 * 1000 * 1000 * 1000));
        // TODO: check the response here for status.
        return new Account(this.connection, newAccountId);
    }
}

export class UrlAccountCreator {
    readonly connection: Connection;
    readonly helperConnection: ConnectionInfo;

    constructor(connection: Connection, helperUrl: string) {
        this.connection = connection;
        this.helperConnection = { url: helperUrl };
    }

    async createAccount(newAccountId: string, publicKey: string): Promise<Account> {
        return new Account(this.connection, newAccountId);
    }
}
