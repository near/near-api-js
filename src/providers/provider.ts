/**
 * NEAR RPC API request types and responses
 * @module
 */

import type { PublicKey } from '../crypto/index.js';
import type {
    AccessKeyList,
    CallResult,
    CryptoHash,
    RpcBlockResponse,
    RpcChunkResponse,
    RpcGasPriceResponse,
    RpcLightClientExecutionProofResponse,
    RpcLightClientNextBlockResponse,
    RpcProtocolConfigResponse,
    RpcQueryRequest,
    RpcQueryResponse,
    RpcReceiptResponse,
    RpcStateChangesInBlockByTypeResponse,
    RpcStateChangesInBlockResponse,
    RpcStatusResponse,
    RpcTransactionResponse,
    RpcValidatorResponse,
    ViewStateResult,
} from '../rpc/index.js';
import type { SignedTransaction } from '../transactions/index.js';
import type {
    AccessKeyWithPublicKey,
    BlockId,
    BlockReference,
    ChunkId,
    FinalityReference,
    AccessKeyView as InternalAccessKeyView,
    AccountView as InternalAccountView,
    ContractCodeView as InternalContractCodeView,
    LightClientProofRequest,
    NextLightClientBlockRequest,
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

/** @hidden */
export interface Provider {
    getNetworkId(): Promise<string>;

    viewAccessKey(params: ViewAccessKeyArgs): Promise<InternalAccessKeyView>;
    viewAccessKeyList(params: ViewAccessKeyListArgs): Promise<
        AccessKeyList & {
            block_hash: CryptoHash;
            block_height: number;
        }
    >;
    viewAccount(params: ViewAccountArgs): Promise<InternalAccountView>;
    viewContractCode(params: ViewContractCodeArgs): Promise<InternalContractCodeView>;
    viewContractState(params: ViewContractStateArgs): Promise<
        ViewStateResult & {
            block_hash: CryptoHash;
            block_height: number;
        }
    >;
    callFunction<T extends SerializedReturnValue>(params: CallFunctionArgs): Promise<T | undefined>;
    callFunctionRaw(params: CallFunctionArgs): Promise<
        CallResult & {
            block_hash: CryptoHash;
            block_height: number;
        }
    >;

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

    query<R extends Omit<RpcQueryResponse, 'block_hash' | 'block_height'>>(
        params: RpcQueryRequest
    ): Promise<
        R & {
            block_hash: CryptoHash;
            block_height: number;
        }
    >;

    blockChanges(blockQuery: BlockId | BlockReference): Promise<RpcStateChangesInBlockByTypeResponse>;
    experimental_protocolConfig(
        blockReference: BlockReference | { sync_checkpoint: 'genesis' }
    ): Promise<RpcProtocolConfigResponse>;
    lightClientProof(request: LightClientProofRequest): Promise<RpcLightClientExecutionProofResponse>;
    nextLightClientBlock(request: NextLightClientBlockRequest): Promise<RpcLightClientNextBlockResponse>;
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
