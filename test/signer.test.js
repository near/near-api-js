
const nearAPIJs = require('../lib/index');

test('test no key', async() => {
    const signer = new nearAPIJs.InMemorySigner(new nearAPIJs.keyStores.InMemoryKeyStore());
    await expect(signer.signMessage('message', 'user', 'network')).rejects.toThrow(/Key for user not found in network/);
});
