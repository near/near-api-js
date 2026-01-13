import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { fetchJsonRpc, ProviderError, retryConfig } from '../../../src/providers/fetch_json';

describe('fetchJsonError', () => {
    const RPC_URL = 'https://rpc.testnet.near.org';
    const statusRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'status',
        params: [],
    };

    // Store original fetch
    const originalFetch = global.fetch;

    beforeEach(() => {
        // Reset fetch for each test with proper typing
        vi.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve(new Response()));
    });

    afterAll(() => {
        // Restore original fetch
        global.fetch = originalFetch;
    });

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
});
