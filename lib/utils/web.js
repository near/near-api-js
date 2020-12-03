"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJson = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const exponential_backoff_1 = __importDefault(require("./exponential-backoff"));
const providers_1 = require("../providers");
const START_WAIT_TIME_MS = 1000;
const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 10;
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
        }
        else {
            return httpsAgent;
        }
    }
    fetch = function (resource, init) {
        return nodeFetch(resource, { agent: agent(new URL(resource)), ...init });
    };
}
else {
    fetch = window.fetch;
}
async function fetchJson(connection, json) {
    let url = null;
    if (typeof (connection) === 'string') {
        url = connection;
    }
    else {
        url = connection.url;
    }
    const response = await exponential_backoff_1.default(START_WAIT_TIME_MS, RETRY_NUMBER, BACKOFF_MULTIPLIER, async () => {
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
                throw http_errors_1.default(response.status, await response.text());
            }
            return response;
        }
        catch (error) {
            if (error.toString().includes('FetchError')) {
                console.warn(`Retrying HTTP request for ${url} because of error: ${error}`);
                return null;
            }
            throw error;
        }
    });
    if (!response) {
        throw new providers_1.TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${url}.`, 'RetriesExceeded');
    }
    return await response.json();
}
exports.fetchJson = fetchJson;
