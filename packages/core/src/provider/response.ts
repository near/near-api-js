/**
 * NEAR RPC API request types and responses
 * @module
 */

import BN from 'bn.js';

import { BlockHash, BlockHeight, MerklePath } from './protocol';

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

export interface QueryResponseKind {
    block_height: BlockHeight;
    block_hash: BlockHash;
}

export interface AccountView extends QueryResponseKind {
    amount: string;
    locked: string;
    code_hash: string;
    storage_usage: number;
    storage_paid_at: BlockHeight;
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

export interface ContractCodeView extends QueryResponseKind {
    code_base64: string;
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
    nonce: BN;
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
