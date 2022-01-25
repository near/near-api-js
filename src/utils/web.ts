import createError from 'http-errors';

import exponentialBackoff from './exponential-backoff';
import { TypedError } from '../providers';
import { logWarning } from './errors';

const START_WAIT_TIME_MS = 1000;
const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 10;

export interface ConnectionInfo {
    selectUrlIndex: number;
    urls: string[];
    user?: string;
    password?: string;
    allowInsecure?: boolean;
    timeout?: number;
    headers?: { [key: string]: string | number };
}

export async function fetchJson(connectionInfoOrUrl: string | ConnectionInfo, json?: string): Promise<any> {
    let connectionInfo: ConnectionInfo = { selectUrlIndex: 0, urls: [] };
    let selectUrlIndex = 0;
    if (typeof (connectionInfoOrUrl) === 'string') {
        connectionInfo.urls = [connectionInfoOrUrl];
    } else {
        connectionInfo = connectionInfoOrUrl as ConnectionInfo;
    }
    const response = await exponentialBackoff(START_WAIT_TIME_MS, RETRY_NUMBER, BACKOFF_MULTIPLIER, async () => {
        if(connectionInfo.selectUrlIndex) {
            selectUrlIndex = connectionInfo.selectUrlIndex;
        }
        connectionInfo.selectUrlIndex = (selectUrlIndex + 1) % connectionInfo.urls.length;
        try {
            const response = await fetch(connectionInfo.urls[selectUrlIndex], {
                method: json ? 'POST' : 'GET',
                body: json ? json : undefined,
                headers: { ...connectionInfo.headers, 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                if (response.status === 503) {
                    logWarning(`Retrying HTTP request for ${connectionInfo.urls[selectUrlIndex]} as it's not available now`);
                    return null;
                }
                throw createError(response.status, await response.text());
            }
            return response;
        } catch (error) {
            if (error.toString().includes('FetchError') || error.toString().includes('Failed to fetch')) {
                logWarning(`Retrying HTTP request for ${connectionInfo.urls[selectUrlIndex]} because of error: ${error}`);
                return null;
            }
            throw error;
        }
    });
    if (!response) {
        throw new TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${connectionInfo.urls[selectUrlIndex]}.`, 'RetriesExceeded');
    }
    return await response.json();
}
