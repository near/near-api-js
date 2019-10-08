'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
let fetch;
if (typeof window === 'undefined' || window.name === 'nodejs') {
    const nodeFetch = require('node-fetch');
    const http = require('http');
    const https = require('https');
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
    fetch = function (url, options) {
        return nodeFetch(url, { agent, ...options });
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
    const response = await fetch(url, {
        method: json ? 'POST' : 'GET',
        body: json ? json : undefined,
        headers: { 'Content-type': 'application/json; charset=utf-8' }
    });
    if (!response.ok) {
        throw http_errors_1.default(response.status, await response.text());
    }
    return await response.json();
}
exports.fetchJson = fetchJson;
