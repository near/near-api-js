import depd from 'depd';
import {
    Provider, FinalExecutionOutcome, NodeStatusResult, BlockId, Finality,
    BlockResult, ChunkId, ChunkResult, EpochValidatorInfo,
    GenesisConfig, LightClientProof, LightClientProofRequest
} from './provider';
import { Network } from '../utils/network';
import { ConnectionInfo, fetchJson } from '../utils/web';
import { TypedError, ErrorContext } from '../utils/errors';
import { baseEncode } from 'borsh';
import { parseRpcError } from '../utils/rpc_errors';
import { SignedTransaction } from '../transaction';

export { TypedError, ErrorContext };

/// Keep ids unique across all connections.
let _nextId = 123;

export class JsonRpcProvider extends Provider {
    readonly connection: ConnectionInfo;

    constructor(url?: string) {
        super();
        this.connection = { url };
    }

    /**
     * Get the current network (ex. test, beta, etc…)
     * @returns {Promise<Network>}
     */
    async getNetwork(): Promise<Network> {
        return {
            name: 'test',
            chainId: 'test'
        };
    }

    /**
     * Gets the RPC's status
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#status)
     * @returns {Promise<NodeStatusResult>}
     */
    async status(): Promise<NodeStatusResult> {
        return this.sendJsonRpc('status', []);
    }

    /**
     * Sends a signed transaction to the RPC
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#send-transaction-wait-until-done)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome> {
        const bytes = signedTransaction.encode();
        return this.sendJsonRpc('broadcast_tx_commit', [Buffer.from(bytes).toString('base64')]);
    }

    /**
     * Gets a transaction's status from the RPC
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#status)
     * @param txHash The hash of the transaction
     * @param accountId The NEAR account that signed the transaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async txStatus(txHash: Uint8Array, accountId: string): Promise<FinalExecutionOutcome> {
        return this.sendJsonRpc('tx', [baseEncode(txHash), accountId]);
    }

    /**
     * Query the RPC as [shown in the docs](https://docs.nearprotocol.com/docs/interaction/rpc#query)
     */
    async query(...args: any[]): Promise<any> {
        let result;
        if (args.length === 1) {
            result = await this.sendJsonRpc('query', args[0]);
        } else {
            const [path, data] = args;
            result = await this.sendJsonRpc('query', [path, data]);
        }
        if (result && result.error) {
            throw new Error(`Querying ${args} failed: ${result.error}.\n${JSON.stringify(result, null, 2)}`);
        }
        return result;
    }

    /**
     * Query for block info from the RPC
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#block)
     */
    async block(blockQuery: BlockId | { blockId: BlockId } | { finality: Finality }): Promise<BlockResult> {
        const { finality } = blockQuery as any;
        let { blockId } = blockQuery as any;

        if (typeof blockQuery !== 'object') {
            const deprecate = depd('JsonRpcProvider.block(blockId)');
            deprecate('use `block({ blockId })` or `block({ finality })` instead');
            blockId = blockQuery;
        }

        return this.sendJsonRpc('block', { block_id: blockId, finality });
    }

    /**
     * Queries for details of a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#chunk)
     * @param chunkId Hash of a chunk ID or shard ID
     * @returns {Promise<ChunkResult>}
     */
    async chunk(chunkId: ChunkId): Promise<ChunkResult> {
        return this.sendJsonRpc('chunk', [chunkId]);
    }

    /**
     * Query validators of the epoch defined by given block id.
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#validators)
     * @param blockId Block hash or height, or null for latest.
     */
    async validators(blockId: BlockId | null): Promise<EpochValidatorInfo> {
        return this.sendJsonRpc('validators', [blockId]);
    }

    /**
     * Gets EXPERIMENTAL_genesis_config from RPC
     * @returns {Promise<GenesisConfig>}
     */
    async experimental_genesisConfig(): Promise<GenesisConfig> {
        return await this.sendJsonRpc('EXPERIMENTAL_genesis_config', []);
    }

    /**
     * Gets light_client_proof from RPC (https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     * @returns {Promise<LightClientProof>}
     * @deprecated Use `lightClientProof` instead
     */
    async experimental_lightClientProof(request: LightClientProofRequest): Promise<LightClientProof> {
        const deprecate = depd('JsonRpcProvider.experimental_lightClientProof(request)');
        deprecate('use `lightClientProof` instead');
        return await this.lightClientProof(request);
    }

    /**
     * Gets light_client_proof from RPC (https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     * @returns {Promise<LightClientProof>}
     */
    async lightClientProof(request: LightClientProofRequest): Promise<LightClientProof> {
        return await this.sendJsonRpc('EXPERIMENTAL_light_client_proof', request);
    }

    /**
     * Directly call the RPC specifying the method and params
     * @param method RPC method
     * @param params Parameters to the method
     */
    async sendJsonRpc(method: string, params: object): Promise<any> {
        const request = {
            method,
            params,
            id: (_nextId++),
            jsonrpc: '2.0'
        };
        const response = await fetchJson(this.connection, JSON.stringify(request));
        if (response.error) {
            if (typeof response.error.data === 'object') {
                if (typeof response.error.data.error_message === 'string' && typeof response.error.data.error_type === 'string') {
                    // if error data has error_message and error_type properties, we consider that node returned an error in the old format
                    throw new TypedError(response.error.data.error_message, response.error.data.error_type);
                } else {
                    throw parseRpcError(response.error.data);
                }
            } else {
                const errorMessage = `[${response.error.code}] ${response.error.message}: ${response.error.data}`;
                // NOTE: All this hackery is happening because structured errors not implemented
                // TODO: Fix when https://github.com/nearprotocol/nearcore/issues/1839 gets resolved
                if (response.error.data === 'Timeout' || errorMessage.includes('Timeout error')) {
                    throw new TypedError('send_tx_commit has timed out.', 'TimeoutError');
                } else {
                    throw new TypedError(errorMessage);
                }
            }
        }
        return response.result;
    }
}
