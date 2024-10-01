import { TypedError } from '@near-js/types';
import { exponentialBackoff } from './exponential-backoff.js';
import unfetch from 'isomorphic-unfetch';

const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 10;

const retryConfig = {
    numOfAttempts: RETRY_NUMBER,
    timeMultiple: BACKOFF_MULTIPLIER,
    retry: (e: ProviderError) => {
        if ([503, 408].includes(e.cause)) {
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
    constructor(message: string) {
        super(message);
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
    const response = await exponentialBackoff(async () => {
        const res = await unfetch(url, {
            method: 'POST',
            body: JSON.stringify(json),
            headers: { ...headers, 'Content-Type': 'application/json' }
        });

        const { ok, status } = res;
        if (!ok) {
            throw new ProviderError(await res.text());
        }

        if (status === 503) {
            throw new ProviderError(`${url} unavailable`);
        } else if (status === 408) {
            throw new ProviderError('Unused connection');
        }

        return res;
        // todo: not sure this last parameter is supposed to be retry, hmm
    }, retryConfig.numOfAttempts, retryConfig.timeMultiple, retryConfig.retry);

    if (!response) {
        throw new TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${url}.`, 'RetriesExceeded');
    }

    return await response.json();
}
