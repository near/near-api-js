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
    logs: string[];
    receipt_ids: string[];
    gas_burnt: number;
    status: ExecutionStatus | ExecutionStatusBasic;
}

export interface FinalExecutionOutcome {
    status: FinalExecutionStatus | FinalExecutionStatusBasic;
    transaction: any;
    transaction_outcome: ExecutionOutcomeWithId;
    receipts_outcome: ExecutionOutcomeWithId[];
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

export interface BlockResult {
    header: BlockHeader;
    transactions: Transaction[];
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

export function adaptTransactionResult(txResult: any): FinalExecutionOutcome {
    if ('receipts' in txResult) {
        txResult = {
            status: txResult.status,
            // not available
            transaction: null,
            transaction_outcome: txResult.transaction,
            receipts_outcome: txResult.receipts
        };
    }
    return txResult;
}
