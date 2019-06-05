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
    private _state: AccountState;
    protected ready: Promise<void>;

    constructor(connection: Connection, accountId: string) {
        this.connection = connection;
        this.accountId = accountId;
        this.ready = Promise.resolve(this.fetchState());
    }

    private async signTransaction(transaction: any): Promise<SignedTransaction> {
        let signature = await this.connection.signer.signMessage(SignedTransaction.encode(transaction).finish(), this.accountId, this.connection.networkId);
        const tx = signedTransaction(transaction, signature);
        console.warn(tx);
        return tx;
    }

    private async fetchState(): Promise<void> {
        const response = await this.connection.provider.query(`account/${this.accountId}`, '');
        this._state = JSON.parse(base_decode(response.value).toString());
    }

    async state(): Promise<AccountState> {
        await this.ready;
        return this._state;
    }

    async sendMoney(receiver: string, amount: bigint): Promise<FinalTransactionResult> {
        this._state.nonce++;
        let signedTx = await this.signTransaction(sendMoney(this._state.nonce, this.accountId, receiver, amount));
        return this.connection.provider.sendTransaction(signedTx);
    }

    async createAccount(newAccountId: string, publicKey: string, amount: bigint): Promise<FinalTransactionResult> {
        this._state.nonce++;
        let signedTx = await this.signTransaction(createAccount(this._state.nonce, this.accountId, newAccountId, publicKey, amount));
        return this.connection.provider.sendTransaction(signedTx);
    }
}
