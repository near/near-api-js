
const nearlib = require('../lib/index');

test('test no key', async() => {
    const signer = new nearlib.InMemorySigner(new nearlib.keyStores.InMemoryKeyStore());
    await expect(signer.signMessage('message', 'user', 'network')).rejects.toThrow(/Key for user not found in network/);
});
