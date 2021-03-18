import { AccessKeyWithPublicKey, Provider, FinalExecutionOutcome, NodeStatusResult, BlockId, BlockReference, BlockResult, BlockChangeResult, ChangeResult, ChunkId, ChunkResult, EpochValidatorInfo, NearProtocolConfig, LightClientProof, LightClientProofRequest, GasPrice } from './provider';
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
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     * @returns {Promise<NodeStatusResult>}
     */
    status(): Promise<NodeStatusResult>;
    /**
     * Sends a signed transaction to the RPC and waits until transaction is fully complete
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    /**
     * Sends a signed transaction to the RPC and immediately returns transaction hash
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-async)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    sendTransactionAsync(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    /**
     * Gets a transaction's status from the RPC
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#transaction-status)
     * @param txHash The hash of the transaction
     * @param accountId The NEAR account that signed the transaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    txStatus(txHash: Uint8Array, accountId: string): Promise<FinalExecutionOutcome>;
    /**
     * Gets a transaction's status from the RPC with receipts
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#transaction-status-with-receipts)
     * @param txHash The hash of the transaction
     * @param accountId The NEAR account that signed the transaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    txStatusReceipts(txHash: Uint8Array, accountId: string): Promise<FinalExecutionOutcome>;
    /**
     * Query the RPC as [shown in the docs](https://docs.near.org/docs/develop/front-end/rpc#accounts--contracts)
     */
    query(...args: any[]): Promise<any>;
    /**
     * Query for block info from the RPC
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/interaction/rpc#block)
     */
    block(blockQuery: BlockId | BlockReference): Promise<BlockResult>;
    /**
     * Query changes in block from the RPC
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#block-details)
     */
    blockChanges(blockQuery: BlockReference): Promise<BlockChangeResult>;
    /**
     * Queries for details of a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * See [docs for more info](https://docs.near.org/docs/interaction/rpc#chunk)
     * @param chunkId Hash of a chunk ID or shard ID
     * @returns {Promise<ChunkResult>}
     */
    chunk(chunkId: ChunkId): Promise<ChunkResult>;
    /**
     * Query validators of the epoch defined by given block id.
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#detailed-validator-status)
     * @param blockId Block hash or height, or null for latest.
     */
    validators(blockId: BlockId | null): Promise<EpochValidatorInfo>;
    /**
     * Gets EXPERIMENTAL_genesis_config from RPC
     * @returns {Promise<NearProtocolConfig>}
     */
    experimental_genesisConfig(): Promise<NearProtocolConfig>;
    /**
     * Gets EXPERIMENTAL_protocol_config from RPC
     * @returns {Promise<NearProtocolConfig>}
     */
    experimental_protocolConfig(blockReference: BlockReference): Promise<NearProtocolConfig>;
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
     * Gets access key changes for a given array of accountIds
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-all)
     * @returns {Promise<ChangeResult>}
     */
    accessKeyChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult>;
    /**
     * Gets single access key changes for a given array of access keys
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-single)
     * @returns {Promise<ChangeResult>}
     */
    singleAccessKeyChanges(accessKeyArray: AccessKeyWithPublicKey[], blockQuery: BlockReference): Promise<ChangeResult>;
    /**
     * Gets account changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-account-changes)
     * @returns {Promise<ChangeResult>}
     */
    accountChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult>;
    /**
     * Gets contract state changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: If you pass a keyPrefix it must be base64 encoded
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-state-changes)
     * @returns {Promise<ChangeResult>}
     */
    contractStateChanges(accountIdArray: string[], blockQuery: BlockReference, keyPrefix?: string): Promise<ChangeResult>;
    /**
     * Gets contract code changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: Change is returned in a base64 encoded WASM file
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-code-changes)
     * @returns {Promise<ChangeResult>}
     */
    contractCodeChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult>;
    /**
     * Directly call the RPC specifying the method and params
     * @param method RPC method
     * @param params Parameters to the method
     */
    sendJsonRpc(method: string, params: object): Promise<any>;
    /**
     * Returns gas price for a specific block_height or block_hash.
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#gas-price)
     * @param blockId Block hash or height, or null for latest.
     */
    gasPrice(blockId: BlockId | null): Promise<GasPrice>;
}
