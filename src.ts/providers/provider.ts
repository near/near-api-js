'use strict';

import { Enum } from '../utils/enums';
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

export enum ExecutionStatusBasic {
    Pending = 'Pending',
    Failure = 'Failure',
}

export class ExecutionStatus extends Enum {
    SuccessValue: string;
    SuccessReceiptId: string;
}

export enum FinalExecutionStatusBasic {
    NotStarted = 'NotStarted',
    Started = 'Started',
    Failure = 'Failure',
}

export class FinalExecutionStatus extends Enum {
    SuccessValue: string;
}

export interface ExecutionOutcomeWithId {
    id: string;
    outcome: ExecutionOutcome;
}

export interface ExecutionOutcome {
    status: ExecutionStatus | ExecutionStatusBasic;
    logs: string[];
    receipt_ids: string[];
    gas_burnt: number;
}

export interface FinalExecutionOutcome {
    status: FinalExecutionStatus | FinalExecutionStatusBasic;
    transaction: ExecutionOutcomeWithId;
    receipts: ExecutionOutcomeWithId[];
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

    abstract async sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    abstract async txStatus(txHash: Uint8Array): Promise<FinalExecutionOutcome>;
    abstract async query(path: string, data: string): Promise<any>;
    abstract async block(height: number): Promise<BlockResult>;
}

export function getTransactionLastResult(txResult: FinalExecutionOutcome): any {
    if (typeof txResult.status === 'object' && txResult.status.SuccessValue !== null) {
        const value = Buffer.from(txResult.status.SuccessValue, 'base64').toString();
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
    return null;
}
