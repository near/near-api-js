import { describe, expect, test } from 'vitest';
import { fetchJsonRpc, retryConfig } from '../../../src/providers/fetch_json.js';

describe('fetchJson', () => {
    test('string parameter in fetchJson', async () => {
        const RPC_URL = 'https://rpc.testnet.near.org';
        const statusRequest = {
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'status',
            params: null,
        } as const;
        const result = await fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig());
        // @ts-expect-error result must exist
        expect(result.result.chain_id).toBe('testnet');
    });
    test('object parameter in fetchJson', async () => {
        const connection = { url: 'https://rpc.testnet.near.org' };
        const statusRequest = {
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'status',
            params: null,
        } as const;
        const result = await fetchJsonRpc(connection.url, statusRequest, {}, retryConfig());
        // @ts-expect-error result must exist
        expect(result.result.chain_id).toBe('testnet');
    });
});
