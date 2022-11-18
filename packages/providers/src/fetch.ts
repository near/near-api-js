import fetch from 'node-fetch';
import http from 'http';
import https from 'https';

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

function agent(_parsedURL) {
    if (_parsedURL.protocol === 'http:') {
        return httpAgent;
    } else {
        return httpsAgent;
    }
}

export default function (resource, init) {
    return fetch(resource, {
        agent: agent(new URL(resource.toString())),
        ...init,
    });
}
