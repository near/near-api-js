import * as fs from 'fs';
import type { Worker } from 'near-workspaces';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import {
    Account,
    actionCreators,
    getTransactionLastResult,
    JsonRpcProvider,
    KeyPair,
    KeyPairSigner,
    KeyType,
    TypedContract,
} from '../../../src';
import { AccountAlreadyExistsError } from '../../../src/providers/errors/transaction_execution';
import {
    createAccount,
    generateUniqueString,
    HELLO_WASM_BALANCE,
    HELLO_WASM_PATH,
    setUpTestConnection,
} from './test-utils';

let nearjs: Awaited<ReturnType<typeof setUpTestConnection>>;
let workingAccount: Account;

beforeAll(async () => {
    nearjs = await setUpTestConnection();
    workingAccount = await createAccount(nearjs);
});

afterAll(async () => {
    await workingAccount.deleteAccount(workingAccount.accountId);

    const worker = nearjs.worker as Worker;

    if (!worker) return;

    await worker.tearDown();
});

test('create instance of Account with string secret key', async () => {
    const account = new Account(
        'test.near',
        nearjs.provider,
        'ed25519:3hoMW1HvnRLSFCLZnvPzWeoGwtdHzke34B2cTHM8rhcbG3TbuLKtShTv3DvyejnXKXKBiV7YPkLeqUHN1ghnqpFv'
    );

    const signer = account.getSigner();
    expect(signer).toBeInstanceOf(KeyPairSigner);

    const pk = await signer!.getPublicKey();
    expect(pk.toString()).toBe('ed25519:Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC');
});

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
    await nearjs.account.createAccount({
        newAccountId: newAccountName,
        publicKey: newAccountPublicKey,
        nearToTransfer: newAmount,
    });
    const newAccount = new Account(newAccountName, nearjs.provider, nearjs.account.getSigner()!);
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
    await nearjs.account.createAccount({
        newAccountId: newAccountName,
        publicKey: newAccountPublicKey,
        nearToTransfer: newAmount,
    });
    const newAccount = new Account(newAccountName, nearjs.provider, nearjs.account.getSigner()!);
    const state = await newAccount.getState();
    expect(state.balance.total.toString()).toEqual(newAmount.toString());
});

test('Secp256k1 send money', async () => {
    const sender = await createAccount(nearjs, KeyType.SECP256K1);
    const receiver = await createAccount(nearjs, KeyType.SECP256K1);
    const {
        balance: { total },
    } = await receiver.getState();
    await sender.transfer({ receiverId: receiver.accountId, amount: 10000n });
    const state = await receiver.getState();
    expect(state.balance.total).toEqual(total + 10000n);
});

test('send money', async () => {
    const sender = await createAccount(nearjs);
    const receiver = await createAccount(nearjs);
    const {
        balance: { total },
    } = await receiver.getState();
    await sender.transfer({ receiverId: receiver.accountId, amount: 10000n });
    const state = await receiver.getState();
    expect(state.balance.total).toEqual(total + 10000n);
});

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
});

test('delete account', async () => {
    const sender = await createAccount(nearjs);
    const receiver = await createAccount(nearjs);
    await sender.deleteAccount(receiver.accountId);
    const reloaded = new Account(sender.accountId, sender.provider);
    await expect(reloaded.getState()).rejects.toThrow();
});

describe('errors', () => {
    test('create existing account', async () => {
        try {
            await workingAccount.createAccount({
                newAccountId: workingAccount.accountId,
                publicKey: '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE',
                nearToTransfer: BigInt(100),
            });

            expect.fail('should have thrown');
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(AccountAlreadyExistsError);
            expect((thrown as AccountAlreadyExistsError).accountId).toBe(workingAccount.accountId);
        }
    });
});

describe('with deploy contract', () => {
    const contractId = generateUniqueString('test_contract');
    // @ts-expect-error infer type here
    let contract = new TypedContract({});

    beforeAll(async () => {
        const keyPair = KeyPair.fromRandom('ed25519');
        const newPublicKey = keyPair.getPublicKey();
        const data = fs.readFileSync(HELLO_WASM_PATH);
        await nearjs.account.createAccount({
            newAccountId: contractId,
            publicKey: newPublicKey,
            nearToTransfer: HELLO_WASM_BALANCE,
        });
        const contractAccount = new Account(contractId, nearjs.provider, new KeyPairSigner(keyPair));
        await contractAccount.deployContract(data);

        // @ts-expect-error abi is unknown
        contract = new TypedContract({
            contractId,
            provider: nearjs.provider,
        });
    });

    test('cross-contact assertion and panic', async () => {
        await expect(
            nearjs.account.callFunctionRaw({
                contractId: contract.contractId,
                methodName: 'crossContract',
                args: {},
                gas: 300000000000000,
            })
        ).rejects.toThrow(/Smart contract panicked: expected to fail./);
    });

    test('cross-contact assertion and panic 2', async () => {
        const result = await nearjs.account.signAndSendTransaction({
            receiverId: contract.contractId,
            actions: [actionCreators.functionCall('crossContract', {}, 300000000000000n, 0n)],
            throwOnFailure: false,
        });

        const logs = result.receipts_outcome.flatMap(({ outcome }) => outcome.logs);
        const contractId = contract.contractId;

        expect(logs.length).toEqual(4);
        expect(logs[0]).toMatch(new RegExp(`${contractId}`));
        expect(logs[1]).toMatch(/log before planned panic/);
        expect(logs[2]).toMatch(/log before assert/);
        expect(logs[3]).toMatch(/ABORT: expected to fail, filename: "assembly\/index.ts" line: \d+ col: \d+$/);
    });

    test('make function calls via account', async () => {
        const result = await workingAccount.provider.callFunction({
            contractId,
            method: 'hello', // this is the function defined in hello.wasm file that we are calling
            args: { name: 'trex' },
        });
        expect(result).toEqual('hello trex');

        const setCallValue = generateUniqueString('setCallPrefix');
        const result2 = await workingAccount.callFunctionRaw({
            contractId,
            methodName: 'setValue',
            args: { value: setCallValue },
        });
        expect(getTransactionLastResult(result2)).toEqual(setCallValue);
        expect(
            await workingAccount.provider.callFunction({
                contractId,
                method: 'getValue',
                args: {},
            })
        ).toEqual(setCallValue);
    });

    test('view contract state', async () => {
        const setCallValue = generateUniqueString('setCallPrefix');
        await workingAccount.callFunction({
            contractId,
            methodName: 'setValue',
            args: { value: setCallValue },
        });

        const contractAccount = new Account(contractId, nearjs.provider);
        const state = (await contractAccount.getContractState()).values.map(({ key, value }) => [
            Buffer.from(key, 'base64').toString('utf-8'),
            Buffer.from(value, 'base64').toString('utf-8'),
        ]);
        expect(state).toEqual([['name', setCallValue]]);
    });

    test('make function calls via contract', async () => {
        const result = await contract.call.hello({ args: { name: 'trex' }, account: nearjs.account });
        expect(result).toEqual('hello trex');

        const setCallValue = generateUniqueString('setCallPrefix');
        const result2 = await contract.call.setValue({ args: { value: setCallValue }, account: nearjs.account });
        expect(result2).toEqual(setCallValue);
        expect(await contract.view.getValue()).toEqual(setCallValue);
    });

    test('view function calls by block Id and finality', async () => {
        const setCallValue1 = generateUniqueString('setCallPrefix');
        const result1 = await contract.call.setValue({ args: { value: setCallValue1 }, account: nearjs.account });
        expect(result1).toEqual(setCallValue1);
        expect(await contract.view.getValue()).toEqual(setCallValue1);

        expect(
            await workingAccount.provider.callFunction({
                contractId,
                method: 'getValue',
                args: {},
                blockQuery: { finality: 'optimistic' },
            })
        ).toEqual(setCallValue1);

        expect(await workingAccount.provider.callFunction({ contractId, method: 'getValue', args: {} })).toEqual(
            setCallValue1
        );

        const block1 = await workingAccount.provider.viewBlock({ finality: 'optimistic' });
        const blockHash1 = block1.header.hash;
        const blockIndex1 = block1.header.height;

        expect(
            await workingAccount.provider.callFunction({
                contractId,
                method: 'getValue',
                args: {},
                blockQuery: { blockId: blockHash1 },
            })
        ).toEqual(setCallValue1);

        expect(
            await workingAccount.provider.callFunction({
                contractId,
                method: 'getValue',
                args: {},
                blockQuery: { blockId: blockIndex1 },
            })
        ).toEqual(setCallValue1);

        const setCallValue2 = generateUniqueString('setCallPrefix');
        const result2 = await contract.call.setValue({ args: { value: setCallValue2 }, account: nearjs.account });
        expect(result2).toEqual(setCallValue2);
        expect(await contract.view.getValue()).toEqual(setCallValue2);

        expect(
            await workingAccount.provider.callFunction({
                contractId,
                method: 'getValue',
                args: {},
                blockQuery: { finality: 'optimistic' },
            })
        ).toEqual(setCallValue2);

        expect(await workingAccount.provider.callFunction({ contractId, method: 'getValue', args: {} })).toEqual(
            setCallValue2
        );

        // Old blockHash should still be value #1
        expect(
            await workingAccount.provider.callFunction({
                contractId,
                method: 'getValue',
                args: {},
                blockQuery: { blockId: blockHash1 },
            })
        ).toEqual(setCallValue1);

        expect(
            await workingAccount.provider.callFunction({
                contractId,
                method: 'getValue',
                args: {},
                blockQuery: { blockId: blockIndex1 },
            })
        ).toEqual(setCallValue1);

        const block2 = await workingAccount.provider.viewBlock({ finality: 'optimistic' });
        const blockHash2 = block2.header.hash;
        const blockIndex2 = block2.header.height;

        expect(
            await workingAccount.provider.callFunction({
                contractId,
                method: 'getValue',
                args: {},
                blockQuery: { blockId: blockHash2 },
            })
        ).toEqual(setCallValue2);

        expect(
            await workingAccount.provider.callFunction({
                contractId,
                method: 'getValue',
                args: {},
                blockQuery: { blockId: blockIndex2 },
            })
        ).toEqual(setCallValue2);
    });

    test('make function calls via contract with gas', async () => {
        const setCallValue = generateUniqueString('setCallPrefix');
        const result2 = await contract.call.setValue({
            args: { value: setCallValue },
            gas: 1000000n * 1000000n,
            account: nearjs.account,
        });
        expect(result2).toEqual(setCallValue);
        expect(await contract.view.getValue()).toEqual(setCallValue);
    });

    test('can get logs from raw method result', async () => {
        const result = await nearjs.account.callFunctionRaw({
            contractId: contract.contractId,
            methodName: 'generateLogs',
            args: {},
        });

        const logs = result.receipts_outcome.flatMap(({ outcome }) => outcome.logs);
        expect(logs).toEqual(['log1', 'log2']);
    });

    test('can get logs from raw view call', async () => {
        const result = await nearjs.provider.callFunctionRaw({
            contractId: contract.contractId,
            method: 'returnHiWithLogs',
            args: {},
        });
        expect(result.logs).toEqual(['loooog1', 'loooog2']);
    });

    test('test set/remove', async () => {
        await contract.call.testSetRemove({
            args: { value: '123' },
            account: nearjs.account,
        });
    });

    test('make viewFunction call with object format', async () => {
        const result = await workingAccount.provider.callFunction({
            contractId,
            method: 'hello', // this is the function defined in hello.wasm file that we are calling
            args: { name: 'trex' },
        });
        expect(result).toEqual('hello trex');
    });
});

describe('global contracts', () => {
    let account: Account;
    let mockSignAndSendTransaction: any;

    beforeEach(() => {
        account = nearjs.account;
        mockSignAndSendTransaction = vi.spyOn(account, 'signAndSendTransaction');
        mockSignAndSendTransaction.mockResolvedValue({ status: 'success' } as any);
    });

    afterEach(() => {
        mockSignAndSendTransaction.mockRestore();
    });

    describe('deployGlobalContract', () => {
        const contractCode = new Uint8Array([0x00, 0x61, 0x73, 0x6d]);

        test('deploys global contract with "codeHash" mode', async () => {
            await account.deployGlobalContract(contractCode, 'codeHash');

            expect(mockSignAndSendTransaction).toHaveBeenCalledWith({
                receiverId: 'test.near',
                actions: expect.arrayContaining([
                    expect.objectContaining({
                        deployGlobalContract: expect.objectContaining({
                            code: contractCode,
                            deployMode: expect.objectContaining({
                                enum: 'CodeHash',
                                CodeHash: null,
                            }),
                        }),
                    }),
                ]),
            });
        });

        test('deploys global contract with "accountId" mode', async () => {
            await account.deployGlobalContract(contractCode, 'accountId');

            expect(mockSignAndSendTransaction).toHaveBeenCalledWith({
                receiverId: 'test.near',
                actions: expect.arrayContaining([
                    expect.objectContaining({
                        deployGlobalContract: expect.objectContaining({
                            code: contractCode,
                            deployMode: expect.objectContaining({
                                enum: 'AccountId',
                                AccountId: null,
                            }),
                        }),
                    }),
                ]),
            });
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
            await account.useGlobalContract({ accountId: 'contract-owner.near' });

            expect(mockSignAndSendTransaction).toHaveBeenCalledWith({
                receiverId: 'test.near',
                actions: expect.arrayContaining([
                    expect.objectContaining({
                        useGlobalContract: expect.objectContaining({
                            contractIdentifier: expect.objectContaining({
                                enum: 'AccountId',
                                AccountId: 'contract-owner.near',
                            }),
                        }),
                    }),
                ]),
            });
        });

        test('uses global contract with code hash Uint8Array', async () => {
            const codeHash = new Uint8Array(32);
            await account.useGlobalContract({ codeHash });

            expect(mockSignAndSendTransaction).toHaveBeenCalledWith({
                receiverId: 'test.near',
                actions: expect.arrayContaining([
                    expect.objectContaining({
                        useGlobalContract: expect.objectContaining({
                            contractIdentifier: expect.objectContaining({
                                enum: 'CodeHash',
                                CodeHash: codeHash,
                            }),
                        }),
                    }),
                ]),
            });
        });

        test('uses global contract with code hash hex string', async () => {
            const codeHashHex = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
            const expectedBytes = Buffer.from(codeHashHex, 'hex');
            await account.useGlobalContract({ codeHash: codeHashHex });

            expect(mockSignAndSendTransaction).toHaveBeenCalledWith({
                receiverId: 'test.near',
                actions: expect.arrayContaining([
                    expect.objectContaining({
                        useGlobalContract: expect.objectContaining({
                            contractIdentifier: expect.objectContaining({
                                enum: 'CodeHash',
                                CodeHash: expectedBytes,
                            }),
                        }),
                    }),
                ]),
            });
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

test('Account can be created with string Provider', () => {
    const account = new Account('user.near', 'https://rpc.testnet.near.org');

    expect(account.provider).toBeInstanceOf(JsonRpcProvider);
    expect((account.provider as JsonRpcProvider).connection.url).toBe('https://rpc.testnet.near.org');
});
