'use strict';

import { Network } from '../utils/network';
import { SignedTransaction } from '../signed_transaction_pb';

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
    result?: number[]
}

export type FinalTransactionResult = {
    status: FinalTransactionStatus,
    logs: TransactionLog[]
}

export type QueryResult = {
    key: string,
    value: string,
    log: string,
}

export abstract class Provider {
    abstract async getNetwork(): Promise<Network>;

    abstract async sendTransaction(signedTransaction: SignedTransaction): Promise<FinalTransactionResult>;
    abstract async query(path: string, data: string): Promise<QueryResult>;
}
