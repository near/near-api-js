const nearlib = require('../lib');
const testUtils = require('./test-utils');
const fs = require('fs');

let nearjs;
let keyStore;
let storage;
let workingAccount;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

beforeAll(async () => {
    keyStore = new nearlib.keyStores.InMemoryKeyStore();
    await keyStore.setKey(testUtils.networkId, testUtils.testAccountName, nearlib.utils.KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw'));
    storage = testUtils.createFakeStorage();
    const config = Object.assign(require('./config')(process.env.NODE_ENV || 'test'), {
        networkId: testUtils.networkId,
        deps: { keyStore, storage },
    });

    nearjs = nearlib.connect(config);
    workingAccount = nearjs.account(testUtils.testAccountName);
});

describe('with promises', () => { 
    let contract, contract1, contract2;
    let oldLog;
    let logs;
    let contractName = 'test_' + Date.now();
    let contractName1 = 'test_' + Math.random();
    let contractName2 = 'test_' + Math.random();

    beforeAll(async () => {
        contract = await testUtils.deployContract(workingAccount, contractName);
        contract1 = await testUtils.deployContract(workingAccount, contractName1);
        contract2 = await testUtils.deployContract(workingAccount, contractName2);
    });

    beforeEach(async () => {
        oldLog = console.log;
        logs = [];
        console.log = function() {
            logs.push(Array.from(arguments).join(' '));
        };
    });

    afterEach(async () => {
        console.log = oldLog;
    });

    // -> means async call 
    // => means callback

    test('single promise, no callback (A->B)', async () => {
        const result = await contract.callPromise({args: {
            receiver: contractName1,
            methodName: 'callbackWithName',
            args: null,
            balance: 500000000,
            callback: null,
            callbackArgs: null,
            callbackBalance: 0,
        }});
        expect(result.status).toBe('Completed');
        const lastResult = await contract1.getLastResult();
        expect(lastResult).toEqual({
            rs: [],
            n: contractName1,
        });
    });

    // test('single promise with callback (A->B=>A)', async () => {
    //     const result = await contract.callPromise({args: {
    //         receiver: contractName1,
    //         methodName: 'callbackWithName',
    //         args: null,
    //         balance: 500000000,
    //         callback: 'callbackWithName',
    //         callbackArgs: null,
    //         callbackBalance: 100000000,
    //     }});
    //     expect(result.status).toBe('Completed');
    //     const lastResult1 = await contract1.getLastResult();
    //     expect(lastResult1).toEqual({
    //         rs: [],
    //         n: contractName1,
    //     });
    //     const lastResult = await contract.getLastResult();
    //     expect(lastResult).toEqual({
    //         rs: [{
    //             ok: true,
    //             r: lastResult1,
    //         }],
    //         n: contractName,
    //     });
    // });

    // test('two promises, no callbacks (A->B->C)', async () => {
    //     const result = await contract.callPromise({args: {
    //         receiver: contractName1,
    //         methodName: 'callPromise',
    //         args: {
    //             receiver: contractName2,
    //             methodName: 'callbackWithName',
    //             args: null,
    //             balance: 100000000,
    //             callback: null,
    //             callbackArgs: null,
    //             callbackBalance: 0,
    //         },
    //         balance: 500000000,
    //         callback: null,
    //         callbackArgs: null,
    //         callbackBalance: 0,
    //     }});
    //     expect(result.status).toBe('Completed');
    //     const lastResult2 = await contract2.getLastResult();
    //     expect(lastResult2).toEqual({
    //         rs: [],
    //         n: contractName2,
    //     });
    // });

    // test('two promises, with two callbacks (A->B->C=>B=>A)', async () => {
    //     const result = await contract.callPromise({args: {
    //         receiver: contractName1,
    //         methodName: 'callPromise',
    //         args: {
    //             receiver: contractName2,
    //             methodName: 'callbackWithName',
    //             args: null,
    //             balance: 200000000,
    //             callback: 'callbackWithName',
    //             callbackArgs: null,
    //             callbackBalance: 100000000,
    //         },
    //         balance: 500000000,
    //         callback: 'callbackWithName',
    //         callbackArgs: null,
    //         callbackBalance: 100000000,
    //     }});
    //     expect(result.status).toBe('Completed');
    //     const lastResult2 = await contract2.getLastResult();
    //     expect(lastResult2).toEqual({
    //         rs: [],
    //         n: contractName2,
    //     });
    //     const lastResult1 = await contract1.getLastResult();
    //     expect(lastResult1).toEqual({
    //         rs: [{
    //             ok: true,
    //             r: lastResult2,
    //         }],
    //         n: contractName1,
    //     });
    //     const lastResult = await contract.getLastResult();
    //     expect(lastResult).toEqual({
    //         rs: [{
    //             ok: true,
    //             r: lastResult1,
    //         }],
    //         n: contractName,
    //     });
    // });

    // test('cross contract call with callbacks (A->B->A=>B=>A)', async () => {
    //     const result = await contract.callPromise({args: {
    //         receiver: contractName1,
    //         methodName: 'callPromise',
    //         args: {
    //             receiver: contractName,
    //             methodName: 'callbackWithName',
    //             args: null,
    //             balance: 200000000,
    //             callback: 'callbackWithName',
    //             callbackArgs: null,
    //             callbackBalance: 100000000,
    //         },
    //         balance: 500000000,
    //         callback: 'callbackWithName',
    //         callbackArgs: null,
    //         callbackBalance: 100000000,
    //     }});
    //     expect(result.status).toBe('Completed');
    //     const lastResult1 = await contract1.getLastResult();
    //     expect(lastResult1).toEqual({
    //         rs: [{
    //             ok: true,
    //             r: {
    //                 rs: [],
    //                 n: contractName,
    //             },
    //         }],
    //         n: contractName1,
    //     });
    //     const lastResult = await contract.getLastResult();
    //     expect(lastResult).toEqual({
    //         rs: [{
    //             ok: true,
    //             r: lastResult1,
    //         }],
    //         n: contractName,
    //     });
    // });

    // test('2 promises with 1 skipped callbacks (A->B->C=>A)', async () => {
    //     const result = await contract.callPromise({args: {
    //         receiver: contractName1,
    //         methodName: 'callPromise',
    //         args: {
    //             receiver: contractName2,
    //             methodName: 'callbackWithName',
    //             args: null,
    //             balance: 100000000,
    //             callback: null,
    //             callbackArgs: null,
    //             callbackBalance: 0,
    //         },
    //         balance: 500000000,
    //         callback: 'callbackWithName',
    //         callbackArgs: null,
    //         callbackBalance: 100000000,
    //     }});
    //     expect(result.status).toBe('Completed');
    //     const lastResult2 = await contract2.getLastResult();
    //     expect(lastResult2).toEqual({
    //         rs: [],
    //         n: contractName2,
    //     });
    //     const lastResult = await contract.getLastResult();
    //     expect(lastResult).toEqual({
    //         rs: [{
    //             ok: true,
    //             r: lastResult2,
    //         }],
    //         n: contractName,
    //     });
    // });

    // test('single promise with callback using deposit (empty method name) (A->B=>A)', async () => {
    //     const result = await contract.callPromise({args: {
    //         receiver: contractName1,
    //         methodName: '',  // Deposit (no execution)
    //         args: null,
    //         balance: 500000000,
    //         callback: 'callbackWithName',
    //         callbackArgs: null,
    //         callbackBalance: 100000000,
    //     }});
    //     expect(result.status).toBe('Completed');
    //     const lastResult = await contract.getLastResult();
    //     expect(lastResult).toEqual({
    //         rs: [{
    //             ok: true,
    //             r: null,
    //         }],
    //         n: contractName,
    //     });
    // });

    // test('2 promises with 1 skipped callbacks using deposit (empty method name) (A->B->C=>A)', async () => {
    //     const result = await contract.callPromise({args: {
    //         receiver: contractName1,
    //         methodName: 'callPromise',
    //         args: {
    //             receiver: contractName2,
    //             methodName: '',  // Deposit (no execution)
    //             args: null,
    //             balance: 0,
    //             callback: null,
    //             callbackArgs: null,
    //             callbackBalance: 0,
    //         },
    //         balance: 500000000,
    //         callback: 'callbackWithName',
    //         callbackArgs: null,
    //         callbackBalance: 100000000,
    //     }});
    //     expect(result.status).toBe('Completed');
    //     const lastResult = await contract.getLastResult();
    //     expect(lastResult).toEqual({
    //         rs: [{
    //             ok: true,
    //             r: null,
    //         }],
    //         n: contractName,
    //     });
    // });
});
