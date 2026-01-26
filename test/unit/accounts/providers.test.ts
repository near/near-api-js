import { base58 } from '@scure/base';
import type { Worker } from 'near-workspaces';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { IdType, KeyPair } from '../../../src/index.js';
import {
    ContractCodeDoesNotExistError,
    ContractMethodNotFoundError,
} from '../../../src/providers/errors/contract_execution.js';
import {
    AccessKeyDoesNotExistError,
    AccountDoesNotExistError,
    UnknownBlockError,
} from '../../../src/providers/errors/handler.js';
import { RpcMethodNotFoundError, RpcRequestParseError } from '../../../src/providers/errors/request_validation.js';
import { InternalRpcError } from '../../../src/providers/errors/rpc.js';
import {
    createAccount,
    deployContract,
    generateUniqueString,
    setUpTestConnection,
    sleep,
    waitFor,
} from './test-utils.js';

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
        const reciepts = await near.provider.sendJsonRpc('EXPERIMENTAL_tx_status', [
            outcome.transaction.hash,
            sender.accountId,
        ]);

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
        expect('transaction_outcome' in responseWithString).toBeTruthy();
        expect('logs' in responseWithString.transaction_outcome.outcome).toBeTruthy();
        expect('receipt_ids' in responseWithString.transaction_outcome.outcome).toBeTruthy();
        expect('gas_burnt' in responseWithString.transaction_outcome.outcome).toBeTruthy();
        expect('tokens_burnt' in responseWithString.transaction_outcome.outcome).toBeTruthy();
        expect('executor_id' in responseWithString.transaction_outcome.outcome).toBeTruthy();
        expect('status' in responseWithString.transaction_outcome.outcome).toBeTruthy();
        expect(responseWithString).toMatchObject(reciepts);
        expect(responseWithUint8Array).toMatchObject(reciepts);
    });

    test('json rpc query account', async () => {
        const account = await createAccount(near);
        const response = await near.provider.query({
            request_type: 'view_account',
            finality: 'optimistic',
            account_id: account.accountId,
        });
        expect(response.code_hash).toEqual('11111111111111111111111111111111');
    });

    test('json rpc query view_state', async () => {
        const contract = await deployContract(near.account, generateUniqueString('test'));
        await contract.call.setValue({ args: { value: 'hello' }, account: near.account });

        return waitFor(async () => {
            const response = await near.provider.query({
                request_type: 'view_state',
                finality: 'final',
                account_id: contract.contractId,
                prefix_base64: '',
            });
            expect(response).toEqual({
                block_height: expect.any(Number),
                block_hash: expect.any(String),
                values: [{ key: 'bmFtZQ==', value: 'aGVsbG8=' }],
            });
        });
    });

    test('json rpc query view_code', async () => {
        const contract = await deployContract(near.account, generateUniqueString('test'));

        return waitFor(async () => {
            const response = await near.provider.query({
                request_type: 'view_code',
                finality: 'final',
                account_id: contract.contractId,
            });

            expect(response).toEqual({
                block_height: expect.any(Number),
                block_hash: expect.any(String),
                code_base64: expect.any(String),
                hash: expect.any(String),
            });
        });
    });

    test('json rpc query call_function', async () => {
        const contract = await deployContract(near.account, generateUniqueString('test'));

        await contract.call.setValue({ args: { value: 'hello' }, account: near.account });

        return waitFor(async () => {
            const response = await near.provider.query({
                request_type: 'call_function',
                finality: 'final',
                account_id: contract.contractId,
                method_name: 'getValue',
                args_base64: '',
            });
            expect(response).toEqual({
                block_height: expect.any(Number),
                block_hash: expect.any(String),
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

        async function waitForStatusMatching(isMatching) {
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
            (status) => status.sync_info.latest_block_hash !== executionOutcome.transaction_outcome.block_hash
        );
        const BLOCKS_UNTIL_FINAL = 2;
        const finalizedStatus = await waitForStatusMatching(
            (status) =>
                status.sync_info.latest_block_height > comittedStatus.sync_info.latest_block_height + BLOCKS_UNTIL_FINAL
        );

        const block = await near.provider.viewBlock({ blockId: finalizedStatus.sync_info.latest_block_hash });
        const lightClientHead = block.header.last_final_block;
        let lightClientRequest = {
            type: IdType.Transaction,
            light_client_head: lightClientHead,
            transaction_hash: executionOutcome.transaction.hash,
            sender_id: workingAccount.accountId,
        };
        const lightClientProof = await near.provider.lightClientProof(lightClientRequest);
        expect('prev_block_hash' in lightClientProof.block_header_lite).toBe(true);
        expect('inner_rest_hash' in lightClientProof.block_header_lite).toBe(true);
        expect('inner_lite' in lightClientProof.block_header_lite).toBe(true);
        expect('timestamp_nanosec' in lightClientProof.block_header_lite.inner_lite).toBe(true);
        expect(lightClientProof.outcome_proof.id).toEqual(executionOutcome.transaction_outcome.id);
        expect('block_hash' in lightClientProof.outcome_proof).toBe(true);
        expect(lightClientProof.outcome_root_proof).toEqual([]);
        expect(lightClientProof.block_proof.length).toBeGreaterThan(0);

        // pass nonexistent hash for light client head will fail
        lightClientRequest = {
            type: IdType.Transaction,
            light_client_head: '11111111111111111111111111111111',
            transaction_hash: executionOutcome.transaction.hash,
            sender_id: workingAccount.accountId,
        };
        await expect(near.provider.lightClientProof(lightClientRequest)).rejects.toThrow(UnknownBlockError);

        // Use old block hash as light client head should fail
        lightClientRequest = {
            type: IdType.Transaction,
            light_client_head: executionOutcome.transaction_outcome.block_hash,
            transaction_hash: executionOutcome.transaction.hash,
            sender_id: workingAccount.accountId,
        };

        try {
            await near.provider.lightClientProof(lightClientRequest);

            expect.fail('should have thrown');
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(InternalRpcError);
            expect((thrown as InternalRpcError).message).toMatch(/block .+ is ahead of head block .+/);
        }
    });
});

describe('providers errors', () => {
    test('JSON RPC Error - MethodNotFound', async () => {
        const contract = await deployContract(near.account, generateUniqueString('test'));

        await contract.call.setValue({ args: { value: 'hello' }, account: near.account });

        try {
            const response = await near.provider.query({
                request_type: 'call_function',
                finality: 'optimistic',
                account_id: contract.contractId,
                method_name: 'methodNameThatDoesNotExist',
                args_base64: '',
            });
            expect(response).toBeUndefined();
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(ContractMethodNotFoundError);
        }
    });

    test('JSON RPC Error - CodeDoesNotExist', async () => {
        const { accountId } = await createAccount(near);

        try {
            const response = await near.provider.query({
                request_type: 'call_function',
                finality: 'optimistic',
                account_id: accountId,
                method_name: 'methodNameThatDoesNotExistOnContractNotDeployed',
                args_base64: '',
            });
            expect(response).toBeUndefined();
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(ContractCodeDoesNotExistError);
            expect((thrown as ContractCodeDoesNotExistError).contractId).toEqual(accountId);
        }
    });

    test('JSON RPC Error - AccountDoesNotExist', async () => {
        const accountName = 'abc.near';
        try {
            const response = await near.provider.query({
                request_type: 'call_function',
                finality: 'optimistic',
                account_id: accountName,
                method_name: 'methodNameThatDoesNotExistOnContractNotDeployed',
                args_base64: '',
            });
            expect(response).toBeUndefined();
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(AccountDoesNotExistError);
            expect((thrown as AccountDoesNotExistError).accountId).toEqual(accountName);
        }
    });

    test('JSON RPC Error - AccessKeyDoesNotExist', async () => {
        const { accountId } = await createAccount(near);

        const pk = KeyPair.fromRandom('ed25519').getPublicKey().toString();

        try {
            const response = await near.provider.query({
                request_type: 'view_access_key',
                finality: 'optimistic',
                account_id: accountId,
                public_key: pk,
            });
            expect(response).toBeUndefined();
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(AccessKeyDoesNotExistError);
            expect((thrown as AccessKeyDoesNotExistError).publicKey.toString()).toEqual(pk);
        }
    });

    test('JSON RPC Error - RpcMethodNotFoundError', async () => {
        try {
            await near.provider.sendJsonRpc('unknown_rpc_method', {});

            expect.fail('should have thrown');
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(RpcMethodNotFoundError);
            expect((thrown as RpcMethodNotFoundError).methodName).toEqual('unknown_rpc_method');
        }
    });

    test('JSON RPC Error - RpcRequestParseError because of unknown arguments', async () => {
        try {
            await near.provider.sendJsonRpc('block', {
                unknown_arg: 'some_value',
            });

            expect.fail('should have thrown');
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(RpcRequestParseError);
        }
    });

    test('JSON RPC Error - RpcRequestParseError because of missing arguments', async () => {
        try {
            await near.provider.sendJsonRpc('block', {});

            expect.fail('should have thrown');
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(RpcRequestParseError);
        }
    });

    test('JSON RPC Error - RpcRequestParseError because of invalid signed_tx_base64 payload', async () => {
        try {
            await near.provider.sendJsonRpc('send_tx', { signed_tx_base64: 'e30', wait_until: 'EXECUTED_OPTIMISTIC' });

            expect.fail('should have thrown');
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(RpcRequestParseError);
        }
    });

    test('JSON RPC Error - RpcRequestParseError because of invalid account ID', async () => {
        try {
            await near.provider.viewAccount({ accountId: '%41s0=--11.near', blockQuery: { finality: 'optimistic' } });

            expect.fail('should have thrown');
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(RpcRequestParseError);
        }
    });

    test('JSON RPC Error - UnknownBlockError because of unknown block height', async () => {
        try {
            await near.provider.sendJsonRpc('block', {
                block_id: 1_000_000_000,
            });

            expect.fail('should have thrown');
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(UnknownBlockError);
        }
    });

    test('JSON RPC Error - UnknownBlockError because of unknown block hash', async () => {
        try {
            await near.provider.sendJsonRpc('block', {
                block_id: 'AVmZ29QFkWtPUuhrerpYcWp3AdxP5jZRp1XAy68AR3Md',
            });

            expect.fail('should have thrown');
        } catch (thrown: unknown) {
            expect(thrown).toBeInstanceOf(UnknownBlockError);
        }
    });
});
