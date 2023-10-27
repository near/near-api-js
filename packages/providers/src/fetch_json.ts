import { TypedError } from '@near-js/types';
import createError from 'http-errors';

import { exponentialBackoff } from './exponential-backoff';

const START_WAIT_TIME_MS = 1000;
const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 10;

export interface ConnectionInfo {
    url: string;
    user?: string;
    password?: string;
    allowInsecure?: boolean;
    timeout?: number;
    headers?: { [key: string]: string | number };
}

const logWarning = (...args) => !process.env['NEAR_NO_LOGS'] && console.warn(...args);

export async function fetchJson(connectionInfoOrUrl: string | ConnectionInfo, json?: string): Promise<any> {
    let connectionInfo: ConnectionInfo = { url: null };
    if (typeof (connectionInfoOrUrl) === 'string') {
        connectionInfo.url = connectionInfoOrUrl;
    } else {
        connectionInfo = connectionInfoOrUrl as ConnectionInfo;
    }

    const response = await exponentialBackoff(START_WAIT_TIME_MS, RETRY_NUMBER, BACKOFF_MULTIPLIER, async () => {
        try {

            const response = await (global.fetch ?? (await import('./fetch')).default)(connectionInfo.url, {
                method: json ? 'POST' : 'GET',
                body: json ? json : undefined,
                headers: { ...connectionInfo.headers, 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                if (response.status === 503) {
                    logWarning(`Retrying HTTP request for ${connectionInfo.url} as it's not available now`);
                    return null;
                }
                throw createError(response.status, await response.text());
            }
            return response;
        } catch (error) {
            if (error.toString().includes('FetchError') || error.toString().includes('Failed to fetch')) {
                logWarning(`Retrying HTTP request for ${connectionInfo.url} because of error: ${error}`);
                return null;
            }
            throw error;
        }
    });
    if (!response) {
        throw new TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${connectionInfo.url}.`, 'RetriesExceeded');
    }
    return await response.json();
}
