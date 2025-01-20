import { describe, expect, test } from '@jest/globals';
import { fetchJsonRpc, retryConfig } from '../src/fetch_json';
import { ProviderError } from '../src/fetch_json'; 
import fetchMock from '@fetch-mock/jest';

describe('fetchJsonError', () => {
    const RPC_URL = 'https://rpc.testnet.near.org';
    const statusRequest = {
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'status',
        params: [],
    };

    test('handles 500 Internal Server Error', async () => {
        fetchMock.once(RPC_URL, 500, '');
    
        // @ts-expect-error test input
        await expect(fetchJsonRpc(RPC_URL, statusRequest, undefined, retryConfig()))
            .rejects
            .toThrowError(new ProviderError('Internal server error', { cause: 500 }));
    });
    test('handles 408 Timeout Error', async () => {
        fetchMock.once(RPC_URL, 408, '');
        // @ts-expect-error test input
        await expect(fetchJsonRpc(RPC_URL, statusRequest, undefined, retryConfig()))
            .rejects
            .toThrowError(new ProviderError('Timeout error', { cause: 408 }));
    });
    // });

    test('handles 400 Request Validation Error', async () => {
        fetchMock.once(RPC_URL, 400, '');
        // @ts-expect-error test input
        await expect(fetchJsonRpc(RPC_URL, statusRequest, undefined, retryConfig()))
            .rejects
            .toThrowError(new ProviderError('Request validation error', { cause: 400 }));
    });

    test('handles 503 Service Unavailable', async () => {
        fetchMock.once(RPC_URL, 503, '');

        // @ts-expect-error test input
        await expect(fetchJsonRpc(RPC_URL, statusRequest, undefined, retryConfig()))
            .rejects
            .toThrowError(new ProviderError(`${RPC_URL} unavailable`, { cause: 503 }));
    });
});
