
const nearlib = require('../index');
const { sha256 } = require('js-sha256');

test('test sign and verify with random', async () => {
    const keyPair = nearlib.utils.key_pair.KeyPairEd25519.fromRandom();
    const message = sha256('message');
    const signature = keyPair.sign(message);
    expect(keyPair.verify(message, signature)).toBeTruthy();
});

test('test from secret', async () => {
    const keyPair = new nearlib.utils.key_pair.KeyPairEd25519('5JueXZhEEVqGVT5powZ5twyPP8wrap2K7RdAYGGdjBwiBdd7Hh6aQxMP1u3Ma9Yanq1nEv32EW7u8kUJsZ6f315C');
    expect(keyPair.publicKey).toEqual('9qvRnknMy3jiYbjB8WuHdai39BBo8hPobdEqh76EBQG');
});
