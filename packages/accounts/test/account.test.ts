import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    test,
    vi,
} from 'bun:test';
import { Buffer } from 'node:buffer';
import * as fs from 'node:fs';
import { KeyPair, KeyType } from '@near-js/crypto';
import type { InMemoryKeyStore } from '@near-js/keystores';
import { actionCreators } from '@near-js/transactions';
import { type BlockResult, TypedError } from '@near-js/types';
import { getTransactionLastResult, Logger } from '@near-js/utils';
import { Account, Contract } from '../src/index.js';
import {
    createAccount,
    generateUniqueString,
    HELLO_WASM_BALANCE,
    HELLO_WASM_PATH,
    networkId,
    setUpTestConnection,
} from './test-utils.js';

let nearjs: any;
let workingAccount: Account;

beforeAll(
    async () => {
        nearjs = await setUpTestConnection();
        workingAccount = await createAccount(nearjs);
    },
    { timeout: 60000 },
);

afterAll(
    async () => {
        await workingAccount.deleteAccount(workingAccount.accountId);

        const worker = nearjs.worker;

        if (!worker) return;

        await worker.tearDown();
    },
    { timeout: 60000 },
);

test('view pre-defined account works and returns correct name', async () => {
    const status = await workingAccount.getState();
    expect(status.codeHash).toEqual('11111111111111111111111111111111');
});

test('create account and then view account returns the created account', async () => {
    const newAccountName = generateUniqueString('test');
    const newAccountPublicKey = '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE';
    const {
        balance: { total },
    } = await workingAccount.getState();
    const newAmount = total / 10n;
    await nearjs.accountCreator.masterAccount.createAccount(
        newAccountName,
        newAccountPublicKey,
        newAmount,
    );
    const newAccount = new Account(
        newAccountName,
        nearjs.connection.provider,
        nearjs.connection.signer,
    );
    const state = await newAccount.getState();
    expect(state.balance.total.toString()).toEqual(newAmount.toString());
});

test('create account with a secp256k1 key and then view account returns the created account', async () => {
    const newAccountName = generateUniqueString('test');
    const newAccountPublicKey =
        'secp256k1:45KcWwYt6MYRnnWFSxyQVkuu9suAzxoSkUMEnFNBi9kDayTo5YPUaqMWUrf7YHUDNMMj3w75vKuvfAMgfiFXBy28';
    const {
        balance: { total },
    } = await workingAccount.getState();
    const newAmount = total / 10n;
    await nearjs.accountCreator.masterAccount.createAccount(
        newAccountName,
        newAccountPublicKey,
        newAmount,
    );
    const newAccount = new Account(
        newAccountName,
        nearjs.connection.provider,
        nearjs.connection.signer,
    );
    const state = await newAccount.getState();
    expect(state.balance.total.toString()).toEqual(newAmount.toString());
});

test('Secp256k1 send money', async () => {
    const sender = await createAccount(nearjs, KeyType.SECP256K1);
    const receiver = await createAccount(nearjs, KeyType.SECP256K1);
    const {
        balance: { total },
    } = await receiver.getState();
    await sender.sendMoney(receiver.accountId, 10000n);
    const state = await receiver.getState();
    expect(state.balance.total).toEqual(total + 10000n);
}, 60000);

test('send money', async () => {
    const sender = await createAccount(nearjs);
    const receiver = await createAccount(nearjs);
    const {
        balance: { total },
    } = await receiver.getState();
    await sender.sendMoney(receiver.accountId, 10000n);
    const state = await receiver.getState();
    expect(state.balance.total).toEqual(total + 10000n);
}, 60000);

test('send money through signAndSendTransaction', async () => {
    const sender = await createAccount(nearjs);
    const receiver = await createAccount(nearjs);
    const {
        balance: { total },
    } = await receiver.getState();
    await sender.signAndSendTransaction({
        receiverId: receiver.accountId,
        actions: [actionCreators.transfer(10000n)],
    });
    const state = await receiver.getState();
    expect(state.balance.total).toEqual(total + 10000n);
}, 60000);

test('delete account', async () => {
    const sender = await createAccount(nearjs);
    const receiver = await createAccount(nearjs);
    await sender.deleteAccount(receiver.accountId);
    // @ts-expect-error test input
    const reloaded = new Account(sender.connection, sender);
    await expect(reloaded.getState()).rejects.toThrow();
}, 60000);

test('multiple parallel transactions', async () => {
    const PARALLEL_NUMBER = 5;
    await Promise.all(
        Array.from({ length: PARALLEL_NUMBER }).map(async (_, i) => {
            const account = new Account(
                workingAccount.accountId,
                workingAccount.provider,
                workingAccount.getSigner(),
            );
            // NOTE: Need to have different transactions outside of nonce, or they all succeed by being identical
            // TODO: Check if randomization of exponential back off helps to do more transactions without exceeding retries
            await account.sendMoney(account.accountId, BigInt(i));
        }),
    );
}, 60000);

test('findAccessKey returns the same access key when fetched simultaneously', async () => {
    const account = await createAccount(nearjs);

    const [key1, key2] = await Promise.all([
        // @ts-expect-error test input
        account.findAccessKey(),
        // @ts-expect-error test input
        account.findAccessKey(),
    ]);

    expect(key1.accessKey).toBe(key2.accessKey);
}, 60000);

describe('errors', () => {
    let logs: string[];

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

    beforeEach(
        async () => {
            logs = [];
        },
        { timeout: 60_000 },
    );

    test('create existing account', async () => {
        await expect(
            workingAccount.createAccount(
                workingAccount.accountId,
                '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE',
                100n,
            ),
        ).rejects.toThrow(
            /Can't create a new account .+, because it already exists/,
        );
    }, 60000);
});

describe('with deploy contract', () => {
    let logs: string[];
    const contractId = generateUniqueString('test_contract');
    let contract: any;

    beforeAll(async () => {
        const keyPair = KeyPair.fromRandom('ed25519');
        await (nearjs.keyStore as InMemoryKeyStore).setKey(
            networkId,
            contractId,
            keyPair,
        );
        const newPublicKey = keyPair.getPublicKey();
        const data = fs.readFileSync(HELLO_WASM_PATH);
        await nearjs.accountCreator.masterAccount.createAndDeployContract(
            contractId,
            newPublicKey,
            data,
            HELLO_WASM_BALANCE,
        );
        contract = new Contract(
            nearjs.accountCreator.masterAccount,
            contractId,
            {
                viewMethods: ['hello', 'getValue', 'returnHiWithLogs'],
                changeMethods: [
                    'setValue',
                    'generateLogs',
                    'triggerAssert',
                    'testSetRemove',
                    'crossContract',
                ],
                useLocalViewExecution: false,
            },
        );

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
        expect(logs[1]).toMatch(
            new RegExp(`^\\s+Log \\[${contractId}\\]: ${contractId}$`),
        );
        expect(logs[2]).toMatch(/^Receipt: \w+$/);
        //   Log [test_contract1591459677449181]: log before planned panic
        expect(logs[3]).toMatch(
            new RegExp(
                `^\\s+Log \\[${contractId}\\]: log before planned panic$`,
            ),
        );
        expect(logs[4]).toMatch(/^Receipt: \w+$/);
        expect(logs[5]).toMatch(
            new RegExp(`^\\s+Log \\[${contractId}\\]: log before assert$`),
        );
        expect(logs[6]).toMatch(
            new RegExp(
                `^\\s+Log \\[${contractId}\\]: ABORT: expected to fail, filename: \\"assembly/index.ts" line: \\d+ col: \\d+$`,
            ),
        );
    }, 60000);

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
    }, 60000);

    test('view contract state', async () => {
        const setCallValue = generateUniqueString('setCallPrefix');
        await workingAccount.functionCall({
            contractId,
            methodName: 'setValue',
            args: { value: setCallValue },
        });

        const contractAccount = new Account(
            contractId,
            nearjs.connection.provider,
            nearjs.connection.signer,
        );
        const state = (await contractAccount.viewState('')).map(
            ({ key, value }) => [
                key.toString('utf-8'),
                value.toString('utf-8'),
            ],
        );
        expect(state).toEqual([['name', setCallValue]]);
    }, 60000);

    test('make function calls via account with custom parser', async () => {
        const result = await workingAccount.viewFunction({
            contractId,
            methodName: 'hello', // this is the function defined in hello.wasm file that we are calling
            args: { name: 'trex' },
            parse: (x) => {
                const buffer = Buffer.isBuffer(x) ? x : Buffer.from(x);
                return JSON.parse(buffer.toString()).replace('trex', 'friend');
            },
        });
        expect(result).toEqual('hello friend');
    }, 60000);

    test('make function calls via contract', async () => {
        const result = await contract.hello({ name: 'trex' });
        expect(result).toEqual('hello trex');

        const setCallValue = generateUniqueString('setCallPrefix');
        const result2 = await contract.setValue({
            args: { value: setCallValue },
        });
        expect(result2).toEqual(setCallValue);
        expect(await contract.getValue()).toEqual(setCallValue);
    }, 60000);

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

        const block1 = await workingAccount.provider.block({
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

        const block2 = await workingAccount.provider.block({
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
        expect(logs.slice(1)).toEqual([
            `\tLog [${contractId}]: log1`,
            `\tLog [${contractId}]: log2`,
        ]);
    });

    test('can get logs from view call', async () => {
        const result = await contract.returnHiWithLogs();
        expect(result).toEqual('Hi');
        expect(logs).toEqual([
            `Log [${contractId}]: loooog1`,
            `Log [${contractId}]: loooog2`,
        ]);
    });

    test('can get assert message from method result', async () => {
        await expect(contract.triggerAssert()).rejects.toThrow(
            /Smart contract panicked: expected to fail.+/,
        );
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
        const contract: any = new Contract(workingAccount, contractId, {
            viewMethods: ['hello'],
            changeMethods: [],
            useLocalViewExecution: false,
        });
        expect(await contract.hello({ name: 'world' })).toEqual('hello world');
    });

    test('can have change methods only', async () => {
        const contract: any = new Contract(workingAccount, contractId, {
            changeMethods: ['hello'],
            viewMethods: [],
            useLocalViewExecution: false,
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
                            public_key:
                                'ed25519:5QzHuNZ4stznMwf3xbDfYGUbjVt8w48q8hinDRmVx41z',
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
                            public_key:
                                'ed25519:9SYKubUbsGVfxrMGaJ9tLMEfPdjD55FLqGoqy3cTnRm6',
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
                            public_key:
                                'ed25519:9SYKubUbsGVfxrMGaJ9tLMEfPdjD55FLqGoqy3cTnRm6',
                            shards: [2],
                            stake: '0',
                        },
                    ],
                    next_validators: [],
                    current_proposals: [],
                }),
            },
        };

        const account = new Account(
            'test.near',
            mockConnection.provider,
            mockConnection.signer,
        );
        // mock internal functions that are being used on getActiveDelegatedStakeBalance
        account.viewFunction = async ({ methodName, ...args }) => {
            if (methodName === 'get_account_total_balance') {
                // getActiveDelegatedStakeBalance sums stake from active validators and ignores throws
                if (args.contractId === 'invalid_account_id') {
                    throw CUSTOM_ERROR;
                }
                return Promise.resolve('10000');
            } else {
                return await account.viewFunction({ methodName, ...args });
            }
        };
        account.provider.block = async () => {
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
            failedValidators: [
                { validatorId: 'invalid_account_id', error: CUSTOM_ERROR },
            ],
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
                            public_key:
                                'ed25519:9SYKubUbsGVfxrMGaJ9tLMEfPdjD55FLqGoqy3cTnRm6',
                            shards: [2],
                            stake: '0',
                        },
                    ],
                    next_validators: [],
                    current_proposals: [],
                }),
            },
        };

        const account = new Account(
            'test.near',
            mockConnection.provider,
            mockConnection.signer,
        );
        // mock internal functions that are being used on getActiveDelegatedStakeBalance
        account.viewFunction = async ({ methodName, ...args }) => {
            if (methodName === 'get_account_total_balance') {
                // getActiveDelegatedStakeBalance sums stake from active validators and ignores throws
                if (args.contractId === 'timeout_account_id') {
                    throw CUSTOM_ERROR;
                }
                return Promise.resolve('10000');
            } else {
                return await account.viewFunction({ methodName, ...args });
            }
        };
        account.provider.block = async () => {
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

describe('global contracts', () => {
    let account: Account;
    let mockSignAndSendTransaction: any;

    beforeEach(() => {
        account = new Account(
            'test.near',
            nearjs.connection.provider,
            nearjs.connection.signer,
        );
        mockSignAndSendTransaction = vi.spyOn(
            account,
            'signAndSendTransaction',
        );
        mockSignAndSendTransaction.mockResolvedValue({
            status: 'success',
        } as any);
    });

    afterEach(() => {
        mockSignAndSendTransaction.mockRestore();
    });

    const getLastCallArgs = () =>
        mockSignAndSendTransaction.mock.calls.at(-1)?.[0];
    const findAction = (call: any, key: string) =>
        call?.actions?.find((action: any) => Object.hasOwn(action, key));

    describe('deployGlobalContract', () => {
        const contractCode = new Uint8Array([0x00, 0x61, 0x73, 0x6d]);

        test('deploys global contract with "codeHash" mode', async () => {
            await account.deployGlobalContract(contractCode, 'codeHash');
            const call = getLastCallArgs();
            expect(call?.receiverId).toBe('test.near');
            const action = findAction(call, 'deployGlobalContract');
            expect(action?.deployGlobalContract?.code).toEqual(contractCode);
            expect(action?.deployGlobalContract?.deployMode?.enum).toBe(
                'CodeHash',
            );
            expect(
                action?.deployGlobalContract?.deployMode?.CodeHash,
            ).toBeNull();
        });

        test('deploys global contract with "accountId" mode', async () => {
            await account.deployGlobalContract(contractCode, 'accountId');

            await account.deployGlobalContract(contractCode, 'accountId');
            const call = getLastCallArgs();
            expect(call?.receiverId).toBe('test.near');
            const action = findAction(call, 'deployGlobalContract');
            expect(action?.deployGlobalContract?.code).toEqual(contractCode);
            expect(action?.deployGlobalContract?.deployMode?.enum).toBe(
                'AccountId',
            );
            expect(
                action?.deployGlobalContract?.deployMode?.AccountId,
            ).toBeNull();
        });

        test('handles valid deploy modes correctly', async () => {
            // Test that both valid modes work without errors
            await account.deployGlobalContract(contractCode, 'codeHash');
            await account.deployGlobalContract(contractCode, 'accountId');
            expect(mockSignAndSendTransaction).toHaveBeenCalledTimes(2);
        });
    });

    describe('useGlobalContract', () => {
        test('uses global contract with account ID', async () => {
            await account.useGlobalContract({
                accountId: 'contract-owner.near',
            });

            const call = getLastCallArgs();
            const action = findAction(call, 'useGlobalContract');
            expect(call?.receiverId).toBe('test.near');
            expect(action?.useGlobalContract?.contractIdentifier?.enum).toBe(
                'AccountId',
            );
            expect(
                action?.useGlobalContract?.contractIdentifier?.AccountId,
            ).toBe('contract-owner.near');
        });

        test('uses global contract with code hash Uint8Array', async () => {
            const codeHash = new Uint8Array(32);
            await account.useGlobalContract({ codeHash });

            const call = getLastCallArgs();
            const action = findAction(call, 'useGlobalContract');
            expect(call?.receiverId).toBe('test.near');
            expect(action?.useGlobalContract?.contractIdentifier?.enum).toBe(
                'CodeHash',
            );
            expect(
                action?.useGlobalContract?.contractIdentifier?.CodeHash,
            ).toEqual(codeHash);
        });

        test('uses global contract with code hash hex string', async () => {
            const codeHashHex =
                'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
            const expectedBytes = new Uint8Array(
                Buffer.from(codeHashHex, 'hex'),
            );
            await account.useGlobalContract({ codeHash: codeHashHex });

            const call = getLastCallArgs();
            const action = findAction(call, 'useGlobalContract');
            expect(call?.receiverId).toBe('test.near');
            expect(action?.useGlobalContract?.contractIdentifier?.enum).toBe(
                'CodeHash',
            );
            expect(
                action?.useGlobalContract?.contractIdentifier?.CodeHash,
            ).toEqual(expectedBytes);
        });

        test('handles all identifier formats correctly', async () => {
            // Test that all valid identifier formats work without errors
            await account.useGlobalContract({ accountId: 'owner.near' });
            const codeHash = new Uint8Array(32);
            await account.useGlobalContract({ codeHash });
            await account.useGlobalContract({ codeHash: 'deadbeef' });
            expect(mockSignAndSendTransaction).toHaveBeenCalledTimes(3);
        });
    });
});
