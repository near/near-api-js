const nearlib = require('../lib/index');
const sha256 = require('js-sha256');

test('wrong number of arguments', () => {
    expect(() => nearlib.transactions.createAccount(1,2)).toThrow();
    expect(() => nearlib.transactions.deployContract()).toThrow();
    expect(() => nearlib.transactions.transfer()).toThrow();
    expect(() => nearlib.transactions.functionCall()).toThrow();
    expect(() => nearlib.transactions.stake(123)).toThrow();
    expect(() => nearlib.transactions.addKey('')).toThrow();
    expect(() => nearlib.transactions.deleteKey('', '')).toThrow();
    expect(() => nearlib.transactions.deleteAccount()).toThrow();
});

test('serialize transaction', () => {
    const keyPair = nearlib.utils.key_pair.KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw');
    const publicKey = keyPair.publicKey.toString();
    var transaction = nearlib.transactions.createTransaction('kiwi', keyPair.publicKey, 'speed', 1, [
        nearlib.transactions.createAccount(), 
        nearlib.transactions.transfer(0.1), 
        nearlib.transactions.addKey(
            nearlib.utils.key_pair.PublicKey.from(publicKey),
            nearlib.transactions.fullAccessKey()),
        ], 
        '0PL893ZxHbyJuAfVW3wb9vJ7Sqcs2LGa');
    const bytes = transaction.encode();
    const newTransaction = nearlib.transactions.Transaction.decode(bytes);
    const signingPayload = new Uint8Array(sha256.sha256.array(newTransaction.encode()));
    expect(nearlib.utils.serialize.base_encode(signingPayload)).toEqual('7BPy3DwqhcYg4Trr5RRb2nhVKTswz6kmBXUKReWzpxGQ');
});
