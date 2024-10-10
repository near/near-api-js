import { TypedError } from '@near-js/types';
import { backOff } from 'exponential-backoff';
import unfetch from 'isomorphic-unfetch';

const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 10;

const retryConfig = {
    numOfAttempts: RETRY_NUMBER,
    timeMultiple: BACKOFF_MULTIPLIER,
    retry: (e: ProviderError) => {
        if ([500, 408].includes(e.cause)) {
            return true;
        }

        if (['FetchError', 'Failed to fetch'].includes(e.toString())) {
            return true;
        }

        return false;
    }
};

export interface ConnectionInfo {
    url: string;
    headers?: { [key: string]: string | number };
}

class ProviderError extends Error {
    cause: number;
    constructor(message: string, options: any) {
        super(message, options);
    }
}

interface JsonRpcRequest {
    id: number;
    jsonrpc: string;
    method: string;
    params: object;
}

/**
 * Performs an HTTP request to an RPC endpoint
 * @param url URL for the HTTP request
 * @param json Request body
 * @param headers HTTP headers to include with the request
 * @returns Promise<any> }arsed JSON response from the HTTP request.
 */
export async function fetchJsonRpc(url: string, json: JsonRpcRequest, headers: object): Promise<any> {
    const response = await backOff(async () => {
        const res = await unfetch(url, {
            method: 'POST',
            body: JSON.stringify(json),
            headers: { ...headers, 'Content-Type': 'application/json' }
        });

        const { ok, status } = res;
        if (!ok) {
            throw new ProviderError(await res.text(), { cause: status });
        }

        if (status === 500) {
            throw new ProviderError(`Internal server error`, { cause: status });
        } else if (status === 408) {
            throw new ProviderError('Timeout error', { cause: status });
        } else if (status === 400) {
            throw new ProviderError('Request validation error', { cause: status });
        }

        return res;
    }, retryConfig);

    if (!response) {
        throw new TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${url}.`, 'RetriesExceeded');
    }

    return await response.json();
}
