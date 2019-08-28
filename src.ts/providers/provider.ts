'use strict';

import { Network } from '../utils/network';
import { SignedTransaction } from '../transaction';

export interface SyncInfo {
    latest_block_hash: string;
    latest_block_height: number;
    latest_block_time: string;
    latest_state_root: string;
    syncing: boolean;
}

export interface NodeStatusResult {
    chain_id: string;
    rpc_addr: string;
    sync_info: SyncInfo;
    validators: string[];
}

export enum FinalTransactionStatus {
    Unknown = 'Unknown',
    Started = 'Started',
    Failed = 'Failed',
    Completed = 'Completed',
}

export interface TransactionLog {
    hash: string;
    result: TransactionResult;
}

export interface TransactionResult {
    status: string;
    logs: string[];
    receipts: string[];
    result?: string;
}

export interface FinalTransactionResult {
    status: FinalTransactionStatus;
    transactions: TransactionLog[];
}

export interface TotalWeight {
    num: number;
}

export interface BlockHeader {
    approval_mask: string;
    approval_sigs: string;
    hash: string;
    height: number;
    prev_hash: string;
    prev_state_root: string;
    timestamp: number;
    total_weight: TotalWeight;
    tx_root: string;
}

export interface Transaction {
    hash: string;
    public_key: string;
    signature: string;
    body: any;
}

export interface BlockResult {
    header: BlockHeader;
    transactions: Transaction[];
}

export abstract class Provider {
    abstract async getNetwork(): Promise<Network>;
    abstract async status(): Promise<NodeStatusResult>;

    abstract async sendTransaction(signedTransaction: SignedTransaction): Promise<FinalTransactionResult>;
    abstract async txStatus(txHash: Uint8Array): Promise<FinalTransactionResult>;
    abstract async query(path: string, data: string): Promise<any>;
    abstract async block(height: number): Promise<BlockResult>;
}

export function getTransactionLastResult(txResult: FinalTransactionResult): any {
    for (let i = txResult.transactions.length - 1; i >= 0; --i) {
        const r = txResult.transactions[i];
        if (r.result && r.result.result && r.result.result.length > 0) {
            return JSON.parse(Buffer.from(r.result.result, 'base64').toString());
        }
    }
    return null;
}
