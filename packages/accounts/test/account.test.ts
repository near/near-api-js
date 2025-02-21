import * as fs from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { KeyType } from '@near-js/crypto';
import { actionCreators } from '@near-js/transactions';
import { type BlockResult, TypedError } from '@near-js/types';
import { Logger, getTransactionLastResult } from '@near-js/utils';

import { Account, Contract } from '../src';
import {
    HELLO_WASM_BALANCE,
    HELLO_WASM_PATH,
    createAccount,
    generateUniqueString,
    networkId,
    setUpTestConnection,
} from './test-utils';

let nearjs;
let workingAccount;

jest.setTimeout(50000);

beforeAll(async () => {
    nearjs = await setUpTestConnection();
    workingAccount = await createAccount(nearjs);
});

afterAll(async () => {
    await workingAccount.deleteAccount(workingAccount.accountId);
});

test('view pre-defined account works and returns correct name', async () => {
    const status = await workingAccount.state();
    expect(status.code_hash).toEqual('11111111111111111111111111111111');
});

test('create account and then view account returns the created account', async () => {
    const newAccountName = generateUniqueString('test');
    const newAccountPublicKey = '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE';
    const { amount } = await workingAccount.state();
    const newAmount = BigInt(amount) / 10n;
    await nearjs.accountCreator.masterAccount.createAccount(newAccountName, newAccountPublicKey, newAmount);
    const newAccount = new Account(nearjs.connection, newAccountName);
    const state = await newAccount.state();
    expect(state.amount).toEqual(newAmount.toString());
});

test('create account with a secp256k1 key and then view account returns the created account', async () => {
    const newAccountName = generateUniqueString('test');
    const newAccountPublicKey =
        'secp256k1:45KcWwYt6MYRnnWFSxyQVkuu9suAzxoSkUMEnFNBi9kDayTo5YPUaqMWUrf7YHUDNMMj3w75vKuvfAMgfiFXBy28';
    const { amount } = await workingAccount.state();
    const newAmount = BigInt(amount) / 10n;
    await nearjs.accountCreator.masterAccount.createAccount(newAccountName, newAccountPublicKey, newAmount);
    const newAccount = new Account(nearjs.connection, newAccountName);
    const state = await newAccount.state();
    expect(state.amount).toEqual(newAmount.toString());
});

test('Secp256k1 send money', async () => {
    const sender = await createAccount(nearjs, KeyType.SECP256K1);
    const receiver = await createAccount(nearjs, KeyType.SECP256K1);
    const { amount: receiverAmount } = await receiver.state();
    await sender.sendMoney(receiver.accountId, 10000n);
    const state = await receiver.state();
    expect(state.amount).toEqual((BigInt(receiverAmount) + 10000n).toString());
});

test('send money', async () => {
    const sender = await createAccount(nearjs);
    const receiver = await createAccount(nearjs);
    const { amount: receiverAmount } = await receiver.state();
    await sender.sendMoney(receiver.accountId, 10000n);
    const state = await receiver.state();
    expect(state.amount).toEqual((BigInt(receiverAmount) + 10000n).toString());
});

test('send money through signAndSendTransaction', async () => {
    const sender = await createAccount(nearjs);
    const receiver = await createAccount(nearjs);
    const { amount: receiverAmount } = await receiver.state();
    await sender.signAndSendTransaction({
        receiverId: receiver.accountId,
        actions: [actionCreators.transfer(10000n)],
    });
    const state = await receiver.state();
    expect(state.amount).toEqual((BigInt(receiverAmount) + 10000n).toString());
});

test('delete account', async () => {
    const sender = await createAccount(nearjs);
    const receiver = await createAccount(nearjs);
    await sender.deleteAccount(receiver.accountId);
    // @ts-expect-error test input
    const reloaded = new Account(sender.connection, sender);
    await expect(reloaded.state()).rejects.toThrow();
});

test('multiple parallel transactions', async () => {
    const PARALLEL_NUMBER = 5;
    // @ts-expect-error test input
    await Promise.all(
        new Array(PARALLEL_NUMBER).fill().map(async (_, i) => {
            const account = new Account(workingAccount.connection, workingAccount.accountId);
            // NOTE: Need to have different transactions outside of nonce, or they all succeed by being identical
            // TODO: Check if randomization of exponential back off helps to do more transactions without exceeding retries
            await account.sendMoney(account.accountId, BigInt(i));
        }),
    );
});

test('findAccessKey returns the same access key when fetched simultaneously', async () => {
    const account = await createAccount(nearjs);

    const [key1, key2] = await Promise.all([
        // @ts-expect-error test input
        account.findAccessKey(),
        // @ts-expect-error test input
        account.findAccessKey(),
    ]);

    expect(key1.accessKey).toBe(key2.accessKey);
});

describe('errors', () => {
    let logs;

    beforeAll(async () => {
        const custom = {
            log: (...args) => {
                logs.push(args.join(' '));
            },
            warn: () => {},
            error: () => {},
        };

        Logger.overrideLogger(custom);
    });

    beforeEach(async () => {
        logs = [];
    });

    test('create existing account', async () => {
        await expect(
            workingAccount.createAccount(workingAccount.accountId, '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE', 100),
        ).rejects.toThrow(/Can't create a new account .+, because it already exists/);
    });
});

describe('with deploy contract', () => {
    let logs;
    const contractId = generateUniqueString('test_contract');
    let contract;

    beforeAll(async () => {
        const newPublicKey = await nearjs.connection.signer.createKey(contractId, networkId);
        const data = fs.readFileSync(HELLO_WASM_PATH);
        await nearjs.accountCreator.masterAccount.createAndDeployContract(
            contractId,
            newPublicKey,
            data,
            HELLO_WASM_BALANCE,
        );
        // @ts-expect-error test input
        contract = new Contract(nearjs.accountCreator.masterAccount, contractId, {
            viewMethods: ['hello', 'getValue', 'returnHiWithLogs'],
            changeMethods: ['setValue', 'generateLogs', 'triggerAssert', 'testSetRemove', 'crossContract'],
        });

        const custom = {
            log: (...args) => {
                logs.push(args.join(' '));
            },
            warn: () => {},
            error: () => {},
        };

        Logger.overrideLogger(custom);
    });

    beforeEach(async () => {
        logs = [];
    });

    test('cross-contact assertion and panic', async () => {
        await expect(
            contract.crossContract({
                args: {},
                gas: 300000000000000,
            }),
        ).rejects.toThrow(/Smart contract panicked: expected to fail./);
        expect(logs.length).toEqual(7);
        expect(logs[0]).toMatch(/^Receipts: \w+, \w+, \w+$/);
        //  Log [test_contract1591458385248117]: test_contract1591458385248117
        expect(logs[1]).toMatch(new RegExp(`^\\s+Log \\[${contractId}\\]: ${contractId}$`));
        expect(logs[2]).toMatch(/^Receipt: \w+$/);
        //   Log [test_contract1591459677449181]: log before planned panic
        expect(logs[3]).toMatch(new RegExp(`^\\s+Log \\[${contractId}\\]: log before planned panic$`));
        expect(logs[4]).toMatch(/^Receipt: \w+$/);
        expect(logs[5]).toMatch(new RegExp(`^\\s+Log \\[${contractId}\\]: log before assert$`));
        expect(logs[6]).toMatch(
            new RegExp(
                `^\\s+Log \\[${contractId}\\]: ABORT: expected to fail, filename: \\"assembly/index.ts" line: \\d+ col: \\d+$`,
            ),
        );
    });

    test('make function calls via account', async () => {
        const result = await workingAccount.viewFunction({
            contractId,
            methodName: 'hello', // this is the function defined in hello.wasm file that we are calling
            args: { name: 'trex' },
        });
        expect(result).toEqual('hello trex');

        const setCallValue = generateUniqueString('setCallPrefix');
        const result2 = await workingAccount.functionCall({
            contractId,
            methodName: 'setValue',
            args: { value: setCallValue },
        });
        expect(getTransactionLastResult(result2)).toEqual(setCallValue);
        expect(
            await workingAccount.viewFunction({
                contractId,
                methodName: 'getValue',
            }),
        ).toEqual(setCallValue);
    });

    test('view contract state', async () => {
        const setCallValue = generateUniqueString('setCallPrefix');
        await workingAccount.functionCall({
            contractId,
            methodName: 'setValue',
            args: { value: setCallValue },
        });

        const contractAccount = new Account(nearjs.connection, contractId);
        const state = (await contractAccount.viewState('')).map(({ key, value }) => [
            key.toString('utf-8'),
            value.toString('utf-8'),
        ]);
        expect(state).toEqual([['name', setCallValue]]);
    });

    test('make function calls via account with custom parser', async () => {
        const result = await workingAccount.viewFunction({
            contractId,
            methodName: 'hello', // this is the function defined in hello.wasm file that we are calling
            args: { name: 'trex' },
            parse: (x) => JSON.parse(x.toString()).replace('trex', 'friend'),
        });
        expect(result).toEqual('hello friend');
    });

    test('make function calls via contract', async () => {
        const result = await contract.hello({ name: 'trex' });
        expect(result).toEqual('hello trex');

        const setCallValue = generateUniqueString('setCallPrefix');
        const result2 = await contract.setValue({
            args: { value: setCallValue },
        });
        expect(result2).toEqual(setCallValue);
        expect(await contract.getValue()).toEqual(setCallValue);
    });

    test('view function calls by block Id and finality', async () => {
        const setCallValue1 = generateUniqueString('setCallPrefix');
        const result1 = await contract.setValue({
            args: { value: setCallValue1 },
        });
        expect(result1).toEqual(setCallValue1);
        expect(await contract.getValue()).toEqual(setCallValue1);

        expect(
            await workingAccount.viewFunction({
                contractId,
                methodName: 'getValue',
                blockQuery: { finality: 'optimistic' },
            }),
        ).toEqual(setCallValue1);

        expect(
            await workingAccount.viewFunction({
                contractId,
                methodName: 'getValue',
            }),
        ).toEqual(setCallValue1);

        const block1 = await workingAccount.connection.provider.block({
            finality: 'optimistic',
        });
        const blockHash1 = block1.header.hash;
        const blockIndex1 = block1.header.height;

        expect(
            await workingAccount.viewFunction({
                contractId,
                methodName: 'getValue',
                blockQuery: { blockId: blockHash1 },
            }),
        ).toEqual(setCallValue1);

        expect(
            await workingAccount.viewFunction({
                contractId,
                methodName: 'getValue',
                blockQuery: { blockId: blockIndex1 },
            }),
        ).toEqual(setCallValue1);

        const setCallValue2 = generateUniqueString('setCallPrefix');
        const result2 = await contract.setValue({
            args: { value: setCallValue2 },
        });
        expect(result2).toEqual(setCallValue2);
        expect(await contract.getValue()).toEqual(setCallValue2);

        expect(
            await workingAccount.viewFunction({
                contractId,
                methodName: 'getValue',
                blockQuery: { finality: 'optimistic' },
            }),
        ).toEqual(setCallValue2);

        expect(
            await workingAccount.viewFunction({
                contractId,
                methodName: 'getValue',
            }),
        ).toEqual(setCallValue2);

        // Old blockHash should still be value #1
        expect(
            await workingAccount.viewFunction({
                contractId,
                methodName: 'getValue',
                blockQuery: { blockId: blockHash1 },
            }),
        ).toEqual(setCallValue1);

        expect(
            await workingAccount.viewFunction({
                contractId,
                methodName: 'getValue',
                blockQuery: { blockId: blockIndex1 },
            }),
        ).toEqual(setCallValue1);

        const block2 = await workingAccount.connection.provider.block({
            finality: 'optimistic',
        });
        const blockHash2 = block2.header.hash;
        const blockIndex2 = block2.header.height;

        expect(
            await workingAccount.viewFunction({
                contractId,
                methodName: 'getValue',
                blockQuery: { blockId: blockHash2 },
            }),
        ).toEqual(setCallValue2);

        expect(
            await workingAccount.viewFunction({
                contractId,
                methodName: 'getValue',
                blockQuery: { blockId: blockIndex2 },
            }),
        ).toEqual(setCallValue2);
    });

    test('make function calls via contract with gas', async () => {
        const setCallValue = generateUniqueString('setCallPrefix');
        const result2 = await contract.setValue({
            args: { value: setCallValue },
            gas: 1000000 * 1000000,
        });
        expect(result2).toEqual(setCallValue);
        expect(await contract.getValue()).toEqual(setCallValue);
    });

    test('can get logs from method result', async () => {
        await contract.generateLogs();
        expect(logs.length).toEqual(3);
        expect(logs[0].substr(0, 8)).toEqual('Receipt:');
        expect(logs.slice(1)).toEqual([`\tLog [${contractId}]: log1`, `\tLog [${contractId}]: log2`]);
    });

    test('can get logs from view call', async () => {
        const result = await contract.returnHiWithLogs();
        expect(result).toEqual('Hi');
        expect(logs).toEqual([`Log [${contractId}]: loooog1`, `Log [${contractId}]: loooog2`]);
    });

    test('can get assert message from method result', async () => {
        await expect(contract.triggerAssert()).rejects.toThrow(/Smart contract panicked: expected to fail.+/);
        expect(logs[1]).toEqual(`\tLog [${contractId}]: log before assert`);
        expect(logs[2]).toMatch(
            new RegExp(
                `^\\s+Log \\[${contractId}\\]: ABORT: expected to fail, filename: \\"assembly/index.ts" line: \\d+ col: \\d+$`,
            ),
        );
    });

    test('test set/remove', async () => {
        await contract.testSetRemove({
            args: { value: '123' },
        });
    });

    test('can have view methods only', async () => {
        // @ts-expect-error test input
        const contract: any = new Contract(workingAccount, contractId, {
            viewMethods: ['hello'],
        });
        expect(await contract.hello({ name: 'world' })).toEqual('hello world');
    });

    test('can have change methods only', async () => {
        // @ts-expect-error test input
        const contract: any = new Contract(workingAccount, contractId, {
            changeMethods: ['hello'],
        });
        expect(
            await contract.hello({
                args: { name: 'world' },
            }),
        ).toEqual('hello world');
    });

    test('make viewFunction call with object format', async () => {
        const result = await workingAccount.viewFunction({
            contractId,
            methodName: 'hello', // this is the function defined in hello.wasm file that we are calling
            args: { name: 'trex' },
        });
        expect(result).toEqual('hello trex');
    });

    test('get total stake balance and validator responses', async () => {
        const CUSTOM_ERROR = new TypedError(
            'Querying failed: wasm execution failed with error: FunctionCallError(CompilationError(CodeDoesNotExist { account_id: AccountId("invalid_account_id") })).',
            'UntypedError',
        );
        const mockConnection = {
            ...nearjs.connection,
            provider: {
                ...nearjs.connection.provider,
                validators: () => ({
                    current_validators: [
                        {
                            account_id: 'testing1.pool.f863973.m0',
                            is_slashed: false,
                            num_expected_blocks: 7,
                            num_expected_chunks: 19,
                            num_produced_blocks: 7,
                            num_produced_chunks: 18,
                            public_key: 'ed25519:5QzHuNZ4stznMwf3xbDfYGUbjVt8w48q8hinDRmVx41z',
                            shards: [1],
                            stake: '73527610191458905577047103204',
                        },
                        {
                            account_id: 'testing2.pool.f863973.m0',
                            is_slashed: false,
                            num_expected_blocks: 4,
                            num_expected_chunks: 22,
                            num_produced_blocks: 4,
                            num_produced_chunks: 20,
                            public_key: 'ed25519:9SYKubUbsGVfxrMGaJ9tLMEfPdjD55FLqGoqy3cTnRm6',
                            shards: [2],
                            stake: '74531922534760985104659653178',
                        },
                        {
                            account_id: 'invalid_account_id',
                            is_slashed: false,
                            num_expected_blocks: 4,
                            num_expected_chunks: 22,
                            num_produced_blocks: 4,
                            num_produced_chunks: 20,
                            public_key: 'ed25519:9SYKubUbsGVfxrMGaJ9tLMEfPdjD55FLqGoqy3cTnRm6',
                            shards: [2],
                            stake: '0',
                        },
                    ],
                    next_validators: [],
                    current_proposals: [],
                }),
            },
        };

        const account = new Account(mockConnection, 'test.near');
        // mock internal functions that are being used on getActiveDelegatedStakeBalance
        account.viewFunction = async ({ methodName, ...args }) => {
            if (methodName === 'get_account_total_balance') {
                // getActiveDelegatedStakeBalance sums stake from active validators and ignores throws
                if (args.contractId === 'invalid_account_id') {
                    throw CUSTOM_ERROR;
                }
                return Promise.resolve('10000');
            }
            return await account.viewFunction({ methodName, ...args });
        };
        account.connection.provider.block = async () => {
            return Promise.resolve({
                header: { hash: 'dontcare' },
            } as BlockResult);
        };
        const result = await account.getActiveDelegatedStakeBalance();
        expect(result).toEqual({
            stakedValidators: [
                { validatorId: 'testing1.pool.f863973.m0', amount: '10000' },
                { validatorId: 'testing2.pool.f863973.m0', amount: '10000' },
            ],
            failedValidators: [{ validatorId: 'invalid_account_id', error: CUSTOM_ERROR }],
            total: '20000',
        });
    });
    test('Fail to get total stake balance upon timeout error', async () => {
        const ERROR_MESSAGE = 'Failed to get delegated stake balance';
        const CUSTOM_ERROR = new TypedError('RPC DOWN', 'TimeoutError');
        const mockConnection = {
            ...nearjs.connection,
            provider: {
                ...nearjs.connection.provider,
                validators: () => ({
                    current_validators: [
                        {
                            account_id: 'timeout_account_id',
                            is_slashed: false,
                            num_expected_blocks: 4,
                            num_expected_chunks: 22,
                            num_produced_blocks: 4,
                            num_produced_chunks: 20,
                            public_key: 'ed25519:9SYKubUbsGVfxrMGaJ9tLMEfPdjD55FLqGoqy3cTnRm6',
                            shards: [2],
                            stake: '0',
                        },
                    ],
                    next_validators: [],
                    current_proposals: [],
                }),
            },
        };

        const account = new Account(mockConnection, 'test.near');
        // mock internal functions that are being used on getActiveDelegatedStakeBalance
        account.viewFunction = async ({ methodName, ...args }) => {
            if (methodName === 'get_account_total_balance') {
                // getActiveDelegatedStakeBalance sums stake from active validators and ignores throws
                if (args.contractId === 'timeout_account_id') {
                    throw CUSTOM_ERROR;
                }
                return Promise.resolve('10000');
            }
            return await account.viewFunction({ methodName, ...args });
        };
        account.connection.provider.block = async () => {
            return Promise.resolve({
                header: { hash: 'dontcare' },
            } as BlockResult);
        };

        try {
            await account.getActiveDelegatedStakeBalance();
        } catch (e) {
            expect(e).toEqual(new Error(ERROR_MESSAGE));
        }
    });
});
