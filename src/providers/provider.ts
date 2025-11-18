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

/** @hidden */
export interface Provider {
    getNetworkId(): Promise<string>;

    viewAccessKey(accountId: string, publicKey: PublicKey | string, finalityQuery?: FinalityReference): Promise<AccessKeyView>;
    viewAccessKeyList(accountId: string, finalityQuery?: FinalityReference): Promise<AccessKeyList>;

    viewAccount(accountId: string, blockQuery?: BlockReference): Promise<AccountView>;
    viewContractCode(contractId: string, blockQuery?: BlockReference): Promise<ContractCodeView>;
    viewContractState(contractId: string, prefix?: string, blockQuery?: BlockReference): Promise<ContractStateView>;
    callFunction<T extends SerializedReturnValue>(contractId: string, method: string, args: Record<string, unknown>, blockQuery?: BlockReference): Promise<T | undefined>;
    callFunctionRaw(contractId: string, method: string, args: Record<string, unknown>, blockQuery?: BlockReference): Promise<CallContractViewFunctionResultRaw>;

    viewBlock(blockQuery: BlockReference): Promise<BlockResult>;
    viewChunk(chunkId: ChunkId): Promise<ChunkResult>;
    
    viewGasPrice(blockId?: BlockId): Promise<GasPrice>;

    viewNodeStatus(): Promise<NodeStatusResult>;
    viewValidators(params: { blockId: string | number } | { epochId: string } | null): Promise<EpochValidatorInfo>

    viewTransactionStatus(txHash: Uint8Array | string, accountId: string, waitUntil?: TxExecutionStatus): Promise<FinalExecutionOutcome>;
    viewTransactionStatusWithReceipts(txHash: Uint8Array | string, accountId: string, waitUntil?: TxExecutionStatus): Promise<FinalExecutionOutcome & Required<Pick<FinalExecutionOutcome, 'receipts'>>>;
    viewTransactionReceipt(receiptId:  string): Promise<ExecutionOutcomeReceiptDetail>;

    sendTransactionUntil(signedTransaction: SignedTransaction, waitUntil: TxExecutionStatus): Promise<FinalExecutionOutcome>;
    sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    sendTransactionAsync(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;

    query<T extends QueryResponseKind>(params: RpcQueryRequest): Promise<T>;
    query<T extends QueryResponseKind>(path: string, data: string): Promise<T>;

    blockChanges(blockQuery: BlockId | BlockReference): Promise<BlockChangeResult>;
    experimental_protocolConfig(blockReference: BlockReference | { sync_checkpoint: 'genesis' }): Promise<NearProtocolConfig>;
    lightClientProof(request: LightClientProofRequest): Promise<LightClientProof>;
    nextLightClientBlock(request: NextLightClientBlockRequest): Promise<NextLightClientBlockResponse>;
    accessKeyChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;
    singleAccessKeyChanges(accessKeyArray: AccessKeyWithPublicKey[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;
    accountChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;
    contractStateChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference, keyPrefix: string): Promise<ChangeResult>;
    contractCodeChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;

    getCurrentEpochSeatPrice(): Promise<bigint>;
    getNextEpochSeatPrice(): Promise<bigint>;
}
