
const nearlib = require('../lib/index');

test('json rpc fetch node status', async () => {
    const config = Object.assign(require('./config')(process.env.NODE_ENV || 'test'));
    const provider = new nearlib.providers.JsonRpcProvider(config.nodeUrl);
    let response = await provider.status();
    expect(response.chain_id).toContain('test-chain');
});

test('json rpc fetch block info', async () => {
    const config = Object.assign(require('./config')(process.env.NODE_ENV || 'test'));
    const provider = new nearlib.providers.JsonRpcProvider(config.nodeUrl);
    let response = await provider.block(1);
    expect(response.header.height).toEqual(1);
});

test('json rpc query account', async () => {
    const config = Object.assign(require('./config')(process.env.NODE_ENV || 'test'));
    const provider = new nearlib.providers.JsonRpcProvider(config.nodeUrl);
    let response = await provider.query('account/test.near', '');
    expect(response.code_hash).toEqual('11111111111111111111111111111111');
});

test('final tx result', async() => {
    const result = {
        status: 'Complete',
        transactions: [
            { hash: '11111', result: { status: 'completed', logs: [], receipts: [], result: null } },
            { hash: '11111', result: { status: 'completed', logs: [], receipts: [], result: 'e30=' } },
            { hash: '11111', result: { status: 'completed', logs: [], receipts: [], result: null } },
        ]
    };
    expect(nearlib.providers.getTransactionLastResult(result)).toEqual({});
});
