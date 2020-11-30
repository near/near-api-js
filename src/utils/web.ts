import createError from 'http-errors';

import exponentialBackoff from './exponential-backoff';
import { TypedError } from '../providers';

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

// TODO: Move into separate module and exclude node-fetch kludge from browser build
let fetch;
if (typeof window === 'undefined' || window.name === 'nodejs') {
    /* eslint-disable @typescript-eslint/no-var-requires */
    const nodeFetch = require('node-fetch');
    const http = require('http');
    const https = require('https');
    /* eslint-enable @typescript-eslint/no-var-requires */

    const httpAgent = new http.Agent({ keepAlive: true });
    const httpsAgent = new https.Agent({ keepAlive: true });

    function agent(_parsedURL) {
        if (_parsedURL.protocol === 'http:') {
            return httpAgent;
        } else {
            return httpsAgent;
        }
    }

    fetch = function(resource, init) {
        return nodeFetch(resource, { agent: agent(new URL(resource)), ...init });
    };
} else {
    fetch = window.fetch;
}

export async function fetchJson(connection: string | ConnectionInfo, json?: string): Promise<any> {
    let url: string = null;
    if (typeof(connection) === 'string') {
        url = connection;
    } else {
        url = connection.url;
    }

    const response = await exponentialBackoff(START_WAIT_TIME_MS, RETRY_NUMBER, BACKOFF_MULTIPLIER, async () => {
        try {
            const response = await fetch(url, {
                method: json ? 'POST' : 'GET',
                body: json ? json : undefined,
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });
            if (!response.ok) {
                if (response.status === 503) {
                    console.warn(`Retrying HTTP request for ${url} as it's not available now`);
                    return null;
                }
                throw createError(response.status, await response.text());
            }
            return response;
        } catch (error) {
            if (error.toString().includes('FetchError')) {
                console.warn(`Retrying HTTP request for ${url} because of error: ${error}`);
                return null;
            }
            throw error;
        }
    });
    if (!response) {
        throw new TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${url}.`, 'RetriesExceeded');
    }
    return await response.json();
}
