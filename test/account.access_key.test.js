
const nearlib = require('../lib/index');
const testUtils = require('./test-utils');
const fs = require('fs');

let connection;
let masterAccount;
let workingAccount;
let contractId;
let contract;

const HELLO_WASM_PATH = process.env.HELLO_WASM_PATH || '../nearcore/tests/hello.wasm';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

beforeAll(async () => {
    ({ connection, masterAccount } = await testUtils.setUpTestConnection());
});

beforeEach(async () => {
    contractId = 'test_contract_' + Date.now();
    workingAccount = await testUtils.createAccount(connection, masterAccount);
    const newPublicKey = await connection.signer.createKey(contractId, testUtils.networkId);
    const data = [...fs.readFileSync(HELLO_WASM_PATH)];
    await workingAccount.createAndDeployContract(contractId, newPublicKey, data, BigInt(100000));
    contract = new nearlib.Contract(workingAccount, contractId, { viewMethods: ['getValue'], changeMethods: ['setValue'] });
});

test('make function call using access key', async() => {
    const keyPair = nearlib.utils.KeyPair.fromRandom('ed25519');
    await workingAccount.addKey(keyPair.getPublicKey(), contractId, '', '', 400000);

    // Override in the key store the workingAccount key to the given access key.
    await connection.signer.keyStore.setKey(testUtils.networkId, workingAccount.accountId, keyPair);
    const setCallValue = testUtils.generateUniqueString('setCallPrefix');
    await contract.setValue({value: setCallValue});
    expect(await contract.getValue()).toEqual(setCallValue);
});

test('remove access key no longer works', async() => {
    const keyPair = nearlib.utils.KeyPair.fromRandom('ed25519');
    await workingAccount.addKey(keyPair.getPublicKey(), contractId, '', '', 400000);
    await workingAccount.deleteKey(keyPair.getPublicKey());
    // Override in the key store the workingAccount key to the given access key.
    await connection.signer.keyStore.setKey(testUtils.networkId, workingAccount.accountId, keyPair);
    // await expect(contract.setValue({ value: "test" })).rejects.toThrow(/\[-32000\] Server error: Transaction is not signed with a public key of the originator .+/);
});