import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import { KeyPair } from '@near-js/crypto';
import { ErrorMessages } from '@near-js/utils';
import { base58 } from '@scure/base';

import { createAccount, deployContract, generateUniqueString, setUpTestConnection, sleep, waitFor } from './test-utils';

import { Worker } from 'near-workspaces';

jest.setTimeout(60000);

let provider;
let near;


beforeAll(async () => {
    near = await setUpTestConnection();
    provider = near.connection.provider;
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
        const outcome = await sender.sendMoney(receiver.accountId, 1n);
        const responseWithString = await provider.txStatus(outcome.transaction.hash, sender.accountId);
        const responseWithUint8Array = await provider.txStatus(base58.decode(outcome.transaction.hash), sender.accountId);
        expect(responseWithString).toMatchObject(outcome);
        expect(responseWithUint8Array).toMatchObject(outcome);
    });
    
    test('txStatusReciept with string hash and buffer hash', async () => {
        const sender = await createAccount(near);
        const receiver = await createAccount(near);
        const outcome = await sender.sendMoney(receiver.accountId, 1n);
        const reciepts = await provider.sendJsonRpc('EXPERIMENTAL_tx_status', [outcome.transaction.hash, sender.accountId]);
    
        const responseWithString = await provider.txStatusReceipts(outcome.transaction.hash, sender.accountId);
        const responseWithUint8Array = await provider.txStatusReceipts(base58.decode(outcome.transaction.hash), sender.accountId);
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
        const response = await provider.query({
            request_type: 'view_account',
            finality: 'optimistic',
            account_id: account.accountId });
        expect(response.code_hash).toEqual('11111111111111111111111111111111');
    });
    
    test('json rpc query view_state', async () => {
        const contract = await deployContract(near.accountCreator.masterAccount, generateUniqueString('test'));
        await contract.call.setValue({ args: { value: 'hello' }, account: near.accountCreator.masterAccount });
    
        return waitFor(async () => {
            const response = await provider.query({
                request_type: 'view_state',
                finality: 'final',
                account_id: contract.contractId,
                prefix_base64: ''
            });
            expect(response).toEqual({
                block_height: expect.any(Number),
                block_hash: expect.any(String),
                values: [
                    { key: 'bmFtZQ==', value: 'aGVsbG8=' }
                ]
            });
        });
    });
    
    test('json rpc query view_code', async () => {
        const contract = await deployContract(near.accountCreator.masterAccount, generateUniqueString('test'));
    
        return waitFor(async () => {
            const response = await provider.query({
                request_type: 'view_code',
                finality: 'final',
                account_id: contract.contractId
            });
    
            expect(response).toEqual({
                block_height: expect.any(Number),
                block_hash: expect.any(String),
                code_base64: expect.any(String),
                hash: expect.any(String)
            });
        });
    });
    
    test('json rpc query call_function', async () => {
        const contract = await deployContract(near.accountCreator.masterAccount, generateUniqueString('test'));

        await contract.call.setValue({ args: { value: 'hello' }, account: near.accountCreator.masterAccount });
    
        return waitFor(async () => {
            const response = await provider.query({
                request_type: 'call_function',
                finality: 'final',
                account_id: contract.contractId,
                method_name: 'getValue',
                args_base64: ''
            });
            expect(response).toEqual({
                block_height: expect.any(Number),
                block_hash: expect.any(String),
                logs: [],
                result: [
                    34,
                    104,
                    101,
                    108,
                    108,
                    111,
                    34
                ]
            });
        });
    });
    
    test('json rpc light client proof', async () => {
        const workingAccount = await createAccount(near);
        const executionOutcome = await workingAccount.sendMoney(workingAccount.accountId, 10000n);
        const provider = near.connection.provider;
    
        async function waitForStatusMatching(isMatching) {
            const MAX_ATTEMPTS = 10;
            for (let i = 0; i < MAX_ATTEMPTS; i++) {
                await sleep(500);
                const nodeStatus = await provider.status();
                if (isMatching(nodeStatus)) {
                    return nodeStatus;
                }
            }
            throw new Error(`Exceeded ${MAX_ATTEMPTS} attempts waiting for matching node status.`);
        }
    
        const comittedStatus = await waitForStatusMatching(status =>
            // @ts-expect-error test input
            status.sync_info.latest_block_hash !== executionOutcome.transaction_outcome.block_hash);
        const BLOCKS_UNTIL_FINAL = 2;
        const finalizedStatus = await waitForStatusMatching(status =>
            status.sync_info.latest_block_height > comittedStatus.sync_info.latest_block_height + BLOCKS_UNTIL_FINAL);
    
        const block = await provider.block({ blockId: finalizedStatus.sync_info.latest_block_hash });
        const lightClientHead = block.header.last_final_block;
        let lightClientRequest = {
            type: 'transaction',
            light_client_head: lightClientHead,
            transaction_hash: executionOutcome.transaction.hash,
            sender_id: workingAccount.accountId,
        };
        const lightClientProof = await provider.lightClientProof(lightClientRequest);
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
            type: 'transaction',
            light_client_head: '11111111111111111111111111111111',
            transaction_hash: executionOutcome.transaction.hash,
            sender_id: workingAccount.accountId,
        };
        await expect(provider.lightClientProof(lightClientRequest)).rejects.toThrow('DB Not Found Error');
    
        // Use old block hash as light client head should fail
        lightClientRequest = {
            type: 'transaction',
            // @ts-expect-error test input
            light_client_head: executionOutcome.transaction_outcome.block_hash,
            transaction_hash: executionOutcome.transaction.hash,
            sender_id: workingAccount.accountId,
        };
    
        await expect(provider.lightClientProof(lightClientRequest)).rejects.toThrow(/.+ block .+ is ahead of head block .+/);
    });
});

describe('providers errors', () => {
    test('JSON RPC Error - MethodNotFound', async () => {
        const contract = await deployContract(
            near.accountCreator.masterAccount,
            generateUniqueString('test')
        );

        try {
            const response = await provider.query({
                request_type: 'call_function',
                finality: 'optimistic',
                account_id: contract.contractId,
                method_name: 'methodNameThatDoesNotExist',
                args_base64: '',
            });
            expect(response).toBeUndefined();
        } catch (e) {
            const errorType = 'MethodNotFound';
            expect(e.type).toEqual(errorType);
            expect(e.message).toEqual(ErrorMessages[errorType]);
        }
    });

    test('JSON RPC Error - CodeDoesNotExist', async () => {
        const { accountId } = await createAccount(near);

        try {
            const response = await provider.query({
                request_type: 'call_function',
                finality: 'optimistic',
                account_id: accountId,
                method_name: 'methodNameThatDoesNotExistOnContractNotDeployed',
                args_base64: '',
            });
            expect(response).toBeUndefined();
        } catch (e) {
            const errorType = 'CodeDoesNotExist';
            expect(e.type).toEqual(errorType);
            expect(e.message.split(' ').slice(0, 5)).toEqual(
                ErrorMessages[errorType].split(' ').slice(0, 5)
            );
        }
    });

    test('JSON RPC Error - AccountDoesNotExist', async () => {
        const accountName = 'abc.near';
        try {
            const response = await provider.query({
                request_type: 'call_function',
                finality: 'optimistic',
                account_id: accountName,
                method_name: 'methodNameThatDoesNotExistOnContractNotDeployed',
                args_base64: '',
            });
            expect(response).toBeUndefined();
        } catch (e) {
            const errorType = 'AccountDoesNotExist';
            expect(e.type).toEqual(errorType);
            expect(e.message.split(' ').slice(0, 5)).toEqual(
                ErrorMessages[errorType].split(' ').slice(0, 5)
            );
        }
    });

    test('JSON RPC Error - AccessKeyDoesNotExist', async () => {
        const { accountId } = await createAccount(near);

        try {
            const response = await provider.query({
                request_type: 'view_access_key',
                finality: 'optimistic',
                account_id: accountId,
                public_key: KeyPair.fromRandom('ed25519')
                    .getPublicKey()
                    .toString(),
            });
            expect(response).toBeUndefined();
        } catch (e) {
            const errorType = 'AccessKeyDoesNotExist';
            expect(e.type).toEqual(errorType);
            expect(e.message.split(' ').slice(0, 5)).toEqual(
                ErrorMessages[errorType].split(' ').slice(0, 5)
            );
        }
    });
});

