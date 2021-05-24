
const { Account, Contract, providers } = require('../src/index');
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
    workingAccount = await testUtils.createAccount(nearjs);
    let nodeStatus = await nearjs.connection.provider.status();
    startFromVersion = (version) => semver.gte(nodeStatus.version.version, version);
});

afterAll(async () => {
    await workingAccount.deleteAccount(workingAccount.accountId);
});

test('view pre-defined account works and returns correct name', async () => {
    let status = await workingAccount.state();
    expect(status.code_hash).toEqual('11111111111111111111111111111111');
});

test('create account and then view account returns the created account', async () => {
    const newAccountName = testUtils.generateUniqueString('test');
    const newAccountPublicKey = '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE';
    const { amount } = await workingAccount.state();
    const newAmount = new BN(amount).div(new BN(10));
    await workingAccount.createAccount(newAccountName, newAccountPublicKey, newAmount);
    const newAccount = new Account(nearjs.connection, newAccountName);
    const state = await newAccount.state();
    expect(state.amount).toEqual(newAmount.toString());
});

test('send money', async() => {
    const sender = await testUtils.createAccount(nearjs);
    const receiver = await testUtils.createAccount(nearjs);
    const { amount: receiverAmount } = await receiver.state();
    await sender.sendMoney(receiver.accountId, new BN(10000));
    const state = await receiver.state();
    expect(state.amount).toEqual(new BN(receiverAmount).add(new BN(10000)).toString());
});

test('delete account', async() => {
    const sender = await testUtils.createAccount(nearjs);
    const receiver = await testUtils.createAccount(nearjs);
    await sender.deleteAccount(receiver.accountId);
    const reloaded = new Account(sender.connection, sender);
    await expect(reloaded.state()).rejects.toThrow();
});

test('multiple parallel transactions', async () => {
    const PARALLEL_NUMBER = 5;
    await Promise.all([...Array(PARALLEL_NUMBER).keys()].map(async (_, i) => {
        const account = new Account(workingAccount.connection, workingAccount.accountId);
        // NOTE: Need to have different transactions outside of nonce, or they all succeed by being identical
        // TODO: Check if randomization of exponential back off helps to do more transactions without exceeding retries
        await account.sendMoney(account.accountId, new BN(i));
    }));
});

test('findAccessKey returns the same access key when fetched simultaneously', async() => {
    const account = await testUtils.createAccount(nearjs);

    const [key1, key2] = await Promise.all([
        account.findAccessKey(),
        account.findAccessKey()
    ]);

    expect(key1.accessKey).toBe(key2.accessKey);
});

describe('errors', () => {
    let oldLog;
    let logs;

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
        await workingAccount.createAndDeployContract(contractId, newPublicKey, data, HELLO_WASM_BALANCE);
        contract = new Contract(workingAccount, contractId, {
            viewMethods: ['hello', 'getValue', 'returnHiWithLogs'],
            changeMethods: ['setValue', 'generateLogs', 'triggerAssert', 'testSetRemove', 'crossContract']
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

    test('cross-contact assertion and panic', async () => {
        await expect(contract.crossContract({
            args: {},
            gas: 300000000000000
        })).rejects.toThrow(/Smart contract panicked: expected to fail./);
        expect(logs.length).toEqual(7);
        expect(logs[0]).toMatch(new RegExp('^Receipts: \\w+, \\w+, \\w+$'));
        //	Log [test_contract1591458385248117]: test_contract1591458385248117
        expect(logs[1]).toMatch(new RegExp(`^\\s+Log \\[${contractId}\\]: ${contractId}$`));
        expect(logs[2]).toMatch(new RegExp('^Receipt: \\w+$'));
        // 	Log [test_contract1591459677449181]: log before planned panic
        expect(logs[3]).toMatch(new RegExp(`^\\s+Log \\[${contractId}\\]: log before planned panic$`));
        expect(logs[4]).toMatch(new RegExp('^Receipt: \\w+$'));
        expect(logs[5]).toMatch(new RegExp(`^\\s+Log \\[${contractId}\\]: log before assert$`));
        expect(logs[6]).toMatch(new RegExp(`^\\s+Log \\[${contractId}\\]: ABORT: expected to fail, filename: \\"assembly/index.ts" line: \\d+ col: \\d+$`));
    });

    test('make function calls via account', async() => {
        const result = await workingAccount.viewFunction(
            contractId,
            'hello', // this is the function defined in hello.wasm file that we are calling
            {name: 'trex'});
        expect(result).toEqual('hello trex');

        const setCallValue = testUtils.generateUniqueString('setCallPrefix');
        const result2 = await workingAccount.functionCall({
            contractId,
            methodName: 'setValue',
            args: { value: setCallValue }
        });
        expect(providers.getTransactionLastResult(result2)).toEqual(setCallValue);
        expect(await workingAccount.viewFunction(contractId, 'getValue', {})).toEqual(setCallValue);
    });

    test('view contract state', async() => {
        const setCallValue = testUtils.generateUniqueString('setCallPrefix');
        await workingAccount.functionCall({
            contractId,
            methodName: 'setValue',
            args: { value: setCallValue }
        });

        const contractAccount = await nearjs.account(contractId);
        const state = (await contractAccount.viewState('')).map(({ key, value }) => [key.toString('utf-8'), value.toString('utf-8')]);
        expect(state).toEqual([['name', setCallValue]]);
    });

    test('make function calls via account with custom parser', async() => {
        const result = await workingAccount.viewFunction(
            contractId,
            'hello', // this is the function defined in hello.wasm file that we are calling
            {name: 'trex'},
            { parse: x => JSON.parse(x.toString()).replace('trex', 'friend') }
        );
        expect(result).toEqual('hello friend');
    });

    test('make function calls via contract', async() => {
        const result = await contract.hello({ name: 'trex' });
        expect(result).toEqual('hello trex');

        const setCallValue = testUtils.generateUniqueString('setCallPrefix');
        const result2 = await contract.setValue({ args: { value: setCallValue } });
        expect(result2).toEqual(setCallValue);
        expect(await contract.getValue()).toEqual(setCallValue);
    });

    test('make function calls via contract with gas', async() => {
        const setCallValue = testUtils.generateUniqueString('setCallPrefix');
        const result2 = await contract.setValue({
            args: { value: setCallValue },
            gas: 1000000 * 1000000
        });
        expect(result2).toEqual(setCallValue);
        expect(await contract.getValue()).toEqual(setCallValue);
    });

    test('can get logs from method result', async () => {
        await contract.generateLogs();
        if (startFromVersion('0.4.11')) {
            expect(logs.length).toEqual(3);
            expect(logs[0].substr(0, 8)).toEqual('Receipt:');
            expect(logs.slice(1)).toEqual([`\tLog [${contractId}]: log1`, `\tLog [${contractId}]: log2`]);
        } else {
            expect(logs).toEqual([`\tLog [${contractId}]: LOG: log1`, `\tLog [${contractId}]: LOG: log2`]);
        }

    });

    test('can get logs from view call', async () => {
        let result = await contract.returnHiWithLogs();
        expect(result).toEqual('Hi');
        if (startFromVersion('0.4.11')) {
            expect(logs).toEqual([`Log [${contractId}]: loooog1`, `Log [${contractId}]: loooog2`]);
        } else {
            expect(logs).toEqual([`Log [${contractId}]: LOG: loooog1`, `Log [${contractId}]: LOG: loooog2`]);
        }
    });

    test('can get assert message from method result', async () => {
        if (startFromVersion('0.4.13')) {
            await expect(contract.triggerAssert()).rejects.toThrow(/Smart contract panicked: expected to fail.+/);
        } else {
            await expect(contract.triggerAssert()).rejects.toThrow(/Transaction .+ failed.+expected to fail.+/);
        }
        if (startFromVersion('0.4.11')) {
            expect(logs[1]).toEqual(`\tLog [${contractId}]: log before assert`);
        } else {
            expect(logs[1]).toEqual(`\tLog [${contractId}]: LOG: log before assert`);
        }
        expect(logs[2]).toMatch(new RegExp(`^\\s+Log \\[${contractId}\\]: ABORT: expected to fail, filename: \\"assembly/index.ts" line: \\d+ col: \\d+$`));
    });

    test('test set/remove', async () => {
        await contract.testSetRemove({
            args: { value: '123' }
        });
    });

    test('can have view methods only', async () => {
        const contract = new Contract(workingAccount, contractId, {
            viewMethods: ['hello'],
        });
        expect(await contract.hello({ name: 'world' })).toEqual('hello world');
    });

    test('can have change methods only', async () => {
        const contract = new Contract(workingAccount, contractId, {
            changeMethods: ['hello'],
        });
        expect(await contract.hello({
            args: { name: 'world' }
        })).toEqual('hello world');
    });
});
