import { Provider, FinalExecutionOutcome, NodeStatusResult, BlockId, Finality, BlockResult, ChunkId, ChunkResult, EpochValidatorInfo, GenesisConfig, LightClientProof, LightClientProofRequest } from './provider';
import { Network } from '../utils/network';
import { ConnectionInfo } from '../utils/web';
import { TypedError, ErrorContext } from '../utils/errors';
import { SignedTransaction } from '../transaction';
export { TypedError, ErrorContext };
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
     */
    query(...args: any[]): Promise<any>;
    /**
     * Query for block info from the RPC
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#block)
     */
    block(blockQuery: BlockId | {
        blockId: BlockId;
    } | {
        finality: Finality;
    }): Promise<BlockResult>;
    /**
     * Queries for details of a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#chunk)
     * @param chunkId Hash of a chunk ID or shard ID
     * @returns {Promise<ChunkResult>}
     */
    chunk(chunkId: ChunkId): Promise<ChunkResult>;
    /**
     * Query validators of the epoch defined by given block id.
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#validators)
     * @param blockId Block hash or height, or null for latest.
     */
    validators(blockId: BlockId | null): Promise<EpochValidatorInfo>;
    /**
     * Gets EXPERIMENTAL_genesis_config from RPC
     * @returns {Promise<GenesisConfig>}
     */
    experimental_genesisConfig(): Promise<GenesisConfig>;
    /**
     * Gets light_client_proof from RPC (https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     * @returns {Promise<LightClientProof>}
     * @deprecated Use `lightClientProof` instead
     */
    experimental_lightClientProof(request: LightClientProofRequest): Promise<LightClientProof>;
    /**
     * Gets light_client_proof from RPC (https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     * @returns {Promise<LightClientProof>}
     */
    lightClientProof(request: LightClientProofRequest): Promise<LightClientProof>;
    /**
     * Directly call the RPC specifying the method and params
     * @param method RPC method
     * @param params Parameters to the method
     */
    sendJsonRpc(method: string, params: object): Promise<any>;
}
