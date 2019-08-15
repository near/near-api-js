'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("./provider");
const web_1 = require("../utils/web");
const serialize_1 = require("../utils/serialize");
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
        return this.sendJsonRpc('broadcast_tx_commit', [Buffer.from(bytes).toString('base64')]);
    }
    async txStatus(txHash) {
        return this.sendJsonRpc('tx', [serialize_1.base_encode(txHash)]);
    }
    async query(path, data) {
        const result = await this.sendJsonRpc('query', [path, data]);
        if (result.error) {
            throw new Error(`Quering ${path} failed: ${result.error}.\n${JSON.stringify(result, null, 2)}`);
        }
        return result;
    }
    async block(height) {
        return this.sendJsonRpc('block', [height]);
    }
    async sendJsonRpc(method, params) {
        const request = {
            method,
            params,
            id: (_nextId++),
            jsonrpc: '2.0'
        };
        const result = await web_1.fetchJson(this.connection, JSON.stringify(request));
        if (result.error) {
            throw new Error(`[${result.error.code}] ${result.error.message}: ${result.error.data}`);
        }
        return result.result;
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
