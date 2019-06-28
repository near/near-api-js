'use strict';

import createError from 'http-errors';

export interface ConnectionInfo {
    url: string;
    user?: string;
    password?: string;
    allowInsecure?: boolean;
    timeout?: number;
    headers?: { [key: string]: string | number };
}

const fetch = (typeof window === 'undefined' || window.name === 'nodejs') ? require('node-fetch') : window.fetch;

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
