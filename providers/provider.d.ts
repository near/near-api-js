import { Network } from '../utils/network';
export declare enum FinalTransactionStatus {
    Unknown = "Unknown",
    Started = "Started",
    Failed = "Failed",
    Completed = "Completed"
}
export declare type TransactionLog = {
    hash: string;
    lines: Array<string>;
    receipts: Array<number[]>;
    result?: number[];
};
export declare type FinalTransactionResult = {
    status: FinalTransactionStatus;
    logs: TransactionLog[];
};
export declare type QueryResult = {
    key: string;
    value: string;
    log: string;
};
export declare abstract class Provider {
    abstract getNetwork(): Promise<Network>;
    abstract sendTransaction(signedTransaction: string | Promise<string>): Promise<FinalTransactionResult>;
    abstract query(path: string, data: string): Promise<QueryResult>;
}
