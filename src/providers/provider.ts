/**
 * NEAR RPC API request types and responses
 * @module
 */

import type { PublicKey } from '../crypto/index.js';
import type { SignedTransaction } from '../transactions/index.js';
import type {
    AccessKeyList,
    AccessKeyView,
    AccessKeyWithPublicKey,
    AccountView,
    BlockChangeResult,
    BlockId,
    BlockReference,
    BlockResult,
    CallContractViewFunctionResultRaw,
    ChangeResult,
    ChunkId,
    ChunkResult,
    ContractCodeView,
    ContractStateView,
    EpochValidatorInfo,
    ExecutionOutcomeReceiptDetail,
    FinalExecutionOutcome,
    FinalityReference,
    GasPrice,
    LightClientProof,
    LightClientProofRequest,
    NearProtocolConfig,
    NextLightClientBlockRequest,
    NextLightClientBlockResponse,
    NodeStatusResult,
    QueryResponseKind,
    RpcQueryRequest,
    SerializedReturnValue,
    TxExecutionStatus,
} from '../types/index.js';

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export interface FinalityQuery {
    finalityQuery?: FinalityReference;
}

export interface BlockQuery {
    blockQuery?: BlockReference;
}

export interface TransactionExecutionReference {
    waitUntil?: TxExecutionStatus;
}

export type ViewAccessKeyArgs = Prettify<
    {
        accountId: string;
        publicKey: PublicKey | string;
    } & FinalityQuery
>;

export type ViewAccessKeyListArgs = Prettify<
    {
        accountId: string;
    } & FinalityQuery
>;

export type ViewAccountArgs = Prettify<
    {
        accountId: string;
    } & BlockQuery
>;

export type ViewContractCodeArgs = Prettify<
    {
        contractId: string;
    } & BlockQuery
>;

export type ViewContractStateArgs = Prettify<
    {
        contractId: string;
        prefix?: string;
    } & BlockQuery
>;

export type CallFunctionArgs = Prettify<
    {
        contractId: string;
        method: string;
        args: Record<string, unknown> | Uint8Array;
    } & BlockQuery
>;

export type ViewValidatorsArgs = { blockId: BlockId } | { epochId: string } | null;

export type ViewTransactionStatusArgs = Prettify<
    {
        txHash: Uint8Array | string;
        accountId: string;
    } & TransactionExecutionReference
>;

/** @hidden */
export interface Provider {
    getNetworkId(): Promise<string>;

    viewAccessKey(params: ViewAccessKeyArgs): Promise<AccessKeyView>;
    viewAccessKeyList(params: ViewAccessKeyListArgs): Promise<AccessKeyList>;
    viewAccount(params: ViewAccountArgs): Promise<AccountView>;
    viewContractCode(params: ViewContractCodeArgs): Promise<ContractCodeView>;
    viewContractState(params: ViewContractStateArgs): Promise<ContractStateView>;
    callFunction<T extends SerializedReturnValue>(params: CallFunctionArgs): Promise<T | undefined>;
    callFunctionRaw(params: CallFunctionArgs): Promise<CallContractViewFunctionResultRaw>;

    viewBlock(blockQuery: BlockReference): Promise<BlockResult>;
    viewChunk(chunkId: ChunkId): Promise<ChunkResult>;

    viewGasPrice(blockId?: BlockId): Promise<GasPrice>;

    viewNodeStatus(): Promise<NodeStatusResult>;
    viewValidators(params: ViewValidatorsArgs): Promise<EpochValidatorInfo>;

    viewTransactionStatus(params: ViewTransactionStatusArgs): Promise<FinalExecutionOutcome>;
    viewTransactionStatusWithReceipts(
        params: ViewTransactionStatusArgs
    ): Promise<FinalExecutionOutcome & Required<Pick<FinalExecutionOutcome, 'receipts'>>>;
    viewTransactionReceipt(receiptId: string): Promise<ExecutionOutcomeReceiptDetail>;

    sendTransactionUntil(
        signedTransaction: SignedTransaction,
        waitUntil: TxExecutionStatus
    ): Promise<FinalExecutionOutcome>;
    sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    sendTransactionAsync(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;

    query<T extends QueryResponseKind>(params: RpcQueryRequest): Promise<T>;
    query<T extends QueryResponseKind>(path: string, data: string): Promise<T>;

    blockChanges(blockQuery: BlockId | BlockReference): Promise<BlockChangeResult>;
    experimental_protocolConfig(
        blockReference: BlockReference | { sync_checkpoint: 'genesis' }
    ): Promise<NearProtocolConfig>;
    lightClientProof(request: LightClientProofRequest): Promise<LightClientProof>;
    nextLightClientBlock(request: NextLightClientBlockRequest): Promise<NextLightClientBlockResponse>;
    accessKeyChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;
    singleAccessKeyChanges(
        accessKeyArray: AccessKeyWithPublicKey[],
        BlockQuery: BlockId | BlockReference
    ): Promise<ChangeResult>;
    accountChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;
    contractStateChanges(
        accountIdArray: string[],
        BlockQuery: BlockId | BlockReference,
        keyPrefix: string
    ): Promise<ChangeResult>;
    contractCodeChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;

    getCurrentEpochSeatPrice(): Promise<bigint>;
    getNextEpochSeatPrice(): Promise<bigint>;
}
