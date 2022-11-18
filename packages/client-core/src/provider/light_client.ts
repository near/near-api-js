/**
 * NEAR RPC API request types and responses
 * @module
 */

import { BlockHeaderInnerLiteView, MerklePath } from './protocol';
import { ExecutionOutcomeWithIdView } from './response';

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

export enum IdType {
    Transaction = 'transaction',
    Receipt = 'receipt',
}

export interface LightClientProofRequest {
    type: IdType;
    light_client_head: string;
    transaction_hash?: string;
    sender_id?: string;
    receipt_id?: string;
    receiver_id?: string;
}
