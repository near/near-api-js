import { JsonRpcProvider } from '@near-js/providers';
import BN from 'bn.js';
import base58 from 'bs58';

import testUtils from './test-utils.js';

jest.setTimeout(20000);

const withProvider = (fn) => {
    const config = Object.assign(require('./config')(process.env.NODE_ENV || 'test'));
    const provider = new JsonRpcProvider(config.nodeUrl);
    return () => fn(provider);
};

test('txStatus with string hash and buffer hash', withProvider(async(provider) => {
    const near = await testUtils.setUpTestConnection();
    const sender = await testUtils.createAccount(near);
    const receiver = await testUtils.createAccount(near);
    const outcome = await sender.sendMoney(receiver.accountId, new BN('1'));

    const responseWithString = await provider.txStatus(outcome.transaction.hash, sender.accountId);
    const responseWithUint8Array = await provider.txStatus(base58.decode(outcome.transaction.hash), sender.accountId);
    expect(responseWithString).toMatchObject(outcome);
    expect(responseWithUint8Array).toMatchObject(outcome);
}));

test('txStatusReciept with string hash and buffer hash', withProvider(async(provider) => {
    const near = await testUtils.setUpTestConnection();
    const sender = await testUtils.createAccount(near);
    const receiver = await testUtils.createAccount(near);
    const outcome = await sender.sendMoney(receiver.accountId, new BN('1'));
    const reciepts = await provider.sendJsonRpc('EXPERIMENTAL_tx_status', [outcome.transaction.hash, sender.accountId]);

    const responseWithString = await provider.txStatusReceipts(outcome.transaction.hash, sender.accountId);
    const responseWithUint8Array = await provider.txStatusReceipts(base58.decode(outcome.transaction.hash), sender.accountId);
    expect(responseWithString).toMatchObject(reciepts);
    expect(responseWithUint8Array).toMatchObject(reciepts);
}));

test('json rpc query account', withProvider(async (provider) => {
    const near = await testUtils.setUpTestConnection();
    const account = await testUtils.createAccount(near);
    let response = await provider.query(`account/${account.accountId}`, '');
    expect(response.code_hash).toEqual('11111111111111111111111111111111');
}));

test('json rpc query view_state', withProvider(async (provider) => {
    const near = await testUtils.setUpTestConnection();
    const account = await testUtils.createAccount(near);
    const contract = await testUtils.deployContract(account, testUtils.generateUniqueString('test'));

    await contract.setValue({ args: { value: 'hello' }});

    return testUtils.waitFor(async() => {
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
                { key: 'bmFtZQ==', value: 'aGVsbG8=', proof: [] }
            ],
            proof: []
        });
    });
}));

test('json rpc query view_code', withProvider(async (provider) => {
    const near = await testUtils.setUpTestConnection();
    const account = await testUtils.createAccount(near);
    const contract = await testUtils.deployContract(account, testUtils.generateUniqueString('test'));

    return testUtils.waitFor(async() => {
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
}));

test('json rpc query call_function', withProvider(async (provider) => {
    const near = await testUtils.setUpTestConnection();
    const account = await testUtils.createAccount(near);
    const contract = await testUtils.deployContract(account, testUtils.generateUniqueString('test'));

    await contract.setValue({ args: { value: 'hello' }});

    return testUtils.waitFor(async() => {
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
}));

test('json rpc light client proof', async() => {
    const near = await testUtils.setUpTestConnection();
    const workingAccount = await testUtils.createAccount(near);
    const executionOutcome = await workingAccount.sendMoney(workingAccount.accountId, new BN(10000));
    const provider = near.connection.provider;

    async function waitForStatusMatching(isMatching) {
        const MAX_ATTEMPTS = 10;
        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            await testUtils.sleep(500);
            const nodeStatus = await provider.status();
            if (isMatching(nodeStatus)) {
                return nodeStatus;
            }
        }
        throw new Error(`Exceeded ${MAX_ATTEMPTS} attempts waiting for matching node status.`);
    }

    const comittedStatus = await waitForStatusMatching(status =>
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
        light_client_head: executionOutcome.transaction_outcome.block_hash,
        transaction_hash: executionOutcome.transaction.hash,
        sender_id: workingAccount.accountId,
    };

    await expect(provider.lightClientProof(lightClientRequest)).rejects.toThrow(/.+ block .+ is ahead of head block .+/);
});
