'use strict';
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
    constructor(url, network) {
        super();
        // TODO: resolve network to url...
        this.connection = { url };
    }
    async getNetwork() {
        return {
            name: 'test',
            chainId: 'test'
        };
    }
    async status() {
        return this.sendJsonRpc('status', []);
    }
    async sendTransaction(signedTransaction) {
        const bytes = signedTransaction.encode();
        return this.sendJsonRpc('broadcast_tx_commit', [Buffer.from(bytes).toString('base64')]).then(provider_1.adaptTransactionResult);
    }
    async txStatus(txHash, accountId) {
        return this.sendJsonRpc('tx', [serialize_1.base_encode(txHash), accountId]).then(provider_1.adaptTransactionResult);
    }
    async query(path, data) {
        const result = await this.sendJsonRpc('query', [path, data]);
        if (result && result.error) {
            throw new Error(`Querying ${path} failed: ${result.error}.\n${JSON.stringify(result, null, 2)}`);
        }
        return result;
    }
    async block(blockId) {
        return this.sendJsonRpc('block', [blockId]);
    }
    async chunk(chunkId) {
        return this.sendJsonRpc('chunk', [chunkId]);
    }
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
                    // overwise we need to transform the new format into the old one for a transition period
                    throw rpc_errors_1.parseIntoOldTypedError(response.error.data);
                    // later we'll use this to parse and throw an error in the new format
                    // throw parseRpcError(response.error.data);
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
