const { InMemoryKeyStore } = require('@near-js/keystores');

const { InMemorySigner } = require('../lib');

test('test no key', async() => {
    const signer = new InMemorySigner(new InMemoryKeyStore());
    await expect(signer.signMessage('message', 'user', 'network'))
        .rejects.toThrow(/Key for user not found in network/);
});
