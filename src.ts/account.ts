'use strict';

import { SignedTransaction } from './protos'
import { sendMoney, createAccount, signedTransaction } from './transaction'
import { FinalTransactionResult } from './providers/provider';
import { Connection } from './connection';
import { base_decode } from './utils/serialize';

export type AccountState = {
    account_id: string,
    nonce: number,
    amount: bigint,
    stake: bigint,
    public_keys: Uint8Array[],
    code_hash: string,
};

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

    async state(): Promise<AccountState> {
        const response = await this.connection.provider.query(`account/${this.accountId}`, '');
        return JSON.parse(base_decode(response.value).toString())
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
