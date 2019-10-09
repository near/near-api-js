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

export interface Version {
    build: string;
    version: string;
}

export interface NodeStatusResult {
    chain_id: string;
    rpc_addr: string;
    sync_info: SyncInfo;
    validators: string[];
    version: Version;
}

export enum ExecutionStatusBasic {
    Unknown = 'Unknown',
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

interface LegacyTransactionLog {
    hash: string;
    result: LegacyTransactionResult;
}

interface LegacyTransactionResult {
    status: LegacyTransactionStatus;
    logs: string[];
    receipts: string[];
    result?: string;
}

enum LegacyFinalTransactionStatus {
    Unknown = 'Unknown',
    Started = 'Started',
    Failed = 'Failed',
    Completed = 'Completed',
}

enum LegacyTransactionStatus {
    Unknown = 'Unknown',
    Completed = 'Completed',
    Failed = 'Failed',
}

interface LegacyFinalTransactionResult {
    status: LegacyFinalTransactionStatus;
    transactions: LegacyTransactionLog[];
}

export interface BlockResult {
    header: BlockHeader;
    transactions: Transaction[];
}

function mapLegacyTransactionLog(tl: LegacyTransactionLog): ExecutionOutcomeWithId {
    let status;
    if (tl.result.status === LegacyTransactionStatus.Unknown) {
        status = ExecutionStatusBasic.Unknown;
    } else if (tl.result.status === LegacyTransactionStatus.Failed) {
        status = ExecutionStatusBasic.Failure;
    } else if (tl.result.status === LegacyTransactionStatus.Completed) {
        status = {
            SuccessValue: tl.result.result || ''
        };
    }
    return {
        id: tl.hash,
        outcome: {
            status,
            logs: tl.result.logs,
            receipt_ids: tl.result.receipts,
            gas_burnt: 0,  // not available
        },
    };
}

export function adaptTransactionResult(txResult: FinalExecutionOutcome | LegacyFinalTransactionResult): FinalExecutionOutcome {
    if ('transactions' in txResult) {
        txResult = txResult as LegacyFinalTransactionResult;
        let status;
        if (txResult.status === LegacyFinalTransactionStatus.Unknown) {
            status = FinalExecutionStatusBasic.NotStarted;
        } else if (txResult.status === LegacyFinalTransactionStatus.Started) {
            status = FinalExecutionStatusBasic.Started;
        } else if (txResult.status === LegacyFinalTransactionStatus.Failed) {
            status = FinalExecutionStatusBasic.Failure;
        } else if (txResult.status === LegacyFinalTransactionStatus.Completed) {
            let result = '';
            for (let i = txResult.transactions.length - 1; i >= 0; --i) {
                const r = txResult.transactions[i];
                if (r.result && r.result.result && r.result.result.length > 0) {
                    result = r.result.result;
                    break;
                }
            }
            status = {
                SuccessValue: result,
            };
        }
        return {
            status: status,
            transaction: mapLegacyTransactionLog(txResult.transactions.splice(0, 1)[0]),
            receipts: txResult.transactions.map(mapLegacyTransactionLog),
        };
    } else {
        return txResult;
    }
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
    if (typeof txResult.status === 'object' && typeof txResult.status.SuccessValue === 'string') {
        const value = Buffer.from(txResult.status.SuccessValue, 'base64').toString();
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
    return null;
}
