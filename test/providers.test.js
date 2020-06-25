
const nearApi = require('../lib/index');
const testUtils  = require('./test-utils');
const BN = require('bn.js');

jest.setTimeout(20000);

const withProvider = (fn) => {
    const config = Object.assign(require('./config')(process.env.NODE_ENV || 'test'));
    const provider = new nearApi.providers.JsonRpcProvider(config.nodeUrl);
    return () => fn(provider);
};

test('json rpc fetch node status', withProvider(async (provider) => {
    let response = await provider.status();
    expect(response.chain_id).toBeTruthy();
}));

test('json rpc fetch block info', withProvider(async (provider) => {
    let stat = await provider.status();
    let height = stat.sync_info.latest_block_height - 1;
    let response = await provider.block({ blockId: height });
    expect(response.header.height).toEqual(height);

    let sameBlock = await provider.block({ blockId: response.header.hash });
    expect(sameBlock.header.height).toEqual(height);

    let optimisticBlock = await provider.block({ finality: 'optimistic' });
    expect(optimisticBlock.header.height - height).toBeLessThan(5);

    let nearFinalBlock = await provider.block({ finality: 'near-final' });
    expect(nearFinalBlock.header.height - height).toBeLessThan(5);

    let finalBlock = await provider.block({ finality: 'final' });
    expect(finalBlock.header.height - height).toBeLessThan(5);

    let deprecatedStyle = await provider.block(height);
    expect(deprecatedStyle.header.height).toEqual(height);
}));

test('json rpc fetch chunk info', withProvider(async (provider) => {
    let stat = await provider.status();
    let height = stat.sync_info.latest_block_height - 1;
    let response = await provider.chunk([height, 0]);
    expect(response.header.shard_id).toEqual(0);
    let sameChunk = await provider.chunk(response.header.chunk_hash);
    expect(sameChunk.header.chunk_hash).toEqual(response.header.chunk_hash);
    expect(sameChunk.header.shard_id).toEqual(0);
}));

test('json rpc fetch validators info', withProvider(async (provider) => {
    let validators = await provider.validators(null);
    expect(validators.current_validators.length).toBeGreaterThanOrEqual(1);
}));

test('json rpc query account', withProvider(async (provider) => {
    const near = await testUtils.setUpTestConnection();
    const account = await testUtils.createAccount(near);
    let response = await provider.query(`account/${account.accountId}`, '');
    expect(response.code_hash).toEqual('11111111111111111111111111111111');
}));

test('final tx result', async() => {
    const result = {
        status: { SuccessValue: 'e30=' },
        transaction: { id: '11111', outcome: { status: { SuccessReceiptId: '11112' }, logs: [], receipt_ids: ['11112'], gas_burnt: 1 } },
        receipts: [
            { id: '11112', outcome: { status: { SuccessValue: 'e30=' }, logs: [], receipt_ids: ['11112'], gas_burnt: 9001 } },
            { id: '11113', outcome: { status: { SuccessValue: '' }, logs: [], receipt_ids: [], gas_burnt: 0 } }
        ]
    };
    expect(nearApi.providers.getTransactionLastResult(result)).toEqual({});
});

test('final tx result with null', async() => {
    const result = {
        status: 'Failure',
        transaction: { id: '11111', outcome: { status: { SuccessReceiptId: '11112' }, logs: [], receipt_ids: ['11112'], gas_burnt: 1 } },
        receipts: [
            { id: '11112', outcome: { status: 'Failure', logs: [], receipt_ids: ['11112'], gas_burnt: 9001 } },
            { id: '11113', outcome: { status: { SuccessValue: '' }, logs: [], receipt_ids: [], gas_burnt: 0 } }
        ]
    };
    expect(nearApi.providers.getTransactionLastResult(result)).toEqual(null);
});

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

    const block = await provider.block(finalizedStatus.sync_info.latest_block_hash);
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
