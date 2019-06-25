
const nearlib = require('../lib/index');

test('test no key', async() => {
    const signer = new nearlib.InMemorySigner(new nearlib.keyStores.InMemoryKeyStore());
    expect(await signer.signMessage('message', 'user', 'network')).toBeNull();
});
