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
export declare enum ExecutionStatusBasic {
    Pending = "Pending",
    Failure = "Failure"
}
export declare class ExecutionStatus extends Enum {
    SuccessValue: string;
    SuccessReceiptId: string;
}
export declare enum FinalExecutionStatusBasic {
    NotStarted = "NotStarted",
    Started = "Started",
    Failure = "Failure"
}
export declare class FinalExecutionStatus extends Enum {
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
export declare abstract class Provider {
    abstract getNetwork(): Promise<Network>;
    abstract status(): Promise<NodeStatusResult>;
    abstract sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    abstract txStatus(txHash: Uint8Array): Promise<FinalExecutionOutcome>;
    abstract query(path: string, data: string): Promise<any>;
    abstract block(height: number): Promise<BlockResult>;
}
export declare function getTransactionLastResult(txResult: FinalExecutionOutcome): any;
