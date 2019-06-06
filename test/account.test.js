
const nearlib = require('../lib/index');
const testUtils  = require('./test-utils');
const fs = require('fs');

let connection;
let masterAccount;
let keyStore;
let accountCreator;

const HELLO_WASM_PATH = process.env.HELLO_WASM_PATH || '../nearcore/tests/hello.wasm';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

beforeAll(async () => {
    [connection, keyStore, masterAccount, accountCreator] = await testUtils.setUpTestConnection();
});

// test('view pre-defined account works and returns correct name', async () => {
//     let status = await masterAccount.state();
//     expect(status.account_id).toEqual(testUtils.testAccountName);
// });

// test('create account and then view account returns the created account', async () => {
//     const newAccountName = await generateUniqueString('create.account.test');
//     const newAccountPublicKey = '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE';
//     await accountCreator.createAccount(newAccountName, newAccountPublicKey);
//     const newAccount = new nearlib.Account(connection, newAccountName);
//     const state = await newAccount.state();
//     const expectedState = { nonce: 0, account_id: newAccountName, amount: testUtils.INITIAL_BALANCE, code_hash: 'GKot5hBsd81kMupNCXHaqbhv3huEbxAFMLnpcX2hniwn', public_keys: state.public_keys, stake: BigInt(0)};
//     expect(state).toEqual(expectedState);
// });

// test('send money', async() => {
//     const sender = await testCreateAccount();
//     const receiver = await testCreateAccount();
//     await sender.sendMoney(receiver.accountId, BigInt(10000));
//     await receiver.fetchState();
//     const state = await receiver.state();
//     expect(state.amount).toEqual(testUtils.INITIAL_BALANCE + BigInt(10000));
// });

describe('with deploy contract', () => {
    let oldLog;
    let logs;
    let contractId = 'test_contract_' + Date.now();
    let contract;

    beforeAll(async () => {
        const keyPair = nearlib.utils.KeyPair.fromRandom('ed25519');
        keyStore.setKey(testUtils.networkId, contractId, keyPair);
        const data = [...fs.readFileSync(HELLO_WASM_PATH)];
        await masterAccount.createAndDeployContract(contractId, keyPair.publicKey, data, BigInt(100000));
        contract = new nearlib.Contract(masterAccount, contractId, {
            viewMethods: ['hello', 'getValue', 'getAllKeys', 'returnHiWithLogs'],
            changeMethods: ['setValue', 'generateLogs', 'triggerAssert', 'testSetRemove']
        });
    });

    beforeEach(async () => {
        oldLog = console.log;
        logs = [];
        console.log = function () {
            logs.push(Array.from(arguments).join(' '));
        };
    });

    afterEach(async () => {
        console.log = oldLog;
    });

    test('make function calls via account', async() => {
        const result = await masterAccount.viewFunction(
            contractId,
            'hello', // this is the function defined in hello.wasm file that we are calling
            {name: 'trex'});
        expect(result).toEqual('hello trex');

        const setCallValue = await generateUniqueString('setCallPrefix');
        const result2 = await masterAccount.functionCall(contractId, 'setValue', { value: setCallValue });
        expect(nearlib.providers.getTransactionLastResult(result2)).toEqual(setCallValue);
        expect(await masterAccount.viewFunction(contractId, 'getValue', {})).toEqual(setCallValue);
    });
    
    test('make function calls via contract', async() => {
        const result = await contract.hello({ name: 'trex' });
        expect(result).toEqual('hello trex');

        const setCallValue = await generateUniqueString('setCallPrefix');
        const result2 = await contract.setValue({ value: setCallValue });
        expect(nearlib.providers.getTransactionLastResult(result2)).toEqual(setCallValue);
        expect(await contract.getValue()).toEqual(setCallValue);
    });

    test('can get logs from method result', async () => {
        await contract.generateLogs();
        expect(logs).toEqual([`[${contractId}]: LOG: log1`, `[${contractId}]: LOG: log2`]);
    });

    test('can get logs from view call', async () => {
        let result = await contract.returnHiWithLogs();
        expect(result).toEqual('Hi');
        expect(logs).toEqual([`[${contractId}]: LOG: loooog1`, `[${contractId}]: LOG: loooog2`]);
    });

    const failedAssertTest = process.env.SKIP_FAILED_ASSERT_TEST ? xtest : test;
    failedAssertTest('can get assert message from method result', async () => {
        await expect(contract.triggerAssert()).rejects.toThrow(/Transaction .+ failed.+expected to fail.+/);
        expect(logs.length).toBe(3);
        expect(logs[0]).toEqual(`[${contractId}]: LOG: log before assert`);
        expect(logs[1]).toMatch(new RegExp(`^\\[${contractId}\\]: ABORT: "expected to fail" filename: "../out/main.ts" line: \\d+ col: \\d+$`));
        expect(logs[2]).toEqual(`[${contractId}]: Runtime error: wasm async call execution failed with error: Runtime(AssertFailed)`);
    });

    test('test set/remove', async () => {
        const result = await contract.testSetRemove({ value: '123' });
        expect(result.status).toBe('Completed');
    });
});

// describe('with access key', function () {
//     let workingAccount;
//     let contractId = 'test_contract_' + Date.now();

//     beforeAll(async () => {
//         workingAccount = testCreateAccount();
//         await masterAccount.deployContract();
//     });

//     test('make function call using access key', async() => {
//         const keyForAccessKey = nearlib.utils.keyPair.fromRandom('ed25519');
//         await workingAccount.addKey(keyForAccessKey.publicKey, contractId, '', '', 400000);
//         keyStore.setKey(workingAccount.accountId, keyForAccessKey);

//         let contract = 

//         const setCallValue2 = await generateUniqueString('setCallPrefix');
//         contract.setValue({ value: setCallValue2 });
//         contract.
//     });
// });

// Generate some unique string with a given prefix using the alice nonce.
const generateUniqueString = async (prefix) => {
    let status = await masterAccount.state();
    return prefix + status.nonce;
};

async function testCreateAccount() {
    const newAccountName = await generateUniqueString('create.account.test');
    const keyPair = nearlib.utils.key_pair.KeyPairEd25519.fromRandom();
    keyStore.setKey(testUtils.networkId, newAccountName, keyPair);
    await accountCreator.createAccount(newAccountName, keyPair.publicKey);
    return new nearlib.Account(connection, newAccountName);
}
