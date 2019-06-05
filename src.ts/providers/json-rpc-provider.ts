'use strict';

import { Provider, FinalTransactionResult, QueryResult } from './provider';
import { Network } from '../utils/network';
import { ConnectionInfo, fetchJson } from '../utils/web';
import { base_encode } from '../utils/serialize';
import { SignedTransaction } from '../protos';

/// Keep ids unique across all connections.
let _nextId = 123;

export class JsonRpcProvider extends Provider {
    readonly connection: ConnectionInfo;

    constructor(url?: string, network?: Network) {
        super();
        // TODO: resolve network to url...
        
        this.connection = { url };
    }

    async getNetwork(): Promise<Network> {
        return {
            name: "test",
            chainId: "test"
        };
    }

    async sendTransaction(signedTransaction: SignedTransaction): Promise<FinalTransactionResult> {
        let bytes = SignedTransaction.encode(signedTransaction).finish();
        let response = await this.sendJsonRpc("broadcast_tx_commit", [base_encode(bytes)]);
        return JSON.parse(response);
    }

    async query(path: string, data: string): Promise<QueryResult> {
        return (await this.sendJsonRpc("query", [path, data])).result;
    }

    private async sendJsonRpc(method: string, params: any[]): Promise<any> {
        let request = {
            method,
            params,
            id: (_nextId++),
            jsonrpc: "2.0"
        };
        return fetchJson(this.connection, JSON.stringify(request));
    }
}
