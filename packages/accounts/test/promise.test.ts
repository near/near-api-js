import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { deployContract, generateUniqueString, setUpTestConnection } from './test-utils';

let nearjs;

const CONTRACT_CALL_GAS = 300000000000000n;

jest.setTimeout(120000);

beforeAll(async () => {
    nearjs = await setUpTestConnection();
});

describe('with promises', () => {
    let contract, contract1, contract2;
    let oldLog;
    let logs;
    const contractName = generateUniqueString('cnt');
    const contractName1 = generateUniqueString('cnt');
    const contractName2 = generateUniqueString('cnt');

    beforeAll(async () => {
        contract = await deployContract(nearjs.accountCreator.masterAccount, contractName);
        contract1 = await deployContract(nearjs.accountCreator.masterAccount, contractName1);
        contract2 = await deployContract(nearjs.accountCreator.masterAccount, contractName2);
    });

    beforeEach(async () => {
        oldLog = console.log;
        logs = [];
        console.log = function(...args: any[]) {
            logs.push(Array.from(args).join(' '));
        };
    });

    afterEach(async () => {
        console.log = oldLog;
    });

    // -> means async call
    // => means callback

    test('single promise, no callback (A->B)', async () => {
        const realResult = await contract.callPromise({
            args: {
                args: {
                    receiver: contractName1,
                    methodName: 'callbackWithName',
                    args: null,
                    gas: '3000000000000',
                    balance: '0',
                    callback: null,
                    callbackArgs: null,
                    callbackBalance: '0',
                    callbackGas: '0',
                }
            },
            gas: CONTRACT_CALL_GAS
        });
        const lastResult = await contract1.getLastResult();
        expect(lastResult).toEqual({
            rs: [],
            n: contractName1,
        });
        expect(realResult).toEqual(lastResult);
    });

    test('single promise with callback (A->B=>A)', async () => {
        const realResult = await contract.callPromise({
            args: {
                args: {
                    receiver: contractName1,
                    methodName: 'callbackWithName',
                    args: null,
                    gas: '3000000000000',
                    balance: '0',
                    callback: 'callbackWithName',
                    callbackArgs: null,
                    callbackBalance: '0',
                    callbackGas: '2000000000000', 
                }
            },
            gas: CONTRACT_CALL_GAS
        });
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
        expect(realResult).toEqual(lastResult);
    });

    test('two promises, no callbacks (A->B->C)', async () => {
        const realResult = await contract.callPromise({
            args: {
                args: {
                    receiver: contractName1,
                    methodName: 'callPromise',
                    args: {
                        receiver: contractName2,
                        methodName: 'callbackWithName',
                        args: null,
                        gas: '40000000000000',
                        balance: '0',
                        callback: null,
                        callbackArgs: null,
                        callbackBalance: '0',
                        callbackGas: '20000000000000',
                    },
                    gas: '60000000000000',
                    balance: '0',
                    callback: null,
                    callbackArgs: null,
                    callbackBalance: '0',
                    callbackGas: '60000000000000',
                }
            },
            gas: CONTRACT_CALL_GAS
        });
        const lastResult2 = await contract2.getLastResult();
        expect(lastResult2).toEqual({
            rs: [],
            n: contractName2,
        });
        expect(realResult).toEqual(lastResult2);
    });

    test('two promises, with two callbacks (A->B->C=>B=>A)', async () => {
        const realResult = await contract.callPromise({
            args: {
                args: {
                    receiver: contractName1,
                    methodName: 'callPromise',
                    args: {
                        receiver: contractName2,
                        methodName: 'callbackWithName',
                        args: null,
                        gas: '40000000000000',
                        balance: '0',
                        callback: 'callbackWithName',
                        callbackArgs: null,
                        callbackBalance: '0',
                        callbackGas: '20000000000000',
                    },
                    gas: '100000000000000',
                    balance: '0',
                    callback: 'callbackWithName',
                    callbackArgs: null,
                    callbackBalance: '0',
                    callbackGas: '30000000000000',
                }
            },
            gas: CONTRACT_CALL_GAS
        });
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
        expect(realResult).toEqual(lastResult);
    });

    test('cross contract call with callbacks (A->B->A=>B=>A)', async () => {
        const realResult = await contract.callPromise({
            args: {
                args: {
                    receiver: contractName1,
                    methodName: 'callPromise',
                    args: {
                        receiver: contractName,
                        methodName: 'callbackWithName',
                        args: null,
                        gas: '40000000000000',
                        balance: '0',
                        callback: 'callbackWithName',
                        callbackArgs: null,
                        callbackBalance: '0',
                        callbackGas: '40000000000000',
                    },
                    gas: '100000000000000',
                    balance: '0',
                    callback: 'callbackWithName',
                    callbackArgs: null,
                    callbackBalance: '0',
                    callbackGas: '30000000000000',
                }
            },
            gas: CONTRACT_CALL_GAS
        });
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
        expect(realResult).toEqual(lastResult);
    });

    test('2 promises with 1 skipped callbacks (A->B->C=>A)', async () => {
        const realResult = await contract.callPromise({
            args: {
                args: {
                    receiver: contractName1,
                    methodName: 'callPromise',
                    args: {
                        receiver: contractName2,
                        methodName: 'callbackWithName',
                        args: null,
                        gas: '20000000000000',
                        balance: '0',
                        callback: null,
                        callbackArgs: null,
                        callbackBalance: '0',
                        callbackGas: '20000000000000',
                    },
                    gas: '50000000000000',
                    balance: '0',
                    callback: 'callbackWithName',
                    callbackArgs: null,
                    callbackBalance: '0',
                    callbackGas: '30000000000000'
                }
            },
            gas: CONTRACT_CALL_GAS
        });
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
        expect(realResult).toEqual(lastResult);
    });

    test('two promises, with one callbacks to B only (A->B->C=>B)', async () => {
        const realResult = await contract.callPromise({
            args: {
                args: {
                    receiver: contractName1,
                    methodName: 'callPromise',
                    args: {
                        receiver: contractName2,
                        methodName: 'callbackWithName',
                        args: null,
                        gas: '40000000000000',
                        balance: '0',
                        callback: 'callbackWithName',
                        callbackArgs: null,
                        callbackBalance: '0',
                        callbackGas: '40000000000000',
                    },
                    gas: '100000000000000',
                    balance: '0',
                    callback: null,
                    callbackArgs: null,
                    callbackBalance: '0',
                    callbackGas: '0',
                }
            },
            gas: CONTRACT_CALL_GAS
        });
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
        expect(realResult).toEqual(lastResult1);
    });

});
