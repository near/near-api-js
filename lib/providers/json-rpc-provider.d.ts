import { Provider, FinalExecutionOutcome, NodeStatusResult, BlockId, BlockResult, ChunkId, ChunkResult } from './provider';
import { Network } from '../utils/network';
import { ConnectionInfo } from '../utils/web';
import { TypedError } from '../utils/errors';
import { SignedTransaction } from '../transaction';
export { TypedError };
export declare class JsonRpcProvider extends Provider {
    readonly connection: ConnectionInfo;
    constructor(url?: string);
    /**
     * Get the current network (ex. test, beta, etc…)
     * @returns {Promise<Network>}
     */
    getNetwork(): Promise<Network>;
    /**
     * Gets the RPC's status
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#status)
     * @returns {Promise<NodeStatusResult>}
     */
    status(): Promise<NodeStatusResult>;
    /**
     * Sends a signed transaction to the RPC
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#send-transaction-wait-until-done)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    /**
     * Gets a transaction's status from the RPC
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#status)
     * @param txHash The hash of the transaction
     * @param accountId The NEAR account that signed the transaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    txStatus(txHash: Uint8Array, accountId: string): Promise<FinalExecutionOutcome>;
    /**
     * Query the RPC as [shown in the docs](https://docs.nearprotocol.com/docs/interaction/rpc#query)
     * @param path Path parameter for the RPC (ex. "contract/my_token")
     * @param data Data parameter (ex. "", "AQ4", or whatever is needed)
     */
    query(path: string, data: string): Promise<any>;
    /**
     * Query for block info from the RPC
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#block)
     * @param blockId Block hash or height
     * @returns {Promise<BlockResult>}
     */
    block(blockId: BlockId): Promise<BlockResult>;
    /**
     * Queries for details of a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#chunk)
     * @param chunkId Hash of a chunk ID or shard ID
     * @returns {Promise<ChunkResult>}
     */
    chunk(chunkId: ChunkId): Promise<ChunkResult>;
    /**
     * Directly call the RPC specifying the method and params
     * @param method RPC method
     * @param params Parameters to the method
     */
    sendJsonRpc(method: string, params: any[]): Promise<any>;
}
