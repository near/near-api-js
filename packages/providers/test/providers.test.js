const { getTransactionLastResult } = require('@near-js/client-core');

const { JsonRpcProvider } = require('../lib');

jest.setTimeout(20000);

const withProvider = (fn) => {
    return () => fn(new JsonRpcProvider({ url: 'https://rpc.ci-testnet.near.org' }));
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
}));

test('json rpc fetch block changes', withProvider(async (provider) => {
    let stat = await provider.status();
    let height = stat.sync_info.latest_block_height - 1;
    let response = await provider.blockChanges({ blockId: height });

    expect(response).toMatchObject({
        block_hash: expect.any(String),
        changes: expect.any(Array)
    });
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

test('json rpc query with block_id', withProvider(async(provider) => {
    const stat = await provider.status();
    let block_id = stat.sync_info.latest_block_height - 1;

    const response = await provider.query({
        block_id,
        request_type: 'view_account',
        account_id: 'test.near'
    });

    expect(response).toEqual({
        block_height: expect.any(Number),
        block_hash: expect.any(String),
        amount: expect.any(String),
        locked: expect.any(String),
        code_hash: '11111111111111111111111111111111',
        storage_usage: 182,
        storage_paid_at: 0,
    });
}));

test('json rpc query view_account', withProvider(async (provider) => {
    const response = await provider.query({
        request_type: 'view_account',
        finality: 'final',
        account_id: 'test.near'
    });

    expect(response).toEqual({
        block_height: expect.any(Number),
        block_hash: expect.any(String),
        amount: expect.any(String),
        locked: expect.any(String),
        code_hash: '11111111111111111111111111111111',
        storage_usage: 182,
        storage_paid_at: 0,
    });
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
    expect(getTransactionLastResult(result)).toEqual({});
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
    expect(getTransactionLastResult(result)).toEqual(null);
});

test('json rpc fetch protocol config', withProvider(async (provider) => {
    const status = await provider.status();
    const blockHeight = status.sync_info.latest_block_height;
    const blockHash = status.sync_info.latest_block_hash;
    for (const blockReference of [{ sync_checkpoint: 'genesis' }, { blockId: blockHeight }, { blockId: blockHash }, { finality: 'final' }, { finality: 'optimistic' }]) {
        const response = await provider.experimental_protocolConfig(blockReference);
        expect('chain_id' in response).toBe(true);
        expect('genesis_height' in response).toBe(true);
        expect('runtime_config' in response).toBe(true);
        expect('storage_amount_per_byte' in response.runtime_config).toBe(true);
    }
}));

test('json rpc gas price', withProvider(async (provider) => {
    let status = await provider.status();
    let positiveIntegerRegex = /^[+]?\d+([.]\d+)?$/;

    let response1 = await provider.gasPrice(status.sync_info.latest_block_height);
    expect(response1.gas_price).toMatch(positiveIntegerRegex);

    let response2 = await provider.gasPrice(status.sync_info.latest_block_hash);
    expect(response2.gas_price).toMatch(positiveIntegerRegex);

    let response3 = await provider.gasPrice();
    expect(response3.gas_price).toMatch(positiveIntegerRegex);
}));

test('JsonRpc connection object exist without connectionInfo provided', async () => {
    const provider = new JsonRpcProvider();
    expect(provider.connection).toStrictEqual({ url: '' });
});

test('near json rpc fetch node status', async () => {
    const provider = new JsonRpcProvider({ url: 'https://rpc.ci-testnet.near.org' });
    let response = await provider.status();
    expect(response.chain_id).toBeTruthy();
});
