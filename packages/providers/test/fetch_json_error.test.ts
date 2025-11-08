import {
    describe,
    expect,
    test,
    jest,
    beforeEach,
    afterAll,
} from 'bun:test';
import { fetchJsonRpc, retryConfig } from '../src/fetch_json.js';
import { ProviderError } from '../src/fetch_json.js';

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
        jest
            .spyOn(global, 'fetch')
            .mockImplementation(() => Promise.resolve(new Response()));
    });

    afterAll(() => {
        // Restore original fetch
        global.fetch = originalFetch;
    });

    test('handles 500 Internal Server Error', async () => {
        jest
            .spyOn(global, 'fetch')
            .mockImplementation(() =>
                Promise.resolve(new Response('', { status: 500 })),
            );

        await expect(
            fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig()),
        ).rejects.toThrowError(
            new ProviderError('Internal server error', { cause: 500 }),
        );
    });

    test('handles 408 Timeout Error', async () => {
        jest
            .spyOn(global, 'fetch')
            .mockImplementation(() =>
                Promise.resolve(new Response('', { status: 408 })),
            );

        await expect(
            fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig()),
        ).rejects.toThrowError(new ProviderError('Timeout error', { cause: 408 }));
    });

    test('handles 400 Request Validation Error', async () => {
        jest
            .spyOn(global, 'fetch')
            .mockImplementation(() =>
                Promise.resolve(new Response('', { status: 400 })),
            );

        await expect(
            fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig()),
        ).rejects.toThrowError(
            new ProviderError('Request validation error', { cause: 400 }),
        );
    });

    test('handles 503 Service Unavailable', async () => {
        jest
            .spyOn(global, 'fetch')
            .mockImplementation(() =>
                Promise.resolve(new Response('', { status: 503 })),
            );

        await expect(
            fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig()),
        ).rejects.toThrowError(
            new ProviderError(`${RPC_URL} unavailable`, { cause: 503 }),
        );
    });
});
