/**
 * NEAR RPC API request types and responses
 * @module
 */
import { BlockHash, BlockHeight, MerklePath, TxExecutionStatus } from './protocol';

export type SerializedReturnValue = string | number | bigint | boolean | object;

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
    tokens_burnt: string;
    executor_id: string;
    status: ExecutionStatus | ExecutionStatusBasic;
}

export type ReceiptAction =
  { Transfer: { deposit: string }};

export interface ExecutionOutcomeReceiptDetail {
    predecessor_id: string;
    receipt: {
        Action: ExecutionOutcomeReceiptAction
    };
    receipt_id: string;
    receiver_id: string;
}

export interface ExecutionOutcomeReceiptAction {
    actions: ReceiptAction[];
    gas_price: string;
    input_data_ids: string[];
    output_data_receivers: string[];
    signer_id: string;
    signer_public_key: string;
}

export interface ExecutionOutcomeWithIdView {
    proof: MerklePath;
    block_hash: string;
    id: string;
    outcome: ExecutionOutcome;
}

export interface FinalExecutionOutcome {
    final_execution_status: TxExecutionStatus;
    status: FinalExecutionStatus | FinalExecutionStatusBasic;
    transaction: any;
    transaction_outcome: ExecutionOutcomeWithId;
    receipts_outcome: ExecutionOutcomeWithId[];
    receipts?: ExecutionOutcomeReceiptDetail[];
}

export interface QueryResponseKind {
    block_height: BlockHeight;
    block_hash: BlockHash;
}

export interface AccountViewRaw extends QueryResponseKind {
    amount: string;
    locked: string;
    code_hash: string;
    storage_usage: number;
    storage_paid_at: BlockHeight;
}

export interface AccountView extends QueryResponseKind {
    amount: bigint;
    locked: bigint;
    code_hash: string;
    storage_usage: number;
    storage_paid_at: BlockHeight;
}

export interface AccountBalanceInfo {
    total: bigint;
    usedOnStorage: bigint;
    locked: bigint;
    available: bigint;
}

interface StateItem {
    key: string;
    value: string;
    proof: string[];
}

export interface ViewStateResult extends QueryResponseKind {
    values: StateItem[];
    proof: string[];
}

export interface CodeResult extends QueryResponseKind {
    result: number[];
    logs: string[];
}

export interface CallContractViewFunctionResultRaw extends QueryResponseKind {
    result: number[];
    logs: string[];
}

export interface CallContractViewFunctionResult extends QueryResponseKind {
    result?: string | number | any;
    logs: string[];
}

interface StateItemView  {
    key: string;
    value: string;
    proof: string[];
}

export interface ContractStateView extends QueryResponseKind {
    values: StateItemView[];
}

export interface ContractCodeViewRaw extends QueryResponseKind {
    code_base64: string;
    hash: string;
}

export interface ContractCodeView extends QueryResponseKind {
    code: Uint8Array;
    hash: string;
}

export interface FunctionCallPermissionView {
    FunctionCall: {
        allowance: string;
        receiver_id: string;
        method_names: string[];
    };
}

export interface AccessKeyViewRaw extends QueryResponseKind {
    nonce: number;
    permission: 'FullAccess' | FunctionCallPermissionView;
}
export interface AccessKeyView extends QueryResponseKind {
    nonce: bigint;
    permission: 'FullAccess' | FunctionCallPermissionView;
}

export interface AccessKeyInfoView {
    public_key: string;
    access_key: AccessKeyView;
}

export interface AccessKeyList extends QueryResponseKind {
    keys: AccessKeyInfoView[];
}

export interface AccessKeyInfoView {
    public_key: string;
    access_key: AccessKeyView;
}
