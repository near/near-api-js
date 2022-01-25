import createError from 'http-errors';

import exponentialBackoff from './exponential-backoff';
import { TypedError } from '../providers';
import { logWarning } from './errors';

const START_WAIT_TIME_MS = 1000;
const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 10;

export interface ConnectionInfo {
    selectUrlIndex?: number;
    urls: string[];
    user?: string;
    password?: string;
    allowInsecure?: boolean;
    timeout?: number;
    headers?: { [key: string]: string | number };
}

export async function fetchJson(connectionInfoOrUrl: string | ConnectionInfo, json?: string): Promise<any> {
    let connectionInfo: ConnectionInfo = { urls: [] };
    if (typeof (connectionInfoOrUrl) === 'string') {
        connectionInfo.urls = [connectionInfoOrUrl];
    } else {
        connectionInfo = connectionInfoOrUrl as ConnectionInfo;
    }
    if(!connectionInfo.selectUrlIndex) {
        connectionInfo.selectUrlIndex = -1;
    }
    const response = await exponentialBackoff(START_WAIT_TIME_MS, RETRY_NUMBER, BACKOFF_MULTIPLIER, async () => {
        connectionInfo.selectUrlIndex = (connectionInfo.selectUrlIndex + 1) % connectionInfo.urls.length;
        const currentUrl = connectionInfo.urls[connectionInfo.selectUrlIndex];
        const nextUrl = connectionInfo.urls[(connectionInfo.selectUrlIndex + 1) % connectionInfo.urls.length];
        try {
            const response = await fetch(currentUrl, {
                method: json ? 'POST' : 'GET',
                body: json ? json : undefined,
                headers: { ...connectionInfo.headers, 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                if (response.status === 503) {
                    logWarning(`Retrying HTTP request for ${nextUrl} as ${currentUrl} not available now`);
                    return null;
                }
                throw createError(response.status, await response.text());
            }
            return response;
        } catch (error) {
            if (error.toString().includes('FetchError') || error.toString().includes('Failed to fetch')) {
                logWarning(`Retrying HTTP request for ${nextUrl} because of error: ${error}`);
                return null;
            }
            throw error;
        }
    });
    if (!response) {
        throw new TypedError(`Exceeded ${RETRY_NUMBER} attempts.`, 'RetriesExceeded');
    }
    return await response.json();
}
