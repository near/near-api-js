import { Network } from '../utils/network';
import { SignedTransaction } from '../protos';
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
export declare enum FinalTransactionStatus {
    Unknown = "Unknown",
    Started = "Started",
    Failed = "Failed",
    Completed = "Completed"
}
export interface TransactionLog {
    hash: string;
    lines: string[];
    receipts: number[][];
    result?: Uint8Array;
}
export interface FinalTransactionResult {
    status: FinalTransactionStatus;
    logs: TransactionLog[];
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
export declare abstract class Provider {
    abstract getNetwork(): Promise<Network>;
    abstract status(): Promise<NodeStatusResult>;
    abstract sendTransaction(signedTransaction: SignedTransaction): Promise<FinalTransactionResult>;
    abstract txStatus(txHash: Uint8Array): Promise<FinalTransactionResult>;
    abstract query(path: string, data: string): Promise<any>;
    abstract block(height: number): Promise<BlockResult>;
}
export declare function getTransactionLastResult(txResult: FinalTransactionResult): any;
