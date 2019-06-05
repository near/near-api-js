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
            name: "test",
            chainId: "test"
        };
    }
    async sendTransaction(signedTransaction) {
        let bytes = Buffer.from(signedTransaction.serializeBinary());
        let response = await this.sendJsonRpc("broadcast_tx_commit", [serialize_1.base_encode(bytes)]);
        return JSON.parse(response);
    }
    async query(path, data) {
        return this.sendJsonRpc("query", [path, data]);
    }
    async sendJsonRpc(method, params) {
        let request = {
            method,
            params,
            id: (_nextId++),
            jsonrpc: "2.0"
        };
        return web_1.fetchJson(this.connection, JSON.stringify(request));
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
