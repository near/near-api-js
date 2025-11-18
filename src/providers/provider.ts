/**
 * NEAR RPC API request types and responses
 * @module
 */

import { SignedTransaction } from '../transactions';
import {
    AccessKeyView,
    AccessKeyList,
    AccessKeyWithPublicKey,
    AccountView,
    BlockChangeResult,
    BlockId,
    BlockReference,
    BlockResult,
    ChangeResult,
    FinalExecutionOutcome,
    GasPrice,
    LightClientProof,
    LightClientProofRequest,
    NextLightClientBlockRequest,
    NextLightClientBlockResponse,
    NearProtocolConfig,
    NodeStatusResult,
    QueryResponseKind,
    RpcQueryRequest,
    type SerializedReturnValue,
    EpochValidatorInfo,
    ExecutionOutcomeReceiptDetail,
    TxExecutionStatus,
    ContractCodeView,
    ContractStateView,
    ChunkId,
    ChunkResult,
    FinalityReference,
    CallContractViewFunctionResultRaw,
} from '../types';
import { PublicKey } from '../crypto';

export interface ViewAccessKeyParams {
    accountId: string;
    publicKey: PublicKey | string;
    finalityQuery?: FinalityReference;
}

export interface ViewAccessKeyListParams {
    accountId: string;
    finalityQuery?: FinalityReference;
}

export interface ViewAccountParams {
    accountId: string;
    blockQuery?: BlockReference;
}

export interface ViewContractCodeParams {
    contractId: string;
    blockQuery?: BlockReference;
}

export interface ViewContractStateParams {
    contractId: string;
    prefix?: string;
    blockQuery?: BlockReference;
}

export interface CallFunctionParams {
    contractId: string;
    method: string;
    args: Uint8Array | object;
    blockQuery?: BlockReference;
}

/** @hidden */
export interface Provider {
    getNetworkId(): Promise<string>;

    viewAccessKey(params: ViewAccessKeyParams): Promise<AccessKeyView>;
    viewAccessKeyList(params: ViewAccessKeyListParams): Promise<AccessKeyList>;

    viewAccount(params: ViewAccountParams): Promise<AccountView>;
    viewContractCode(params: ViewContractCodeParams): Promise<ContractCodeView>;
    viewContractState(params: ViewContractStateParams): Promise<ContractStateView>;
    callFunction<T extends SerializedReturnValue>(params: CallFunctionParams): Promise<T | undefined>;
    callFunctionRaw(params: CallFunctionParams): Promise<CallContractViewFunctionResultRaw>;

    viewBlock(params: { blockQuery: BlockReference }): Promise<BlockResult>;
    viewChunk(params: { chunkId: ChunkId }): Promise<ChunkResult>;

    viewGasPrice(params?: { blockId?: BlockId }): Promise<GasPrice>;

    viewNodeStatus(): Promise<NodeStatusResult>;
    viewValidatorsV2(params: { blockId: string | number } | { epochId: string } | null): Promise<EpochValidatorInfo>

    viewTransactionStatus(params: { txHash: Uint8Array | string; accountId: string; waitUntil: TxExecutionStatus }): Promise<FinalExecutionOutcome>;
    viewTransactionStatusWithReceipts(params: { txHash: Uint8Array | string; accountId: string; waitUntil: TxExecutionStatus }): Promise<FinalExecutionOutcome & Required<Pick<FinalExecutionOutcome, 'receipts'>>>;
    viewTransactionReceipt(params: { receiptId: string }): Promise<ExecutionOutcomeReceiptDetail>;

    sendTransactionUntil(params: { signedTransaction: SignedTransaction; waitUntil: TxExecutionStatus }): Promise<FinalExecutionOutcome>;
    sendTransaction(params: { signedTransaction: SignedTransaction }): Promise<FinalExecutionOutcome>;
    sendTransactionAsync(params: { signedTransaction: SignedTransaction }): Promise<FinalExecutionOutcome>;

    query<T extends QueryResponseKind>(params: RpcQueryRequest): Promise<T>;
    query<T extends QueryResponseKind>(params: { path: string; data: string }): Promise<T>;

    blockChanges(params: { blockQuery: BlockId | BlockReference }): Promise<BlockChangeResult>;
    experimental_protocolConfig(params: { blockReference: BlockReference | { sync_checkpoint: 'genesis' } }): Promise<NearProtocolConfig>;
    lightClientProof(params: { request: LightClientProofRequest }): Promise<LightClientProof>;
    nextLightClientBlock(params: { request: NextLightClientBlockRequest }): Promise<NextLightClientBlockResponse>;
    accessKeyChanges(params: { accountIdArray: string[]; blockQuery: BlockId | BlockReference }): Promise<ChangeResult>;
    singleAccessKeyChanges(params: { accessKeyArray: AccessKeyWithPublicKey[]; blockQuery: BlockId | BlockReference }): Promise<ChangeResult>;
    accountChanges(params: { accountIdArray: string[]; blockQuery: BlockId | BlockReference }): Promise<ChangeResult>;
    contractStateChanges(params: { accountIdArray: string[]; blockQuery: BlockId | BlockReference; keyPrefix?: string }): Promise<ChangeResult>;
    contractCodeChanges(params: { accountIdArray: string[]; blockQuery: BlockId | BlockReference }): Promise<ChangeResult>;

    getCurrentEpochSeatPrice(): Promise<bigint>;
    getNextEpochSeatPrice(): Promise<bigint>;
}
