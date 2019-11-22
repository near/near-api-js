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

interface Version {
    version: string;
    build: string;
}

export interface NodeStatusResult {
    chain_id: string;
    rpc_addr: string;
    sync_info: SyncInfo;
    validators: string[];
    version: Version;
}

export type BlockHash = string;
export type BlockHeight = number;
export type BlockId = BlockHash | BlockHeight;

export enum ExecutionStatusBasic {
    Unknown = 'Unknown',
    Pending = 'Pending',
    Failure = 'Failure',
}

export interface ExecutionStatus {
    SuccessValue?: string;
    SuccessReceiptId?: string;
    Failure?: ExecutionError;
}

export enum FinalExecutionStatusBasic {
    NotStarted = 'NotStarted',
    Started = 'Started',
    Failure = 'Failure',
}

export interface ExecutionError {
    error_message: string;
    error_type: string;
}

export interface FinalExecutionStatus {
    SuccessValue?: string;
    Failure?: ExecutionError;
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

export type ChunkHash = string;
export type ShardId = number;
export type BlockShardId = [BlockId, ShardId];
export type ChunkId = ChunkHash | BlockShardId;

export interface ChunkHeader {
  balance_burnt: string;
  chunk_hash: ChunkHash;
  encoded_length: number;
  encoded_merkle_root: string;
  gas_limit: number;
  gas_used: number;
  height_created: number;
  height_included: number;
  outgoing_receipts_root: string;
  prev_block_hash: string;
  prev_state_num_parts: number;
  prev_state_root_hash: string;
  rent_paid: string;
  shard_id: number;
  signature: string;
  tx_root: string;
  validator_proposals: any[];
  validator_reward: string;
}

export interface ChunkResult {
  header: ChunkHeader;
  receipts: any[];
  transactions: Transaction[];
}

export interface Transaction {
    hash: string;
    public_key: string;
    signature: string;
    body: any;
}

// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
interface LegacyTransactionLog {
    hash: string;
    result: LegacyTransactionResult;
}

// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
interface LegacyTransactionResult {
    status: LegacyTransactionStatus;
    logs: string[];
    receipts: string[];
    result?: string;
}

// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
enum LegacyFinalTransactionStatus {
    Unknown = 'Unknown',
    Started = 'Started',
    Failed = 'Failed',
    Completed = 'Completed',
}

// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
enum LegacyTransactionStatus {
    Unknown = 'Unknown',
    Completed = 'Completed',
    Failed = 'Failed',
}

// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
interface LegacyFinalTransactionResult {
    status: LegacyFinalTransactionStatus;
    transactions: LegacyTransactionLog[];
}

export interface BlockResult {
    header: BlockHeader;
    transactions: Transaction[];
}

// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
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

// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
function fixLegacyBasicExecutionOutcomeFailure(t: ExecutionOutcomeWithId): ExecutionOutcomeWithId {
    if (t.outcome.status === ExecutionStatusBasic.Failure) {
        t.outcome.status = {
            Failure: {
                error_message: t.outcome.logs.find(it => it.startsWith('ABORT:')) ||
                    t.outcome.logs.find(it => it.startsWith('Runtime error:')) || '',
                error_type: 'LegacyError',
            }
        };
    }
    return t;
}

// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
export function adaptTransactionResult(txResult: FinalExecutionOutcome | LegacyFinalTransactionResult): FinalExecutionOutcome {
    // Fixing legacy transaction result
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
        txResult = {
            status,
            transaction: mapLegacyTransactionLog(txResult.transactions.splice(0, 1)[0]),
            receipts: txResult.transactions.map(mapLegacyTransactionLog),
        };
    }

    // Adapting from old error handling.
    txResult.transaction = fixLegacyBasicExecutionOutcomeFailure(txResult.transaction);
    txResult.receipts = txResult.receipts.map(fixLegacyBasicExecutionOutcomeFailure);

    // Fixing master error status
    if (txResult.status === FinalExecutionStatusBasic.Failure) {
        const err = ([txResult.transaction, ...txResult.receipts]
            .find(t => typeof t.outcome.status === 'object' && typeof t.outcome.status.Failure === 'object')
            .outcome.status as ExecutionStatus).Failure;
        txResult.status = {
            Failure: err
        };
    }

    return txResult;
}

export abstract class Provider {
    abstract async getNetwork(): Promise<Network>;
    abstract async status(): Promise<NodeStatusResult>;

    abstract async sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    abstract async txStatus(txHash: Uint8Array, accountId: string): Promise<FinalExecutionOutcome>;
    abstract async query(path: string, data: string): Promise<any>;
    abstract async block(blockId: BlockId): Promise<BlockResult>;
    abstract async chunk(chunkId: ChunkId): Promise<ChunkResult>;
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
