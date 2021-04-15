"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcProvider = exports.ErrorContext = exports.TypedError = void 0;
/**
 * This module contains the {@link JsonRpcProvider} client class
 * which can be used to interact with the NEAR RPC API.
 * @see {@link providers/provider} for a list of request and response types
 */
const depd_1 = __importDefault(require("depd"));
const provider_1 = require("./provider");
const web_1 = require("../utils/web");
const errors_1 = require("../utils/errors");
Object.defineProperty(exports, "TypedError", { enumerable: true, get: function () { return errors_1.TypedError; } });
Object.defineProperty(exports, "ErrorContext", { enumerable: true, get: function () { return errors_1.ErrorContext; } });
const borsh_1 = require("borsh");
const exponential_backoff_1 = __importDefault(require("../utils/exponential-backoff"));
const rpc_errors_1 = require("../utils/rpc_errors");
// Default number of retries before giving up on a request.
const REQUEST_RETRY_NUMBER = 12;
// Default wait until next retry in millis.
const REQUEST_RETRY_WAIT = 500;
// Exponential back off for waiting to retry.
const REQUEST_RETRY_WAIT_BACKOFF = 1.5;
/// Keep ids unique across all connections.
let _nextId = 123;
/**
 * Client class to interact with the NEAR RPC API.
 * @see {@link https://github.com/near/nearcore/tree/master/chain/jsonrpc}
 */
class JsonRpcProvider extends provider_1.Provider {
    /**
     * @param url RPC API endpoint URL
     */
    constructor(url) {
        super();
        this.connection = { url };
    }
    /**
     * Gets the RPC's status
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#general-validator-status}
     */
    async status() {
        return this.sendJsonRpc('status', []);
    }
    /**
     * Sends a signed transaction to the RPC
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await}
     *
     * @param signedTransaction The signed transaction being sent
     */
    async sendTransaction(signedTransaction) {
        const bytes = signedTransaction.encode();
        return this.sendJsonRpc('broadcast_tx_commit', [Buffer.from(bytes).toString('base64')]);
    }
    /**
     * Gets a transaction's status from the RPC
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#transaction-status}
     *
     * @param txHash The hash of the transaction
     * @param accountId The NEAR account that signed the transaction
     */
    async txStatus(txHash, accountId) {
        return this.sendJsonRpc('tx', [borsh_1.baseEncode(txHash), accountId]);
    }
    /**
     * Query the RPC by passing an {@link RpcQueryRequest}
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#accounts--contracts}
     *
     * @typeParam T the shape of the returned query response
     */
    async query(...args) {
        let result;
        if (args.length === 1) {
            result = await this.sendJsonRpc('query', args[0]);
        }
        else {
            const [path, data] = args;
            result = await this.sendJsonRpc('query', [path, data]);
        }
        if (result && result.error) {
            throw new errors_1.TypedError(`Querying ${args} failed: ${result.error}.\n${JSON.stringify(result, null, 2)}`, rpc_errors_1.getErrorTypeFromErrorMessage(result.error));
        }
        return result;
    }
    /**
     * Query for block info from the RPC
     * @see {@link https://docs.near.org/docs/interaction/rpc#block}
     *
     * @param blockQuery {@link BlockReference} (passing a {@link BlockId} is deprecated)
     */
    async block(blockQuery) {
        const { finality } = blockQuery;
        let { blockId } = blockQuery;
        if (typeof blockQuery !== 'object') {
            const deprecate = depd_1.default('JsonRpcProvider.block(blockId)');
            deprecate('use `block({ blockId })` or `block({ finality })` instead');
            blockId = blockQuery;
        }
        return this.sendJsonRpc('block', { block_id: blockId, finality });
    }
    /**
     * Queries for details about a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * @see {@link https://docs.near.org/docs/interaction/rpc#chunk}
     *
     * @param chunkId Hash of a chunk ID or shard ID
     */
    async chunk(chunkId) {
        return this.sendJsonRpc('chunk', [chunkId]);
    }
    /**
     * Query validators of the epoch defined by the given block id.
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#detailed-validator-status}
     *
     * @param blockId Block hash or height, or null for latest.
     */
    async validators(blockId) {
        return this.sendJsonRpc('validators', [blockId]);
    }
    /**
     * @deprecated
     * Gets the genesis config from RPC
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#genesis-config}
     */
    async experimental_genesisConfig() {
        const deprecate = depd_1.default('JsonRpcProvider.experimental_protocolConfig({ sync_checkpoint: \'genesis\' })');
        deprecate('use `experimental_protocolConfig` to fetch the up-to-date or genesis protocol config explicitly');
        return await this.sendJsonRpc('EXPERIMENTAL_protocol_config', { sync_checkpoint: 'genesis' });
    }
    /**
     * Gets the protocol config at a block from RPC
     * @see {@link }
     *
     * @param blockReference specifies the block to get the protocol config for
     */
    async experimental_protocolConfig(blockReference) {
        return await this.sendJsonRpc('EXPERIMENTAL_protocol_config', blockReference);
    }
    /**
     * @deprecated Use {@link lightClientProof} instead
     */
    async experimental_lightClientProof(request) {
        const deprecate = depd_1.default('JsonRpcProvider.experimental_lightClientProof(request)');
        deprecate('use `lightClientProof` instead');
        return await this.lightClientProof(request);
    }
    /**
     * Gets a light client execution proof for verifying execution outcomes
     * @see {@link https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof}
     */
    async lightClientProof(request) {
        return await this.sendJsonRpc('EXPERIMENTAL_light_client_proof', request);
    }
    /**
     * Returns gas price for a specific block_height or block_hash.
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#gas-price}
     *
     * @param blockId Block hash or height, or null for latest.
     */
    async gasPrice(blockId) {
        return await this.sendJsonRpc('gas_price', [blockId]);
    }
    /**
     * Directly call the RPC specifying the method and params
     *
     * @param method RPC method
     * @param params Parameters to the method
     */
    async sendJsonRpc(method, params) {
        const result = await exponential_backoff_1.default(REQUEST_RETRY_WAIT, REQUEST_RETRY_NUMBER, REQUEST_RETRY_WAIT_BACKOFF, async () => {
            try {
                const request = {
                    method,
                    params,
                    id: (_nextId++),
                    jsonrpc: '2.0'
                };
                const response = await web_1.fetchJson(this.connection, JSON.stringify(request));
                if (response.error) {
                    if (typeof response.error.data === 'object') {
                        if (typeof response.error.data.error_message === 'string' && typeof response.error.data.error_type === 'string') {
                            // if error data has error_message and error_type properties, we consider that node returned an error in the old format
                            throw new errors_1.TypedError(response.error.data.error_message, response.error.data.error_type);
                        }
                        throw rpc_errors_1.parseRpcError(response.error.data);
                    }
                    else {
                        const errorMessage = `[${response.error.code}] ${response.error.message}: ${response.error.data}`;
                        // NOTE: All this hackery is happening because structured errors not implemented
                        // TODO: Fix when https://github.com/nearprotocol/nearcore/issues/1839 gets resolved
                        if (response.error.data === 'Timeout' || errorMessage.includes('Timeout error')
                            || errorMessage.includes('query has timed out')) {
                            throw new errors_1.TypedError(errorMessage, 'TimeoutError');
                        }
                        throw new errors_1.TypedError(errorMessage, rpc_errors_1.getErrorTypeFromErrorMessage(response.error.data));
                    }
                }
                return response.result;
            }
            catch (error) {
                if (error.type === 'TimeoutError') {
                    console.warn(`Retrying request to ${method} as it has timed out`, params);
                    return null;
                }
                throw error;
            }
        });
        if (!result) {
            throw new errors_1.TypedError(`Exceeded ${REQUEST_RETRY_NUMBER} attempts for request to ${method}.`, 'RetriesExceeded');
        }
        return result;
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
