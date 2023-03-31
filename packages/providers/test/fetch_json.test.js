const { fetchJson } = require('../lib');

describe('fetchJson', () => {
    test('string parameter in fetchJson', async () => {
        const RPC_URL = 'https://rpc.testnet.near.org';
        const statusRequest = {
            'jsonrpc': '2.0',
            'id': 'dontcare',
            'method': 'status',
            'params': []
        };
        const result = await fetchJson(RPC_URL, JSON.stringify(statusRequest));
        expect(result.result.chain_id).toBe('testnet');
    });
    test('object parameter in fetchJson', async () => {
        const connection = { url: 'https://rpc.testnet.near.org' };
        const statusRequest = {
            'jsonrpc': '2.0',
            'id': 'dontcare',
            'method': 'status',
            'params': []
        };
        const result = await fetchJson(connection, JSON.stringify(statusRequest));
        expect(result.result.chain_id).toBe('testnet');
    });
});
