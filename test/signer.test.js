
const nearApi = require('../lib/index');

test('test no key', async() => {
    const signer = new nearApi.InMemorySigner(new nearApi.keyStores.InMemoryKeyStore());
    await expect(signer.signMessage('message', 'user', 'network')).rejects.toThrow(/Key for user not found in network/);
});
