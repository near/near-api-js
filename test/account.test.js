
const nearlib = require('../lib/index');
const testUtils  = require('./test-utils');
const fs = require('fs');
const BN = require('bn.js');

let nearjs;
let workingAccount;

const HELLO_WASM_PATH = process.env.HELLO_WASM_PATH || 'node_modules/near-hello/dist/main.wasm';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

beforeAll(async () => {
    nearjs = await testUtils.setUpTestConnection();
    workingAccount = await testUtils.createAccount(await nearjs.account(testUtils.testAccountName), { amount: testUtils.INITIAL_BALANCE.mul(new BN(100)) });
});

test('view pre-defined account works and returns correct name', async () => {
    let status = await workingAccount.state();
    expect(status.code_hash).toEqual('11111111111111111111111111111111');
});

test('create account and then view account returns the created account', async () => {
    const newAccountName = testUtils.generateUniqueString('test');
    const newAccountPublicKey = '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE';
    await workingAccount.createAccount(newAccountName, newAccountPublicKey, testUtils.INITIAL_BALANCE);
    const newAccount = new nearlib.Account(nearjs.connection, newAccountName);
    const state = await newAccount.state();
    expect(state.amount).toEqual(testUtils.INITIAL_BALANCE.toString());
});

test('send money', async() => {
    const sender = await testUtils.createAccount(workingAccount);
    const receiver = await testUtils.createAccount(workingAccount);
    await sender.sendMoney(receiver.accountId, new BN(10000));
    await receiver.fetchState();
    const state = await receiver.state();
    expect(state.amount).toEqual(testUtils.INITIAL_BALANCE.add(new BN(10000)).toString());
});

test('delete account', async() => {
    const sender = await testUtils.createAccount(workingAccount);
    const receiver = await testUtils.createAccount(workingAccount);
    await sender.deleteAccount(receiver.accountId);
    const reloaded = new nearlib.Account(sender.connection, sender);
    await expect(reloaded.state()).rejects.toThrow();
});

test('stake', async() => {
    const account = await testUtils.createAccount(workingAccount);
    const state = await account.state();
    await account.stake('62xLbaLBKDYuBAk32DRo6idnJPLCuZi9MnAMWH39RXsqRQ88TYFY8Tgm899SnbDtNo', new BN(100));
    await account.fetchState();
    const new_state = await account.state();
    expect(state.amount).toEqual(new BN(new_state.amount).add(new BN(100)).toString());
});

describe('errors', () => {
    let oldLog;
    let logs;

    beforeEach(async () => {
        oldLog = console.log;
        logs =[];
        console.log = function () {
            logs.push(Array.from(arguments).join(' '));
        };
    });

    afterEach(async () => {
        console.log = oldLog;
    });

    test('create existing account', async() => {
        await expect(workingAccount.createAccount(workingAccount.accountId, '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE', 100)).rejects.toThrow(/Transaction .+ failed.+already exists/);
    });
});

describe('with deploy contract', () => {
    let oldLog;
    let logs;
    let contractId = testUtils.generateUniqueString('test_contract');
    let contract;

    beforeAll(async () => {
        const newPublicKey = await nearjs.connection.signer.createKey(contractId, testUtils.networkId);
        const data = [...fs.readFileSync(HELLO_WASM_PATH)];
        await workingAccount.createAndDeployContract(contractId, newPublicKey, data, new BN(1000000));
        contract = new nearlib.Contract(workingAccount, contractId, {
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
        const result = await workingAccount.viewFunction(
            contractId,
            'hello', // this is the function defined in hello.wasm file that we are calling
            {name: 'trex'});
        expect(result).toEqual('hello trex');

        const setCallValue = testUtils.generateUniqueString('setCallPrefix');
        const result2 = await workingAccount.functionCall(contractId, 'setValue', { value: setCallValue });
        expect(nearlib.providers.getTransactionLastResult(result2)).toEqual(setCallValue);
        expect(await workingAccount.viewFunction(contractId, 'getValue', {})).toEqual(setCallValue);
    });

    test('make function calls via contract', async() => {
        const result = await contract.hello({ name: 'trex' });
        expect(result).toEqual('hello trex');

        const setCallValue = testUtils.generateUniqueString('setCallPrefix');
        const result2 = await contract.setValue({ value: setCallValue });
        expect(result2).toEqual(setCallValue);
        expect(await contract.getValue()).toEqual(setCallValue);
    });

    test('make function calls via contract with gas', async() => {
        const result = await contract.hello({ name: 'trex' });
        expect(result).toEqual('hello trex');

        const setCallValue = testUtils.generateUniqueString('setCallPrefix');
        const result2 = await contract.setValue({ value: setCallValue }, 100000);
        expect(result2).toEqual(setCallValue);
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

    test('can get assert message from method result', async () => {
        await expect(contract.triggerAssert()).rejects.toThrow(/Transaction .+ failed.+expected to fail.+/);
        expect(logs[0]).toEqual(`[${contractId}]: LOG: log before assert`);
        expect(logs[1]).toMatch(new RegExp(`^\\[${contractId}\\]: ABORT: "?expected to fail"?,? filename: "assembly/main.ts" line: \\d+ col: \\d+$`));
    });

    test('test set/remove', async () => {
        await contract.testSetRemove({ value: '123' });
    });
});
