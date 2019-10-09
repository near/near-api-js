const BN = require('bn.js');
const nearlib = require('../lib/index');
const testUtils = require('./test-utils');

let nearjs;
let testAccount;
let workingAccount;
let contractId;
let contract;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

beforeAll(async () => {
    nearjs = await testUtils.setUpTestConnection();
    testAccount = await testUtils.createAccount(await nearjs.account(testUtils.testAccountName), { amount: testUtils.INITIAL_BALANCE.mul(new BN(100)) });
});

beforeEach(async () => {
    contractId = testUtils.generateUniqueString('test');
    workingAccount = await testUtils.createAccount(testAccount);
    contract = await testUtils.deployContract(workingAccount, contractId);
});

test('make function call using access key', async() => {
    const keyPair = nearlib.utils.KeyPair.fromRandom('ed25519');
    await workingAccount.addKey(keyPair.getPublicKey(), contractId, '', 10000000);

    // Override in the key store the workingAccount key to the given access key.
    await nearjs.connection.signer.keyStore.setKey(testUtils.networkId, workingAccount.accountId, keyPair);
    const setCallValue = testUtils.generateUniqueString('setCallPrefix');
    await contract.setValue({value: setCallValue});
    expect(await contract.getValue()).toEqual(setCallValue);
});

test('remove access key no longer works', async() => {
    const keyPair = nearlib.utils.KeyPair.fromRandom('ed25519');
    let publicKey = keyPair.getPublicKey();
    await workingAccount.addKey(publicKey, contractId, '', 400000);
    await workingAccount.deleteKey(publicKey);
    // Override in the key store the workingAccount key to the given access key.
    await nearjs.connection.signer.keyStore.setKey(testUtils.networkId, workingAccount.accountId, keyPair);
    try {
        await contract.setValue({value: 'test'});
        fail('should throw an error');
    } catch (e) {
        expect(e.message).toMatch(new RegExp(`.*?Signer "${workingAccount.accountId}" doesn't have access key with the given public_key ${publicKey}`));
        expect(e.type).toMatch(/InvalidTxError::InvalidAccessKey::AccessKeyNotFound|UntypedError/);
    }
});

test('view account details after adding access keys', async() => {
    const keyPair = nearlib.utils.KeyPair.fromRandom('ed25519');
    await workingAccount.addKey(keyPair.getPublicKey(), contractId, '', 1000000000);

    const contract2 = await testUtils.deployContract(workingAccount, 'test_contract2_' + Date.now());
    const keyPair2 = nearlib.utils.KeyPair.fromRandom('ed25519');
    await workingAccount.addKey(keyPair2.getPublicKey(), contract2.contractId, '', 2000000000);

    const details = await workingAccount.getAccountDetails();
    const expectedResult = {
        authorizedApps: [{
            contractId: contractId,
            amount: '1000000000',
            publicKey: keyPair.getPublicKey().toString(),
        },
        {
            contractId: contract2.contractId,
            amount: '2000000000',
            publicKey: keyPair2.getPublicKey().toString(),
        }],
        transactions: []
    };
    expect(details.authorizedApps).toEqual(jasmine.arrayContaining(expectedResult.authorizedApps));
});

test('loading account after adding a full key', async() => {
    const keyPair = nearlib.utils.KeyPair.fromRandom('ed25519');
    // wallet calls this with an empty string for contract id and method
    await workingAccount.addKey(keyPair.getPublicKey(), '', '');

    let accessKeys = await workingAccount.getAccessKeys();

    expect(accessKeys.length).toBe(2);
    const addedKey = accessKeys.find(item => item.public_key == keyPair.getPublicKey().toString());
    expect(addedKey).toBeTruthy();
    expect(addedKey.access_key.permission).toEqual('FullAccess');
});
