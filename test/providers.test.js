
const nearApi = require('../lib/index');
const testUtils  = require('./test-utils');
const BN = require('bn.js');

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
    let response = await provider.block(height);
    expect(response.header.height).toEqual(height);
    let sameBlock = await provider.block(response.header.hash);
    expect(sameBlock.header.height).toEqual(height);
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
    expect(validators.current_validators.length).toEqual(1);
}));

test('json rpc query account', withProvider(async (provider) => {
    let response = await provider.query('account/test.near', '');
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
    jest.setTimeout(30000);
    const nearjs = await testUtils.setUpTestConnection();
    const workingAccount = await testUtils.createAccount(await nearjs.account(testUtils.testAccountName), { amount: testUtils.INITIAL_BALANCE.mul(new BN(100)) });
    const sender = await testUtils.createAccount(workingAccount);
    const receiver = await testUtils.createAccount(workingAccount);
    const executionOutcome = await sender.sendMoney(receiver.accountId, new BN(10000));
    await testUtils.sleep(1000);
    const nodeStatus = await nearjs.connection.provider.status();
    const lightClientHead = nodeStatus.sync_info.latest_block_hash;
    const lightClientRequest = {
        type: 'transaction',
        light_client_head: lightClientHead,
        transaction_hash: executionOutcome.transaction.hash,
        sender_id: sender.accountId,
    };
    // wait until light client head is final
    await testUtils.sleep(2000);
    await nearjs.connection.provider.experimental_lightClientProof(lightClientRequest);
});
