import { Provider, FinalExecutionOutcome, NodeStatusResult, BlockId, BlockReference, BlockResult, ChunkId, ChunkResult, EpochValidatorInfo, NearProtocolConfig, LightClientProof, LightClientProofRequest, GasPrice, QueryResponseKind } from './provider';
import { ConnectionInfo } from '../utils/web';
import { TypedError } from '../utils/errors';
import { ServerError, ServerErrorContext, ServerTransactionError } from '../utils/rpc_errors';
import { SignedTransaction } from '../transaction';
/** @hidden */
export { TypedError, ServerError, ServerErrorContext, ServerTransactionError, };
/**
 * Client class to interact with the NEAR RPC API.
 * @see {@link https://github.com/near/nearcore/tree/master/chain/jsonrpc}
 */
export declare class JsonRpcProvider extends Provider {
    /** @hidden */
    readonly connection: ConnectionInfo;
    /**
     * @param url RPC API endpoint URL
     */
    constructor(url?: string);
    /**
     * Gets the RPC's status
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#general-validator-status}
     */
    status(): Promise<NodeStatusResult>;
    /**
     * Sends a signed transaction to the RPC
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await}
     *
     * @param signedTransaction The signed transaction being sent
     */
    sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    /**
     * Gets a transaction's status from the RPC
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#transaction-status}
     *
     * @param txHash The hash of the transaction
     * @param accountId The NEAR account that signed the transaction
     */
    txStatus(txHash: Uint8Array, accountId: string): Promise<FinalExecutionOutcome>;
    /**
     * Query the RPC by passing an {@link RpcQueryRequest}
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#accounts--contracts}
     *
     * @typeParam T the shape of the returned query response
     */
    query<T extends QueryResponseKind>(...args: any[]): Promise<T>;
    /**
     * Query for block info from the RPC
     * @see {@link https://docs.near.org/docs/interaction/rpc#block}
     *
     * @param blockQuery {@link BlockReference} (passing a {@link BlockId} is deprecated)
     */
    block(blockQuery: BlockId | BlockReference): Promise<BlockResult>;
    /**
     * Queries for details about a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * @see {@link https://docs.near.org/docs/interaction/rpc#chunk}
     *
     * @param chunkId Hash of a chunk ID or shard ID
     */
    chunk(chunkId: ChunkId): Promise<ChunkResult>;
    /**
     * Query validators of the epoch defined by the given block id.
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#detailed-validator-status}
     *
     * @param blockId Block hash or height, or null for latest.
     */
    validators(blockId: BlockId | null): Promise<EpochValidatorInfo>;
    /**
     * @deprecated
     * Gets the genesis config from RPC
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#genesis-config}
     */
    experimental_genesisConfig(): Promise<NearProtocolConfig>;
    /**
     * Gets the protocol config at a block from RPC
     * @see {@link }
     *
     * @param blockReference specifies the block to get the protocol config for
     */
    experimental_protocolConfig(blockReference: BlockReference): Promise<NearProtocolConfig>;
    /**
     * @deprecated Use {@link lightClientProof} instead
     */
    experimental_lightClientProof(request: LightClientProofRequest): Promise<LightClientProof>;
    /**
     * Gets a light client execution proof for verifying execution outcomes
     * @see {@link https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof}
     */
    lightClientProof(request: LightClientProofRequest): Promise<LightClientProof>;
    /**
     * Returns gas price for a specific block_height or block_hash.
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#gas-price}
     *
     * @param blockId Block hash or height, or null for latest.
     */
    gasPrice(blockId: BlockId | null): Promise<GasPrice>;
    /**
     * Directly call the RPC specifying the method and params
     *
     * @param method RPC method
     * @param params Parameters to the method
     */
    sendJsonRpc<T>(method: string, params: object): Promise<T>;
}
