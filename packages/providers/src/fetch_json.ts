import { TypedError } from '@near-js/types';
import { backOff } from 'exponential-backoff';
import unfetch from 'isomorphic-unfetch';

const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 10;
const RETRY_DELAY = 0;

export function retryConfig(numOfAttempts=RETRY_NUMBER, timeMultiple=BACKOFF_MULTIPLIER, startingDelay=RETRY_DELAY) {
    return {
        numOfAttempts: numOfAttempts,
        timeMultiple: timeMultiple,
        startingDelay: startingDelay,
        retry: (e: ProviderError) => {
            if ([503, 500, 408].includes(e.cause)) {
                return true;
            }

            if (e.toString().includes('FetchError') || e.toString().includes('Failed to fetch')) {
                return true;
            }

            return false;
        }
    };
}

export interface ConnectionInfo {
    url: string;
    headers?: { [key: string]: string | number };
}

export class ProviderError extends Error {
    cause: number;
    constructor(message: string, options: any) {
        super(message, options);
        if (options.cause) {
            this.cause = options.cause;
        }
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
export async function fetchJsonRpc(url: string, json: JsonRpcRequest, headers: object, retryConfig: object): Promise<any> {
    const response = await backOff(async () => {
        const res = await unfetch(url, {
            method: 'POST',
            body: JSON.stringify(json),
            headers: { ...headers, 'Content-Type': 'application/json' }
        });

        const { ok, status } = res;

        if (status === 500) {
            throw new ProviderError('Internal server error', { cause: status });
        } else if (status === 408) {
            throw new ProviderError('Timeout error', { cause: status });
        } else if (status === 400) {
            throw new ProviderError('Request validation error', { cause: status });
        } else if (status === 503) {
            throw new ProviderError(`${url} unavailable`, { cause: status });
        }

        if (!ok) {
            throw new ProviderError(await res.text(), { cause: status });
        }

        return res;
    }, retryConfig);

    if (!response) {
        throw new TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${url}.`, 'RetriesExceeded');
    }

    return await response.json();
}
