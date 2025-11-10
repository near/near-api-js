import { describe, expect, test } from 'bun:test';
import { fetchJsonRpc, retryConfig } from '../src/fetch_json.js';

describe('fetchJson', () => {
    test('string parameter in fetchJson', async () => {
        const RPC_URL = 'https://rpc.testnet.near.org';
        const statusRequest = {
            jsonrpc: '2.0',
            id: 1,
            method: 'status',
            params: [],
        };
        const result = await fetchJsonRpc(
            RPC_URL,
            statusRequest,
            undefined,
            retryConfig(),
        );
        expect(result.result.chain_id).toBe('testnet');
    });
    test('object parameter in fetchJson', async () => {
        const connection = { url: 'https://rpc.testnet.near.org' };
        const statusRequest = {
            jsonrpc: '2.0',
            id: 2,
            method: 'status',
            params: [],
        };
        const result = await fetchJsonRpc(
            connection.url,
            statusRequest,
            undefined,
            retryConfig(),
        );
        expect(result.result.chain_id).toBe('testnet');
    });
});
