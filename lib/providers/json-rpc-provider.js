"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("./provider");
const web_1 = require("../utils/web");
const errors_1 = require("../utils/errors");
exports.TypedError = errors_1.TypedError;
const serialize_1 = require("../utils/serialize");
const rpc_errors_1 = require("../utils/rpc_errors");
/// Keep ids unique across all connections.
let _nextId = 123;
class JsonRpcProvider extends provider_1.Provider {
    constructor(url) {
        super();
        this.connection = { url };
    }
    /**
     * Get the current network (ex. test, beta, etc…)
     * @returns {Promise<Network>}
     */
    async getNetwork() {
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
    async status() {
        return this.sendJsonRpc('status', []);
    }
    /**
     * Sends a signed transaction to the RPC
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#send-transaction-wait-until-done)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async sendTransaction(signedTransaction) {
        const bytes = signedTransaction.encode();
        return this.sendJsonRpc('broadcast_tx_commit', [Buffer.from(bytes).toString('base64')]).then(provider_1.adaptTransactionResult);
    }
    /**
     * Gets a transaction's status from the RPC
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#status)
     * @param txHash The hash of the transaction
     * @param accountId The NEAR account that signed the transaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async txStatus(txHash, accountId) {
        return this.sendJsonRpc('tx', [serialize_1.base_encode(txHash), accountId]).then(provider_1.adaptTransactionResult);
    }
    /**
     * Query the RPC as [shown in the docs](https://docs.nearprotocol.com/docs/interaction/rpc#query)
     * @param path Path parameter for the RPC (ex. "contract/my_token")
     * @param data Data parameter (ex. "", "AQ4", or whatever is needed)
     */
    async query(path, data) {
        const result = await this.sendJsonRpc('query', [path, data]);
        if (result && result.error) {
            throw new Error(`Querying ${path} failed: ${result.error}.\n${JSON.stringify(result, null, 2)}`);
        }
        return result;
    }
    /**
     * Query for block info from the RPC
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#block)
     * @param blockId Block hash or height
     * @returns {Promise<BlockResult>}
     */
    async block(blockId) {
        return this.sendJsonRpc('block', [blockId]);
    }
    /**
     * Queries for details of a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#chunk)
     * @param chunkId Hash of a chunk ID or shard ID
     * @returns {Promise<ChunkResult>}
     */
    async chunk(chunkId) {
        return this.sendJsonRpc('chunk', [chunkId]);
    }
    /**
     * Directly call the RPC specifying the method and params
     * @param method RPC method
     * @param params Parameters to the method
     */
    async sendJsonRpc(method, params) {
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
                else {
                    throw rpc_errors_1.parseRpcError(response.error.data);
                }
            }
            else {
                const errorMessage = `[${response.error.code}] ${response.error.message}: ${response.error.data}`;
                if (errorMessage === '[-32000] Server error: send_tx_commit has timed out.') {
                    throw new errors_1.TypedError('send_tx_commit has timed out.', 'TimeoutError');
                }
                else {
                    throw new errors_1.TypedError(errorMessage);
                }
            }
        }
        return response.result;
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
