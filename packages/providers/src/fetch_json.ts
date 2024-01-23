import { TypedError } from '@near-js/types';
import { Logger } from '@near-js/utils';
import createError from 'http-errors';

import { exponentialBackoff } from './exponential-backoff';

const START_WAIT_TIME_MS = 1000;
const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 10;

export interface ConnectionInfo {
    // RPC Server URL or the prioritized array of such URLs
    url: string | string[];
    apiKeys?: { [url: string]: string };
    user?: string;
    password?: string;
    allowInsecure?: boolean;
    timeout?: number;
    headers?: { [key: string]: string | number };
}

export async function fetchJson(connectionInfoOrUrl: string | ConnectionInfo, json?: string): Promise<any> {
    let connectionInfo: ConnectionInfo = { url: null };
    if (typeof (connectionInfoOrUrl) === 'string') {
        connectionInfo.url = connectionInfoOrUrl;
    } else {
        connectionInfo = connectionInfoOrUrl as ConnectionInfo;
    }
    
    if (Array.isArray(connectionInfo.url) && !connectionInfo.url.length) {
        throw new Error('The prioritized array of RPC Server URLs must not be empty');
    }

    const currentRpcServer = typeof connectionInfo.url === 'string' ? connectionInfo.url : connectionInfo.url[0];
    const response = await exponentialBackoff(START_WAIT_TIME_MS, RETRY_NUMBER, BACKOFF_MULTIPLIER, async () => {
        try {

            const response = await (global.fetch ?? (await import('./fetch')).default)(currentRpcServer, {
                method: json ? 'POST' : 'GET',
                body: json ? json : undefined,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': connectionInfo.apiKeys ? connectionInfo.apiKeys[currentRpcServer] : null,
                    ...connectionInfo.headers,
                },
            });
            if (!response.ok) {
                if (response.status === 503) {
                    Logger.warn(`Retrying HTTP request for ${currentRpcServer} as it's not available now`);
                    return null;
                } else if (response.status === 408) {
                    Logger.warn(`Retrying HTTP request for ${currentRpcServer} as the previous connection was unused for some time`);
                    return null;
                }
                throw createError(response.status, await response.text());
            }
            return response;
        } catch (error) {
            if (error.toString().includes('FetchError') || error.toString().includes('Failed to fetch')) {
                Logger.warn(`Retrying HTTP request for ${currentRpcServer} because of error: ${error}`);
                return null;
            }
            throw error;
        }
    });
    if (!response) {
        throw new TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${currentRpcServer}.`, 'RetriesExceeded');
    }
    return await response.json();
}
