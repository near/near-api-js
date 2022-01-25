"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJson = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const exponential_backoff_1 = __importDefault(require("./exponential-backoff"));
const providers_1 = require("../providers");
const errors_1 = require("./errors");
const START_WAIT_TIME_MS = 1000;
const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 10;
async function fetchJson(connectionInfoOrUrl, json) {
    let connectionInfo = { selectUrlIndex: 0, urls: [] };
    let selectUrlIndex = 0;
    if (typeof (connectionInfoOrUrl) === 'string') {
        connectionInfo.urls = [connectionInfoOrUrl];
    }
    else {
        connectionInfo = connectionInfoOrUrl;
    }
    const response = await exponential_backoff_1.default(START_WAIT_TIME_MS, RETRY_NUMBER, BACKOFF_MULTIPLIER, async () => {
        if (connectionInfo.selectUrlIndex) {
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
                    errors_1.logWarning(`Retrying HTTP request for ${connectionInfo.urls[selectUrlIndex]} as it's not available now`);
                    return null;
                }
                throw http_errors_1.default(response.status, await response.text());
            }
            return response;
        }
        catch (error) {
            if (error.toString().includes('FetchError') || error.toString().includes('Failed to fetch')) {
                errors_1.logWarning(`Retrying HTTP request for ${connectionInfo.urls[selectUrlIndex]} because of error: ${error}`);
                return null;
            }
            throw error;
        }
    });
    if (!response) {
        throw new providers_1.TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${connectionInfo.urls[selectUrlIndex]}.`, 'RetriesExceeded');
    }
    return await response.json();
}
exports.fetchJson = fetchJson;
