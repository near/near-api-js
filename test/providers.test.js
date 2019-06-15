
const nearlib = require('../lib/index');

test('json rpc query account', async () => {
    const provider = new nearlib.providers.JsonRpcProvider('http://localhost:3030');
    let response = await provider.query('account/test.near', '');
    expect(response.account_id).toEqual('test.near');
});

test('final tx result', async() => {
    const result = {
        status: 'Complete',
        logs: [
            {hash: '11111', lines: [], receipts: [], result: null },
            { hash: '11111', lines: [], receipts: [], result: [123, 125] },
            { hash: '11111', lines: [], receipts: [], result: null },
        ]
    };
    expect(nearlib.providers.getTransactionLastResult(result)).toEqual({});
});
