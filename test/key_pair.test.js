
const nearlib = require('../lib/index');
const { sha256 } = require('js-sha256');

test('test sign and verify with random', async () => {
    const keyPair = nearlib.utils.key_pair.KeyPairEd25519.fromRandom();
    const message = new Uint8Array(sha256.array('message'));
    const signature = keyPair.sign(message);
    expect(keyPair.verify(message, signature)).toBeTruthy();
});

test('test from secret', async () => {
    const keyPair = new nearlib.utils.key_pair.KeyPairEd25519('5JueXZhEEVqGVT5powZ5twyPP8wrap2K7RdAYGGdjBwiBdd7Hh6aQxMP1u3Ma9Yanq1nEv32EW7u8kUJsZ6f315C');
    expect(keyPair.publicKey).toEqual('EWrekY1deMND7N3Q7Dixxj12wD7AVjFRt2H9q21QHUSW');
});

test('convert to string', async () => {
    const keyPair = nearlib.utils.key_pair.KeyPairEd25519.fromRandom();
    const newKeyPair = nearlib.utils.key_pair.KeyPair.fromString(keyPair.toString());
    expect(newKeyPair.secretKey).toEqual(keyPair.secretKey);
});