import { afterEach, describe, expect, test, vi } from 'vitest';
import { FailoverRpcProvider, JsonRpcProvider } from '../../../src/index.js';
import { fetchJsonRpc, ProviderError, retryConfig } from '../../../src/providers/fetch_json.js';

describe('fetchJsonError', () => {
    const RPC_URL = 'https://rpc.testnet.near.org';
    const statusRequest = {
        jsonrpc: '2.0',
        id: '1',
        method: 'status',
        params: null,
    } as const;

    afterEach(() => vi.restoreAllMocks());

    test('handles 500 Internal Server Error', async () => {
        vi.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve(new Response('', { status: 500 })));

        await expect(fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig())).rejects.toThrowError(
            new ProviderError('Internal server error', { cause: 500 })
        );
    });

    test('handles 408 Timeout Error', async () => {
        vi.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve(new Response('', { status: 408 })));

        await expect(fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig())).rejects.toThrowError(
            new ProviderError('Timeout error', { cause: 408 })
        );
    });

    test('handles 503 Service Unavailable', async () => {
        vi.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve(new Response('', { status: 503 })));

        await expect(fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig())).rejects.toThrowError(
            new ProviderError(`${RPC_URL} unavailable`, { cause: 503 })
        );
    });

    test.each([
        [429, 'Rate limit exceeded'],
        [502, `${RPC_URL} Bad Gateway`],
    ])('handles HTTP %i without retrying', async (status, message) => {
        const fetch = vi.spyOn(global, 'fetch').mockResolvedValue(new Response(message, { status }));

        await expect(fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig())).rejects.toMatchObject({
            name: 'Error',
            message,
            cause: status,
        });
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test.each(['missing RPC result', 'network rejection'])(
        'fails over after %s from a real JsonRpcProvider',
        async (failure) => {
            const fetch = vi.spyOn(global, 'fetch');
            if (failure === 'network rejection') {
                fetch.mockRejectedValueOnce(new TypeError('fetch failed'));
            } else {
                fetch.mockResolvedValueOnce(Response.json({ jsonrpc: '2.0', id: '1' }));
            }
            fetch.mockResolvedValueOnce(Response.json({ jsonrpc: '2.0', id: '2', result: { chain_id: 'second' } }));
            const provider = new FailoverRpcProvider([
                new JsonRpcProvider({ url: 'http://first.test' }, { retries: 1 }),
                new JsonRpcProvider({ url: 'http://second.test' }, { retries: 1 }),
            ]);

            await expect(provider.viewNodeStatus()).resolves.toMatchObject({ chain_id: 'second' });
            expect(fetch).toHaveBeenCalledTimes(2);
            expect(fetch.mock.calls.map(([url]) => url)).toEqual(['http://first.test', 'http://second.test']);
        }
    );
});
