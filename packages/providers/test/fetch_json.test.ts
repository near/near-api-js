import { describe, expect, test } from '@jest/globals';
import { fetchJsonRpc } from '../src/fetch_json';

describe('fetchJson', () => {
    test('string parameter in fetchJson', async () => {
        const RPC_URL = 'https://rpc.testnet.near.org';
        const statusRequest = {
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'status',
            params: []
        };
        // @ts-expect-error test input
        const result = await fetchJsonRpc(RPC_URL, statusRequest, undefined);
        expect(result.result.chain_id).toBe('testnet');
    });
    test('object parameter in fetchJson', async () => {
        const connection = { url: 'https://rpc.testnet.near.org' };
        const statusRequest = {
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'status',
            params: []
        };
        // @ts-expect-error test input
        const result = await fetchJsonRpc(connection.url, statusRequest, undefined);
        expect(result.result.chain_id).toBe('testnet');
    });
});
