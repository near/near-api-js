
const nearlib = require('../lib/index');

test('test query account', async () => {
    const provider = new nearlib.providers.JsonRpcProvider('http://localhost:3030');
    let response = await provider.query('account/test.near', '');
    expect(response.result.key).toEqual(nearlib.utils.serialize.base_encode('account/test.near'));
});
