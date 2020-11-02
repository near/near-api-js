
const testUtils  = require('./test-utils');
const semver = require('semver');

let nearjs;
let workingAccount;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

beforeAll(async () => {
    nearjs = await testUtils.setUpTestConnection();
    workingAccount = await testUtils.createAccountMultisig(nearjs, {
        getCode: () => 'test'
    });
    let nodeStatus = await nearjs.connection.provider.status();
    startFromVersion = (version) => semver.gte(nodeStatus.version.version, version);
});

test('view pre-defined account works and returns correct name', async () => {
    let status = await workingAccount.state();
    console.log(status);
    expect(status.code_hash).toEqual('11111111111111111111111111111111');
});
