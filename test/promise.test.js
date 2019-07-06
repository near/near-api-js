const BN = require('bn.js');
const testUtils = require('./test-utils');

let nearjs;
let workingAccount;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

beforeAll(async () => {
    nearjs = await testUtils.setUpTestConnection();
    workingAccount = await testUtils.createAccount(await nearjs.account(testUtils.testAccountName), { amount: testUtils.INITIAL_BALANCE.mul(new BN(100)) });
});

describe('with promises', () => { 
    let contract, contract1, contract2;
    let oldLog;
    let logs;
    let contractName = testUtils.generateUniqueString('cnt');
    let contractName1 = testUtils.generateUniqueString('cnt');
    let contractName2 = testUtils.generateUniqueString('cnt');

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

    test('single promise with callback (A->B=>A)', async () => {
        const result = await contract.callPromise({args: {
            receiver: contractName1,
            methodName: 'callbackWithName',
            args: null,
            balance: 500000000,
            callback: 'callbackWithName',
            callbackArgs: null,
            callbackBalance: 100000000,
        }});
        expect(result.status).toBe('Completed');
        const lastResult1 = await contract1.getLastResult();
        expect(lastResult1).toEqual({
            rs: [],
            n: contractName1,
        });
        const lastResult = await contract.getLastResult();
        expect(lastResult).toEqual({
            rs: [{
                ok: true,
                r: lastResult1,
            }],
            n: contractName,
        });
    });

    test('two promises, no callbacks (A->B->C)', async () => {
        const result = await contract.callPromise({args: {
            receiver: contractName1,
            methodName: 'callPromise',
            args: {
                receiver: contractName2,
                methodName: 'callbackWithName',
                args: null,
                balance: 100000000,
                callback: null,
                callbackArgs: null,
                callbackBalance: 0,
            },
            balance: 500000000,
            callback: null,
            callbackArgs: null,
            callbackBalance: 0,
        }});
        expect(result.status).toBe('Completed');
        const lastResult2 = await contract2.getLastResult();
        expect(lastResult2).toEqual({
            rs: [],
            n: contractName2,
        });
    });

    test('two promises, with two callbacks (A->B->C=>B=>A)', async () => {
        const result = await contract.callPromise({args: {
            receiver: contractName1,
            methodName: 'callPromise',
            args: {
                receiver: contractName2,
                methodName: 'callbackWithName',
                args: null,
                balance: 200000000,
                callback: 'callbackWithName',
                callbackArgs: null,
                callbackBalance: 100000000,
            },
            balance: 500000000,
            callback: 'callbackWithName',
            callbackArgs: null,
            callbackBalance: 100000000,
        }});
        expect(result.status).toBe('Completed');
        const lastResult2 = await contract2.getLastResult();
        expect(lastResult2).toEqual({
            rs: [],
            n: contractName2,
        });
        const lastResult1 = await contract1.getLastResult();
        expect(lastResult1).toEqual({
            rs: [{
                ok: true,
                r: lastResult2,
            }],
            n: contractName1,
        });
        const lastResult = await contract.getLastResult();
        expect(lastResult).toEqual({
            rs: [{
                ok: true,
                r: lastResult1,
            }],
            n: contractName,
        });
    });

    test('cross contract call with callbacks (A->B->A=>B=>A)', async () => {
        const result = await contract.callPromise({args: {
            receiver: contractName1,
            methodName: 'callPromise',
            args: {
                receiver: contractName,
                methodName: 'callbackWithName',
                args: null,
                balance: 200000000,
                callback: 'callbackWithName',
                callbackArgs: null,
                callbackBalance: 100000000,
            },
            balance: 500000000,
            callback: 'callbackWithName',
            callbackArgs: null,
            callbackBalance: 100000000,
        }});
        expect(result.status).toBe('Completed');
        const lastResult1 = await contract1.getLastResult();
        expect(lastResult1).toEqual({
            rs: [{
                ok: true,
                r: {
                    rs: [],
                    n: contractName,
                },
            }],
            n: contractName1,
        });
        const lastResult = await contract.getLastResult();
        expect(lastResult).toEqual({
            rs: [{
                ok: true,
                r: lastResult1,
            }],
            n: contractName,
        });
    });

    test('2 promises with 1 skipped callbacks (A->B->C=>A)', async () => {
        const result = await contract.callPromise({args: {
            receiver: contractName1,
            methodName: 'callPromise',
            args: {
                receiver: contractName2,
                methodName: 'callbackWithName',
                args: null,
                balance: 100000000,
                callback: null,
                callbackArgs: null,
                callbackBalance: 0,
            },
            balance: 500000000,
            callback: 'callbackWithName',
            callbackArgs: null,
            callbackBalance: 100000000,
        }});
        expect(result.status).toBe('Completed');
        const lastResult2 = await contract2.getLastResult();
        expect(lastResult2).toEqual({
            rs: [],
            n: contractName2,
        });
        const lastResult = await contract.getLastResult();
        expect(lastResult).toEqual({
            rs: [{
                ok: true,
                r: lastResult2,
            }],
            n: contractName,
        });
    });

    test('single promise with callback using deposit (empty method name) (A->B=>A)', async () => {
        const result = await contract.callPromise({args: {
            receiver: contractName1,
            methodName: '',  // Deposit (no execution)
            args: null,
            balance: 500000000,
            callback: 'callbackWithName',
            callbackArgs: null,
            callbackBalance: 100000000,
        }});
        expect(result.status).toBe('Completed');
        const lastResult = await contract.getLastResult();
        expect(lastResult).toEqual({
            rs: [{
                ok: true,
                r: null,
            }],
            n: contractName,
        });
    });

    test('2 promises with 1 skipped callbacks using deposit (empty method name) (A->B->C=>A)', async () => {
        const result = await contract.callPromise({args: {
            receiver: contractName1,
            methodName: 'callPromise',
            args: {
                receiver: contractName2,
                methodName: '',  // Deposit (no execution)
                args: null,
                balance: 0,
                callback: null,
                callbackArgs: null,
                callbackBalance: 0,
            },
            balance: 500000000,
            callback: 'callbackWithName',
            callbackArgs: null,
            callbackBalance: 100000000,
        }});
        expect(result.status).toBe('Completed');
        const lastResult = await contract.getLastResult();
        expect(lastResult).toEqual({
            rs: [{
                ok: true,
                r: null,
            }],
            n: contractName,
        });
    });
});
