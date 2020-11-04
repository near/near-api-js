
const nearApi = require('../lib/index');
const fs = require('fs');
const testUtils  = require('./test-utils');
const semver = require('semver');

let nearjs;
let workingAccount;
let startFromVersion;


const { KeyPair } = nearApi;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

beforeAll(async () => {
    nearjs = await testUtils.setUpTestConnection();
    workingAccount = await testUtils.createAccountMultisig(nearjs, {
        getCode: () => 'test'
    });
    let nodeStatus = await nearjs.connection.provider.status();
    startFromVersion = (version) => semver.gte(nodeStatus.version.version, version);
    console.log(startFromVersion);
});

test('view pre-defined account works and returns correct name', async () => {
    let status = await workingAccount.state();
    console.log(status);
    expect(status.code_hash).toEqual('11111111111111111111111111111111');
});


describe('deployMultisig key rotations', () => {

    test('skip access key if recovery method is "ledger"', async () => {
        const account = await testUtils.createAccount(nearjs);
        await account.addKey(KeyPair.fromRandom('ed25519').getPublicKey())
        const originalKeys = await account.getAccessKeys();
        const { multisig: { AccountMultisig } } = nearApi
        const accountMultisig = new AccountMultisig(nearjs.connection, account.accountId, {})
        // modifiers to return the key material we want to test against
        accountMultisig.getRecoveryMethods = () => ({
            data: originalKeys.map(({ public_key: publicKey }, i) => ({ publicKey, kind: i > 0 ? 'ledger' : 'phrase' }))
        })
        accountMultisig.postSignedJson = () => ({
            publicKey: KeyPair.fromRandom('ed25519').getPublicKey()
        })
        try {
            await accountMultisig.deployMultisig([...fs.readFileSync('./test/data/main.wasm')])
        } catch (e) {
            if (e.message.indexOf('Contract method is not found') === -1) {
                throw(e)
            }
        }
        const currentKeys = await accountMultisig.getAccessKeys();
        expect(currentKeys[0].access_key.permission).toEqual('FullAccess');
        expect(currentKeys[1].access_key.permission).toEqual('FullAccess');
    });
    
});
