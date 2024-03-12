const https = require('https');
const fs = require('fs');

const ERROR_SCHEMA_URL =
    'https://raw.githubusercontent.com/near/nearcore/master/chain/jsonrpc/res/rpc_errors_schema.json';
const TARGET_SCHEMA_FILE_PATH = `${process.argv[2] ||  process.cwd()}/src/errors/rpc_error_schema.json`;

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
