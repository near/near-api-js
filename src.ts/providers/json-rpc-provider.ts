'use strict';

import { Provider, FinalTransactionResult } from './provider';
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
            name: 'test',
            chainId: 'test'
        };
    }

    async sendTransaction(signedTransaction: SignedTransaction): Promise<FinalTransactionResult> {
        const bytes = SignedTransaction.encode(signedTransaction).finish();
        return this.sendJsonRpc('broadcast_tx_commit', [Buffer.from(bytes).toString('base64')]);
    }

    async txStatus(txHash: Uint8Array): Promise<FinalTransactionResult> {
        return this.sendJsonRpc('tx', [base_encode(txHash)]);
    }

    async query(path: string, data: string): Promise<any> {
        const result = await this.sendJsonRpc('query', [path, data]);
        if (result.error) {
            throw new Error(`Quering ${path} failed: ${result.error}.\n${JSON.stringify(result, null, 2)}`);
        }
        return result;
    }

    private async sendJsonRpc(method: string, params: any[]): Promise<any> {
        const request = {
            method,
            params,
            id: (_nextId++),
            jsonrpc: '2.0'
        };
        const result = await fetchJson(this.connection, JSON.stringify(request));
        if (result.error) {
            throw new Error(`[${result.error.code}] ${result.error.message}: ${result.error.data}`);
        }
        return result.result;
    }
}
