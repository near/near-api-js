'use strict';

import { sendMoney, createAccount, signTransaction, fromUint128 } from './transaction'
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

    async fetchState(): Promise<void> {
        const response = await this.connection.provider.query(`account/${this.accountId}`, '');
        const state = JSON.parse(base_decode(response.value).toString());
        this._state = state;
        this._state.amount = fromUint128(state.amount);
        this._state.stake = fromUint128(state.stake);
    }

    async state(): Promise<AccountState> {
        await this.ready;
        return this._state;
    }

    async sendMoney(receiver: string, amount: bigint): Promise<FinalTransactionResult> {
        this._state.nonce++;
        let signedTx = await signTransaction(
            this.connection.signer, 
            sendMoney(this._state.nonce, this.accountId, receiver, amount),
            this.accountId,
            this.connection.networkId);
        return this.connection.provider.sendTransaction(signedTx);
    }

    async createAccount(newAccountId: string, publicKey: string, amount: bigint): Promise<FinalTransactionResult> {
        this._state.nonce++;
        let signedTx = await signTransaction(
            this.connection.signer,
            createAccount(this._state.nonce, this.accountId, newAccountId, publicKey, amount),
            this.accountId,
            this.connection.networkId);
        return this.connection.provider.sendTransaction(signedTx);
    }
}
