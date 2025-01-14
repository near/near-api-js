import { describe, expect, test, jest, afterEach } from '@jest/globals';
import { fetchJsonRpc, retryConfig } from '../src/fetch_json';
import unfetch from 'isomorphic-unfetch';
import { ProviderError } from '../src/fetch_json'; 

jest.mock('isomorphic-unfetch');

describe('fetchJsonError', () => {
    const RPC_URL = 'https://rpc.testnet.near.org';
    const statusRequest = {
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'status',
        params: [],
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('handles 500 Internal Server Error', async () => {
        (unfetch as jest.Mock).mockReturnValue({
            ok: false,
            status: 500,
            text: '',
            json: {},
        });
    
        // @ts-expect-error test input
        await expect(fetchJsonRpc(RPC_URL, statusRequest, undefined, retryConfig()))
            .rejects
            .toThrowError(new ProviderError('Internal server error', { cause: 500 }));
    });
    test('handles 408 Timeout Error', async () => {
        (unfetch as jest.Mock).mockReturnValue({
            ok: false,
            status: 408,
            text: '',
            json: {},
        });
        // @ts-expect-error test input
        await expect(fetchJsonRpc(RPC_URL, statusRequest, undefined, retryConfig()))
            .rejects
            .toThrowError(new ProviderError('Timeout error', { cause: 408 }));
    });
    // });

    test('handles 400 Request Validation Error', async () => {
        (unfetch as jest.Mock).mockReturnValue({
            ok: false,
            status: 400,
            text: '',
            json: {},
        });
        // @ts-expect-error test input
        await expect(fetchJsonRpc(RPC_URL, statusRequest, undefined, retryConfig()))
            .rejects
            .toThrowError(new ProviderError('Request validation error', { cause: 400 }));
    });

    test('handles 503 Service Unavailable', async () => {
        (unfetch as jest.Mock).mockReturnValue({
            ok: false,
            status: 503,
            text: '',
            json: {},
        });

        // @ts-expect-error test input
        await expect(fetchJsonRpc(RPC_URL, statusRequest, undefined, retryConfig()))
            .rejects
            .toThrowError(new ProviderError(`${RPC_URL} unavailable`, { cause: 503 }));
    });
});
