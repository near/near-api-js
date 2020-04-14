
const nearApi = require('../lib/index');
const testUtils  = require('./test-utils');
const fs = require('fs');
const BN = require('bn.js');
const semver = require('semver');

let nearjs;
let workingAccount;
let startFromVersion;

const HELLO_WASM_PATH = process.env.HELLO_WASM_PATH || 'node_modules/near-hello/dist/main.wasm';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

beforeAll(async () => {
    nearjs = await testUtils.setUpTestConnection();
    workingAccount = await testUtils.createAccount(await nearjs.account(testUtils.testAccountName), { amount: testUtils.INITIAL_BALANCE.mul(new BN(100)) });
    let nodeStatus = await nearjs.connection.provider.status();
    startFromVersion = (version) => semver.gte(nodeStatus.version.version, version);
});

test('view pre-defined account works and returns correct name', async () => {
    let status = await workingAccount.state();
    expect(status.code_hash).toEqual('11111111111111111111111111111111');
});

test('create account and then view account returns the created account', async () => {
    const newAccountName = testUtils.generateUniqueString('test');
    const newAccountPublicKey = '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE';
    await workingAccount.createAccount(newAccountName, newAccountPublicKey, testUtils.INITIAL_BALANCE);
    const newAccount = new nearApi.Account(nearjs.connection, newAccountName);
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
    const reloaded = new nearApi.Account(sender.connection, sender);
    await expect(reloaded.state()).rejects.toThrow();
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
        if (startFromVersion('0.4.13')) {
            await expect(workingAccount.createAccount(workingAccount.accountId, '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE', 100))
                .rejects.toThrow(/Can't create a new account .+, because it already exists/);
        } else {
            await expect(workingAccount.createAccount(workingAccount.accountId, '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE', 100))
                .rejects.toThrow(/Transaction .+ failed.+already exists/);

        }
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
        await workingAccount.createAndDeployContract(contractId, newPublicKey, data, testUtils.INITIAL_BALANCE);
        contract = new nearApi.Contract(workingAccount, contractId, {
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
        expect(nearApi.providers.getTransactionLastResult(result2)).toEqual(setCallValue);
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
        const setCallValue = testUtils.generateUniqueString('setCallPrefix');
        const result2 = await contract.setValue({ value: setCallValue }, 1000000 * 1000000);
        expect(result2).toEqual(setCallValue);
        expect(await contract.getValue()).toEqual(setCallValue);
    });

    test('view call gives error message when accidentally using positional arguments', async() => {
        await expect(contract.hello('trex')).rejects.toThrow(/Contract method calls expect named arguments wrapped in object.+/);
        await expect(contract.hello({ a: 1 }, 'trex')).rejects.toThrow(/Contract method calls expect named arguments wrapped in object.+/);
    });

    test('change call gives error message when accidentally using positional arguments', async() => {
        await expect(contract.setValue('whatever')).rejects.toThrow(/Contract method calls expect named arguments wrapped in object.+/);
    });

    test('change call gives error message for invalid gas argument', async() => {
        await expect(contract.setValue({ a: 1}, 'whatever')).rejects.toThrow(/Expected number, decimal string or BN for 'gas' argument, but got.+/);
    });

    test('change call gives error message for invalid amount argument', async() => {
        await expect(contract.setValue({ a: 1}, 1000, 'whatever')).rejects.toThrow(/Expected number, decimal string or BN for 'amount' argument, but got.+/);
    });

    test('can get logs from method result', async () => {
        await contract.generateLogs();
        if (startFromVersion('0.4.11')) {
            expect(logs).toEqual([`[${contractId}]: log1`, `[${contractId}]: log2`]);
        } else {
            expect(logs).toEqual([`[${contractId}]: LOG: log1`, `[${contractId}]: LOG: log2`]);
        }

    });

    test('can get logs from view call', async () => {
        let result = await contract.returnHiWithLogs();
        expect(result).toEqual('Hi');
        if (startFromVersion('0.4.11')) {
            expect(logs).toEqual([`[${contractId}]: loooog1`, `[${contractId}]: loooog2`]);
        } else {
            expect(logs).toEqual([`[${contractId}]: LOG: loooog1`, `[${contractId}]: LOG: loooog2`]);
        }
    });

    test('can get assert message from method result', async () => {
        if (startFromVersion('0.4.13')) {
            await expect(contract.triggerAssert()).rejects.toThrow(/Smart contract panicked: expected to fail.+/);
        } else {
            await expect(contract.triggerAssert()).rejects.toThrow(/Transaction .+ failed.+expected to fail.+/);
        }
        if (startFromVersion('0.4.11')) {
            expect(logs[0]).toEqual(`[${contractId}]: log before assert`);
        } else {
            expect(logs[0]).toEqual(`[${contractId}]: LOG: log before assert`);
        }
        expect(logs[1]).toMatch(new RegExp(`^\\[${contractId}\\]: ABORT: "?expected to fail"?,? filename: "assembly/main.ts" line: \\d+ col: \\d+$`));
    });

    test('test set/remove', async () => {
        await contract.testSetRemove({ value: '123' });
    });

    test('can have view methods only', async () => {
        const contract = new nearApi.Contract(workingAccount, contractId, {
            viewMethods: ['hello'],
        });
        expect(await contract.hello({ name: 'world' })).toEqual('hello world');
    });

    test('can have change methods only', async () => {
        const contract = new nearApi.Contract(workingAccount, contractId, {
            changeMethods: ['hello'],
        });
        expect(await contract.hello({ name: 'world' })).toEqual('hello world');
    });
});
