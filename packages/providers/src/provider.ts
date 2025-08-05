/**
 * NEAR RPC API request types and responses
 * @module
 */

import { SignedTransaction } from '@near-js/transactions';
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
} from '@near-js/types';
import { PublicKey } from '@near-js/crypto';

/** @hidden */
export interface Provider {
    /** @deprecated use {@link viewNodeStatus} */
    status(): Promise<NodeStatusResult>;

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
    viewValidators(blockId?: BlockId): Promise<EpochValidatorInfo>;

    viewTransactionStatus(txHash: Uint8Array | string, accountId: string, waitUntil: TxExecutionStatus): Promise<FinalExecutionOutcome>;
    viewTransactionStatusWithReceipts(txHash: Uint8Array | string, accountId: string, waitUntil: TxExecutionStatus): Promise<FinalExecutionOutcome & Required<Pick<FinalExecutionOutcome, 'receipts'>>>;
    viewTransactionReceipt(receiptId:  string): Promise<ExecutionOutcomeReceiptDetail>;

    sendTransactionUntil(signedTransaction: SignedTransaction, waitUntil: TxExecutionStatus): Promise<FinalExecutionOutcome>;
    sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    sendTransactionAsync(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;

    /** @deprecated use {@link viewTransactionStatus} */
    txStatus(txHash: Uint8Array | string, accountId: string, waitUntil: TxExecutionStatus): Promise<FinalExecutionOutcome>;
    /** @deprecated use {@link viewTransactionStatusWithReceipts} */
    txStatusReceipts(txHash: Uint8Array | string, accountId: string, waitUntil: TxExecutionStatus): Promise<FinalExecutionOutcome>;

    query<T extends QueryResponseKind>(params: RpcQueryRequest): Promise<T>;
    query<T extends QueryResponseKind>(path: string, data: string): Promise<T>;

    /** @deprecated use {@link viewBlock} */
    block(blockQuery: BlockId | BlockReference): Promise<BlockResult>;
    blockChanges(blockQuery: BlockId | BlockReference): Promise<BlockChangeResult>;
    /** @deprecated use {@link viewChunk} */
    chunk(chunkId: ChunkId): Promise<ChunkResult>;
    /** @deprecated use {@link viewValidators} */
    validators(blockId: BlockId | null): Promise<EpochValidatorInfo>;
    experimental_protocolConfig(blockReference: BlockReference): Promise<NearProtocolConfig>;
    lightClientProof(request: LightClientProofRequest): Promise<LightClientProof>;
    nextLightClientBlock(request: NextLightClientBlockRequest): Promise<NextLightClientBlockResponse>;
    /** @deprecated use {@link viewGasPrice} */
    gasPrice(blockId: BlockId | null): Promise<GasPrice>;
    accessKeyChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;
    singleAccessKeyChanges(accessKeyArray: AccessKeyWithPublicKey[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;
    accountChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;
    contractStateChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference, keyPrefix: string): Promise<ChangeResult>;
    contractCodeChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;

    getCurrentEpochSeatPrice(): Promise<bigint>;
    getNextEpochSeatPrice(): Promise<bigint>;
}
