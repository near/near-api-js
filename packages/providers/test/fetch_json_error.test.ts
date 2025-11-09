import { afterEach, beforeEach, describe, expect, jest, test } from 'bun:test';
import { fetchJsonRpc, ProviderError, retryConfig } from '../src/fetch_json.js';

describe('fetchJsonError', () => {
    const RPC_URL = 'https://rpc.testnet.near.org';
    const statusRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'status',
        params: [],
    };
    let fetchSpy: ReturnType<typeof jest.spyOn<typeof globalThis, 'fetch'>>;

    beforeEach(() => {
        // Reset fetch for each test with proper typing
        fetchSpy = jest
            .spyOn(global, 'fetch')
            .mockResolvedValue(new Response());
    });

    afterEach(() => {
        fetchSpy.mockRestore();
    });

    test('handles 500 Internal Server Error', async () => {
        // Return a new Response each time to avoid "Body already used" error during retries
        fetchSpy.mockImplementation(() =>
            Promise.resolve(new Response('', { status: 500 })),
        );

        await expect(
            fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig()),
        ).rejects.toThrowError(
            new ProviderError('Internal server error', { cause: 500 }),
        );
    });

    test('handles 408 Timeout Error', async () => {
        // Return a new Response each time to avoid "Body already used" error during retries
        fetchSpy.mockImplementation(() =>
            Promise.resolve(new Response('', { status: 408 })),
        );

        await expect(
            fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig()),
        ).rejects.toThrowError(
            new ProviderError('Timeout error', { cause: 408 }),
        );
    });

    test('handles 400 Request Validation Error', async () => {
        fetchSpy.mockResolvedValue(new Response('', { status: 400 }));

        await expect(
            fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig()),
        ).rejects.toThrowError(
            new ProviderError('Request validation error', { cause: 400 }),
        );
    });

    test('handles 503 Service Unavailable', async () => {
        // Return a new Response each time to avoid "Body already used" error during retries
        fetchSpy.mockImplementation(() =>
            Promise.resolve(new Response('', { status: 503 })),
        );

        await expect(
            fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig()),
        ).rejects.toThrowError(
            new ProviderError(`${RPC_URL} unavailable`, { cause: 503 }),
        );
    });
});
