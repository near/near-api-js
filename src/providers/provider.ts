/**
 * NEAR RPC API request types and responses
 * @module
 */

import type { PublicKey } from '../crypto/index.js';
import type { SignedTransaction } from '../transactions/index.js';
import type {
    AccessKeyWithPublicKey,
    BlockId,
    BlockReference,
    ChunkId,
    FinalityReference,
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

export type ViewValidatorsArgs = { blockId: BlockId } | { epochId: string };

export type ViewTransactionStatusArgs = Prettify<
    {
        txHash: Uint8Array | string;
        accountId: string;
    } & TransactionExecutionReference
>;

import type {
    AccessKeyList,
    AccessKeyView,
    AccountView,
    CallResult,
    ContractCodeView,
    QueryRequest,
    RpcBlockResponse,
    RpcChunkResponse,
    RpcGasPriceResponse,
    RpcLightClientExecutionProofRequest,
    RpcLightClientExecutionProofResponse,
    RpcLightClientNextBlockRequest,
    RpcLightClientNextBlockResponse,
    RpcProtocolConfigResponse,
    RpcQueryResponse,
    RpcReceiptResponse,
    RpcStateChangesInBlockByTypeResponse,
    RpcStateChangesInBlockResponse,
    RpcStatusResponse,
    RpcTransactionResponse,
    RpcValidatorResponse,
    ViewStateResult,
} from '@near-js/jsonrpc-types';

export type StripKeys<T, K extends string> = T extends any ? Omit<T, K> : never;

/** @hidden */
export interface Provider {
    getNetworkId(): Promise<string>;

    viewAccessKey(params: ViewAccessKeyArgs): Promise<AccessKeyView>;
    viewAccessKeyList(params: ViewAccessKeyListArgs): Promise<AccessKeyList>;
    viewAccount(params: ViewAccountArgs): Promise<AccountView>;
    viewContractCode(params: ViewContractCodeArgs): Promise<ContractCodeView>;
    viewContractState(params: ViewContractStateArgs): Promise<ViewStateResult>;
    callFunction<T extends SerializedReturnValue>(params: CallFunctionArgs): Promise<T | undefined>;
    callFunctionRaw(params: CallFunctionArgs): Promise<CallResult>;

    viewBlock(blockQuery: BlockReference): Promise<RpcBlockResponse>;
    viewChunk(chunkId: ChunkId): Promise<RpcChunkResponse>;

    viewGasPrice(blockId?: BlockId): Promise<RpcGasPriceResponse>;

    viewNodeStatus(): Promise<RpcStatusResponse>;
    viewValidators(params?: ViewValidatorsArgs): Promise<RpcValidatorResponse>;

    viewTransactionStatus(params: ViewTransactionStatusArgs): Promise<RpcTransactionResponse>;
    viewTransactionStatusWithReceipts(params: ViewTransactionStatusArgs): Promise<RpcTransactionResponse>;
    viewTransactionReceipt(receiptId: string): Promise<RpcReceiptResponse>;

    sendTransactionUntil(
        signedTransaction: SignedTransaction,
        waitUntil: TxExecutionStatus
    ): Promise<RpcTransactionResponse>;
    sendTransaction(signedTransaction: SignedTransaction): Promise<RpcTransactionResponse>;
    sendTransactionAsync(signedTransaction: SignedTransaction): Promise<RpcTransactionResponse>;

    query<R extends StripKeys<RpcQueryResponse, 'blockHash' | 'blockHeight'>>(
        params: QueryRequest['params']
    ): Promise<R & { blockHash: string; blockHeight: number }>;
    query<R extends StripKeys<RpcQueryResponse, 'blockHash' | 'blockHeight'>>(
        path: string,
        data: string
    ): Promise<R & { blockHash: string; blockHeight: number }>;

    blockChanges(blockQuery: BlockId | BlockReference): Promise<RpcStateChangesInBlockByTypeResponse>;
    experimental_protocolConfig(
        blockReference: BlockReference | { syncCheckpoint: 'genesis' }
    ): Promise<RpcProtocolConfigResponse>;
    lightClientProof(request: RpcLightClientExecutionProofRequest): Promise<RpcLightClientExecutionProofResponse>;
    nextLightClientBlock(request: RpcLightClientNextBlockRequest): Promise<RpcLightClientNextBlockResponse>;
    accessKeyChanges(
        accountIdArray: string[],
        BlockQuery: BlockId | BlockReference
    ): Promise<RpcStateChangesInBlockResponse>;
    singleAccessKeyChanges(
        accessKeyArray: AccessKeyWithPublicKey[],
        BlockQuery: BlockId | BlockReference
    ): Promise<RpcStateChangesInBlockResponse>;
    accountChanges(
        accountIdArray: string[],
        BlockQuery: BlockId | BlockReference
    ): Promise<RpcStateChangesInBlockResponse>;
    contractStateChanges(
        accountIdArray: string[],
        BlockQuery: BlockId | BlockReference,
        keyPrefix: string
    ): Promise<RpcStateChangesInBlockResponse>;
    contractCodeChanges(
        accountIdArray: string[],
        BlockQuery: BlockId | BlockReference
    ): Promise<RpcStateChangesInBlockResponse>;

    getCurrentEpochSeatPrice(): Promise<bigint>;
    getNextEpochSeatPrice(): Promise<bigint>;
}
