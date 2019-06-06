'use strict';

import { Network } from '../utils/network';
import { SignedTransaction } from '../protos';

export enum FinalTransactionStatus {
    Unknown = "Unknown",
    Started = "Started",
    Failed = "Failed",
    Completed = "Completed",
}

export type TransactionLog = {
    hash: string,
    lines: Array<string>,
    receipts: Array<number[]>,
    result?: Uint8Array
}

export type FinalTransactionResult = {
    status: FinalTransactionStatus,
    logs: TransactionLog[]
}

export type QueryResult = {
    key: string,
    value: string,
    log: string,
    info: string,
}

export abstract class Provider {
    abstract async getNetwork(): Promise<Network>;

    abstract async sendTransaction(signedTransaction: SignedTransaction): Promise<FinalTransactionResult>;
    abstract async query(path: string, data: string): Promise<QueryResult>;
}

export function getTransactionLastResult(txResult: FinalTransactionResult): any {
    for (let i = txResult.logs.length - 1; i >= 0; --i) {
        const r = txResult.logs[i];
        if (r.result && r.result.length > 0) {
            return JSON.parse(Buffer.from(r.result).toString());
        }
    }
    return null;
}
