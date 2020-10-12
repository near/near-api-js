
const nearApi = require('../lib/index');
const testUtils  = require('./test-utils');
const fs = require('fs');
const BN = require('bn.js');
const semver = require('semver');

let nearjs;
let workingAccount;
let startFromVersion;

const { HELLO_WASM_PATH, HELLO_WASM_BALANCE } = testUtils;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

beforeAll(async () => {
    nearjs = await testUtils.setUpTestConnection();
    workingAccount = await testUtils.createAccountMultisig(nearjs, {
        getCode: () => 'test'
    });
    let nodeStatus = await nearjs.connection.provider.status();
    startFromVersion = (version) => semver.gte(nodeStatus.version.version, version);
});

// afterAll(async () => {
//     await workingAccount.deleteAccount(workingAccount.accountId);
// });

test('view pre-defined account works and returns correct name', async () => {
    let status = await workingAccount.state();
    console.log(status);
    expect(status.code_hash).toEqual('11111111111111111111111111111111');
});

// test('testing options set', async () => {
//     let code = await workingAccount.getCode();
// });

