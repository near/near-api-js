import type { RpcLightClientExecutionProofRequest, RpcStatusResponse } from '@near-js/jsonrpc-types';
import { base58 } from '@scure/base';
import type { Worker } from 'near-workspaces';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { KeyPair, type TypedError } from '../../../src';
import { createAccount, deployContract, generateUniqueString, setUpTestConnection, sleep, waitFor } from './test-utils';

let near: Awaited<ReturnType<typeof setUpTestConnection>>;

beforeAll(async () => {
    near = await setUpTestConnection();
});

afterAll(async () => {
    const worker = near.worker as Worker;

    if (!worker) return;

    await worker.tearDown();
});

describe('providers', () => {
    test('txStatus with string hash and buffer hash', async () => {
        const sender = await createAccount(near);
        const receiver = await createAccount(near);
        const outcome = await sender.transfer({ receiverId: receiver.accountId, amount: 1n });
        const responseWithString = await near.provider.viewTransactionStatus({
            txHash: outcome.transaction.hash,
            accountId: sender.accountId,
            waitUntil: 'EXECUTED_OPTIMISTIC',
        });
        const responseWithUint8Array = await near.provider.viewTransactionStatus({
            txHash: base58.decode(outcome.transaction.hash),
            accountId: sender.accountId,
            waitUntil: 'EXECUTED_OPTIMISTIC',
        });
        expect(responseWithString).toMatchObject(outcome);
        expect(responseWithUint8Array).toMatchObject(outcome);
    });

    test('txStatusReciept with string hash and buffer hash', async () => {
        const sender = await createAccount(near);
        const receiver = await createAccount(near);
        const outcome = await sender.transfer({ receiverId: receiver.accountId, amount: 1n });
        const reciepts = await near.provider.viewTransactionStatusWithReceipts({
            txHash: outcome.transaction.hash,
            accountId: sender.accountId,
        });

        const responseWithString = await near.provider.viewTransactionStatusWithReceipts({
            txHash: outcome.transaction.hash,
            accountId: sender.accountId,
            waitUntil: 'EXECUTED_OPTIMISTIC',
        });
        const responseWithUint8Array = await near.provider.viewTransactionStatusWithReceipts({
            txHash: base58.decode(outcome.transaction.hash),
            accountId: sender.accountId,
            waitUntil: 'EXECUTED_OPTIMISTIC',
        });
        expect('transactionOutcome' in responseWithString).toBeTruthy();
        expect('logs' in responseWithString.transactionOutcome.outcome).toBeTruthy();
        expect('receiptIds' in responseWithString.transactionOutcome.outcome).toBeTruthy();
        expect('gasBurnt' in responseWithString.transactionOutcome.outcome).toBeTruthy();
        expect('tokensBurnt' in responseWithString.transactionOutcome.outcome).toBeTruthy();
        expect('executorId' in responseWithString.transactionOutcome.outcome).toBeTruthy();
        expect('status' in responseWithString.transactionOutcome.outcome).toBeTruthy();
        expect(responseWithString).toMatchObject(reciepts);
        expect(responseWithUint8Array).toMatchObject(reciepts);
    });

    test('json rpc query account', async () => {
        const account = await createAccount(near);
        const response = await near.provider.query({
            requestType: 'view_account',
            finality: 'optimistic',
            accountId: account.accountId,
        });
        // @ts-expect-error - code_hash exists in response but not in union type
        expect(response.codeHash).toEqual('11111111111111111111111111111111');
    });

    test('json rpc query view_state', async () => {
        const contract = await deployContract(near.account, generateUniqueString('test'));
        await contract.call.setValue({ args: { value: 'hello' }, account: near.account });

        return waitFor(async () => {
            const response = await near.provider.query({
                requestType: 'view_state',
                finality: 'final',
                accountId: contract.contractId,
                prefixBase64: '',
            });
            expect(response).toEqual({
                blockHeight: expect.any(Number),
                blockHash: expect.any(String),
                values: [{ key: 'bmFtZQ==', value: 'aGVsbG8=' }],
            });
        });
    });

    test('json rpc query view_code', async () => {
        const contract = await deployContract(near.account, generateUniqueString('test'));

        return waitFor(async () => {
            const response = await near.provider.query({
                requestType: 'view_code',
                finality: 'final',
                accountId: contract.contractId,
            });

            expect(response).toEqual({
                blockHeight: expect.any(Number),
                blockHash: expect.any(String),
                codeBase64: expect.any(String),
                hash: expect.any(String),
            });
        });
    });

    test('json rpc query call_function', async () => {
        const contract = await deployContract(near.account, generateUniqueString('test'));

        await contract.call.setValue({ args: { value: 'hello' }, account: near.account });

        return waitFor(async () => {
            const response = await near.provider.query({
                requestType: 'call_function',
                finality: 'final',
                accountId: contract.contractId,
                methodName: 'getValue',
                argsBase64: '',
            });
            expect(response).toEqual({
                blockHeight: expect.any(Number),
                blockHash: expect.any(String),
                logs: [],
                result: [34, 104, 101, 108, 108, 111, 34],
            });
        });
    });

    test('json rpc light client proof', async () => {
        const workingAccount = await createAccount(near);
        const executionOutcome = await workingAccount.transfer({
            receiverId: workingAccount.accountId,
            amount: 10000n,
        });

        async function waitForStatusMatching(isMatching: (status: RpcStatusResponse) => boolean) {
            const MAX_ATTEMPTS = 10;
            for (let i = 0; i < MAX_ATTEMPTS; i++) {
                await sleep(500);
                const nodeStatus = await near.provider.viewNodeStatus();
                if (isMatching(nodeStatus)) {
                    return nodeStatus;
                }
            }
            throw new Error(`Exceeded ${MAX_ATTEMPTS} attempts waiting for matching node status.`);
        }

        const comittedStatus = await waitForStatusMatching(
            (status) => status.syncInfo.latestBlockHash !== executionOutcome.transactionOutcome.blockHash
        );
        const BLOCKS_UNTIL_FINAL = 2;
        const finalizedStatus = await waitForStatusMatching(
            (status) =>
                status.syncInfo.latestBlockHeight > comittedStatus.syncInfo.latestBlockHeight + BLOCKS_UNTIL_FINAL
        );

        const block = await near.provider.viewBlock({ blockId: finalizedStatus.syncInfo.latestBlockHash });
        const lightClientHead = block.header.lastFinalBlock;
        let lightClientRequest: RpcLightClientExecutionProofRequest = {
            type: 'transaction',
            lightClientHead: lightClientHead,
            transactionHash: executionOutcome.transaction.hash,
            senderId: workingAccount.accountId,
        };

        const lightClientProof = await near.provider.lightClientProof(lightClientRequest);
        expect('prevBlockHash' in lightClientProof.blockHeaderLite).toBe(true);
        expect('innerRestHash' in lightClientProof.blockHeaderLite).toBe(true);
        expect('innerLite' in lightClientProof.blockHeaderLite).toBe(true);
        expect('timestampNanosec' in lightClientProof.blockHeaderLite.innerLite).toBe(true);
        expect(lightClientProof.outcomeProof.id).toEqual(executionOutcome.transactionOutcome.id);
        expect('blockHash' in lightClientProof.outcomeProof).toBe(true);
        expect(lightClientProof.outcomeRootProof).toEqual([]);
        expect(lightClientProof.blockProof.length).toBeGreaterThan(0);

        // pass nonexistent hash for light client head will fail
        lightClientRequest = {
            type: 'transaction',
            lightClientHead: '11111111111111111111111111111111',
            transactionHash: executionOutcome.transaction.hash,
            senderId: workingAccount.accountId,
        };
        await expect(near.provider.lightClientProof(lightClientRequest)).rejects.toThrow('Server error');

        // Use old block hash as light client head should fail
        lightClientRequest = {
            type: 'transaction',
            lightClientHead: executionOutcome.transactionOutcome.blockHash,
            transactionHash: executionOutcome.transaction.hash,
            senderId: workingAccount.accountId,
        };

        await expect(near.provider.lightClientProof(lightClientRequest)).rejects.toThrow('Server error');
    });
});

describe('providers errors', () => {
    test('JSON RPC Error - MethodNotFound', async () => {
        const contract = await deployContract(near.account, generateUniqueString('test'));

        await contract.call.setValue({ args: { value: 'hello' }, account: near.account });

        try {
            const response = await near.provider.query({
                requestType: 'call_function',
                finality: 'optimistic',
                accountId: contract.contractId,
                methodName: 'methodNameThatDoesNotExist',
                argsBase64: '',
            });
            expect(response).toBeUndefined();
        } catch (e) {
            expect((e as TypedError).message).toMatch(
                `RPC Error: wasm execution failed with error: MethodResolveError(MethodNotFound)`
            );
        }
    });

    test('JSON RPC Error - CodeDoesNotExist', async () => {
        const { accountId } = await createAccount(near);

        try {
            const response = await near.provider.query({
                requestType: 'call_function',
                finality: 'optimistic',
                accountId: accountId,
                methodName: 'methodNameThatDoesNotExistOnContractNotDeployed',
                argsBase64: '',
            });
            expect(response).toBeUndefined();
        } catch (e) {
            expect((e as Error).message).toMatch(
                `RPC Error: wasm execution failed with error: CompilationError(CodeDoesNotExist { account_id: "${accountId}" })`
            );
        }
    });

    test('JSON RPC Error - AccountDoesNotExist', async () => {
        const accountName = 'abc.near';
        try {
            const response = await near.provider.query({
                requestType: 'call_function',
                finality: 'optimistic',
                accountId: accountName,
                methodName: 'methodNameThatDoesNotExistOnContractNotDeployed',
                argsBase64: '',
            });
            expect(response).toBeUndefined();
        } catch (e) {
            expect((e as Error).message).toMatch('Server error');
        }
    });

    test('JSON RPC Error - AccessKeyDoesNotExist', async () => {
        const { accountId } = await createAccount(near);

        const pk = KeyPair.fromRandom('ed25519').getPublicKey();

        try {
            const response = await near.provider.query({
                requestType: 'view_access_key',
                finality: 'optimistic',
                accountId: accountId,
                publicKey: pk.toString(),
            });
            expect(response).toBeUndefined();
        } catch (e) {
            expect((e as Error).message).toMatch(`RPC Error: access key ${pk.toString()}`);
        }
    });
});
