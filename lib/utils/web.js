'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const fetch = (typeof window === 'undefined' || window.name === 'nodejs') ? require('node-fetch') : window.fetch;
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
