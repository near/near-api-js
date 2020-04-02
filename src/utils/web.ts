import createError from 'http-errors';

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
    const response = await fetch(url, {
        method: json ? 'POST' : 'GET',
        body: json ? json : undefined,
        headers: { 'Content-type': 'application/json; charset=utf-8' }
    });
    if (!response.ok) {
        throw createError(response.status, await response.text());
    }
    return await response.json();
}
