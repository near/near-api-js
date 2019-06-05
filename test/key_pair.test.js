
const nearlib = require('../lib/index');
const { sha256 } = require('js-sha256');

test('test sign and verify', async () => {
    const keyPair = new nearlib.utils.key_pair.KeyPairEd25519('26x56YPzPDro5t2smQfGcYAPy3j7R2jB2NUb7xKbAGK23B6x4WNQPh3twb6oDksFov5X8ts5CtntUNbpQpAKFdbR');
    expect(keyPair.publicKey).toEqual('AYWv9RAN1hpSQA4p1DLhCNnpnNXwxhfH9qeHN8B4nJ59');
    const message = new Uint8Array(sha256.array('message'));
    const signature = keyPair.sign(message);
    expect(nearlib.utils.serialize.base_encode(signature.signature)).toEqual('26gFr4xth7W9K7HPWAxq3BLsua8oTy378mC1MYFiEXHBBpeBjP8WmJEJo8XTBowetvqbRshcQEtBUdwQcAqDyP8T');
});

test('test sign and verify with random', async () => {
    const keyPair = nearlib.utils.key_pair.KeyPairEd25519.fromRandom();
    const message = new Uint8Array(sha256.array('message'));
    const signature = keyPair.sign(message);
    expect(keyPair.verify(message, signature.signature)).toBeTruthy();
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
