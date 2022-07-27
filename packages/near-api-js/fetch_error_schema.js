const https = require('https');
const fs = require('fs');
const {
    Project,
    Scope,
} = require('ts-morph');

const ERROR_SCHEMA_URL =
    'https://raw.githubusercontent.com/nearprotocol/nearcore/4c1149974ccf899dbcb2253a3e27cbab86dc47be/chain/jsonrpc/res/rpc_errors_schema.json';
const TARGET_DIR = process.argv[2] ||  process.cwd() + '/src/generated';
const TARGET_SCHEMA_FILE_PATH = TARGET_DIR + '/rpc_error_schema.json';

https
    .get(ERROR_SCHEMA_URL, resp => {
        let data = '';

        resp.on('data', chunk => {
            data += chunk;
        });

        resp.on('end', () => {
            fs.writeFileSync(TARGET_SCHEMA_FILE_PATH, data);
        });
    })
    .on('error', err => {
        console.log('Unable to fetch schema file: ' + err.message);
    });
