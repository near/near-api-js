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
declare type BlockHash = string;
declare type BlockHeight = number;
export declare type BlockId = BlockHash | BlockHeight;
export declare type Finality = 'optimistic' | 'near-final' | 'final';
export declare enum ExecutionStatusBasic {
    Unknown = "Unknown",
    Pending = "Pending",
    Failure = "Failure"
}
export interface ExecutionStatus {
    SuccessValue?: string;
    SuccessReceiptId?: string;
    Failure?: ExecutionError;
}
export declare enum FinalExecutionStatusBasic {
    NotStarted = "NotStarted",
    Started = "Started",
    Failure = "Failure"
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
export interface ExecutionOutcomeWithIdView {
    proof: MerklePath;
    block_hash: string;
    id: string;
    outcome: ExecutionOutcome;
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
export declare type ChunkHash = string;
export declare type ShardId = number;
export declare type BlockShardId = [BlockId, ShardId];
export declare type ChunkId = ChunkHash | BlockShardId;
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
export interface CurrentEpochValidatorInfo {
    account_id: string;
    public_key: string;
    is_slashed: boolean;
    stake: string;
    shards: number[];
    num_produced_blocks: number;
    num_expected_blocks: number;
}
export interface NextEpochValidatorInfo {
    account_id: string;
    public_key: string;
    stake: string;
    shards: number[];
}
export interface ValidatorStakeView {
    account_id: string;
    public_key: string;
    stake: string;
}
export interface GenesisConfig {
    runtime_config: RuntimeConfig;
}
export interface RuntimeConfig {
    storage_amount_per_byte: string;
}
export interface EpochValidatorInfo {
    next_validators: NextEpochValidatorInfo[];
    current_validators: CurrentEpochValidatorInfo[];
    next_fisherman: ValidatorStakeView[];
    current_fisherman: ValidatorStakeView[];
    current_proposals: ValidatorStakeView[];
    prev_epoch_kickout: ValidatorStakeView[];
    epoch_start_height: number;
}
export interface MerkleNode {
    hash: string;
    direction: string;
}
export declare type MerklePath = MerkleNode[];
export interface BlockHeaderInnerLiteView {
    height: number;
    epoch_id: string;
    next_epoch_id: string;
    prev_state_root: string;
    outcome_root: string;
    timestamp: number;
    next_bp_hash: string;
    block_merkle_root: string;
}
export interface LightClientBlockLiteView {
    prev_block_hash: string;
    inner_rest_hash: string;
    inner_lite: BlockHeaderInnerLiteView;
}
export interface LightClientProof {
    outcome_proof: ExecutionOutcomeWithIdView;
    outcome_root_proof: MerklePath;
    block_header_lite: LightClientBlockLiteView;
    block_proof: MerklePath;
}
export declare enum IdType {
    Transaction = "transaction",
    Receipt = "receipt"
}
export interface LightClientProofRequest {
    type: IdType;
    light_client_head: string;
    transaction_hash?: string;
    sender_id?: string;
    receipt_id?: string;
    receiver_id?: string;
}
export declare abstract class Provider {
    abstract getNetwork(): Promise<Network>;
    abstract status(): Promise<NodeStatusResult>;
    abstract sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    abstract txStatus(txHash: Uint8Array, accountId: string): Promise<FinalExecutionOutcome>;
    abstract query(params: object): Promise<any>;
    abstract query(path: string, data: string): Promise<any>;
    abstract block(blockQuery: BlockId | {
        blockId: BlockId;
    } | {
        finality: Finality;
    }): Promise<BlockResult>;
    abstract chunk(chunkId: ChunkId): Promise<ChunkResult>;
    abstract validators(blockId: BlockId): Promise<EpochValidatorInfo>;
    abstract experimental_genesisConfig(): Promise<GenesisConfig>;
    abstract lightClientProof(request: LightClientProofRequest): Promise<LightClientProof>;
}
export declare function getTransactionLastResult(txResult: FinalExecutionOutcome): any;
export {};
