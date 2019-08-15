
const nearlib = require('../lib/index');
const BN = require('BN.js');

class Test {
    constructor(x, y, z, q) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.q = q;
    }
}

test('serialize object', async () => {
    const value = new Test(10, 20, '123', [1, 2, 3]);
    const schema = { 'Test': {kind: 'struct', fields: [['x', 'u8'], ['y', 'u64'], ['z', 'string'], ['q', [3]]] } };
    let buf = nearlib.utils.serialize.serialize(schema, value);
    let new_value = nearlib.utils.serialize.deserialize(schema, Test, buf);
    expect(new_value.x).toEqual(10);
    expect(new_value.y.toString()).toEqual('20');
    expect(new_value.z).toEqual('123');
    expect(new_value.q).toEqual(new Uint8Array([1, 2, 3]));
});

test('serialize tx', async() => {
    const keyStore = new nearlib.keyStores.InMemoryKeyStore();
    await keyStore.setKey("test", "test.near", nearlib.utils.KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw'));
    const publicKey = (await keyStore.getKey("test", "test.near")).publicKey;
    const actions = [
        nearlib.transactions.createAccount(),
        nearlib.transactions.deployContract(new Uint8Array([1, 2, 3])),
        nearlib.transactions.functionCall("qqq", new Uint8Array([1, 2, 3]), 1000, 1000000),
        nearlib.transactions.transfer(123),
        nearlib.transactions.stake(1000000, publicKey),
        nearlib.transactions.addKey(publicKey, nearlib.transactions.createAccessKey("321", null, "123", 1)),
        nearlib.transactions.deleteKey(publicKey),
        nearlib.transactions.deleteAccount("123")
    ];
    let [hash, signedTx] = await nearlib.transactions.signTransaction("123", 1, actions, new nearlib.InMemorySigner(keyStore), "test.near", "test");
    expect(nearlib.utils.serialize.base_encode(hash)).toEqual("6jaty3HYh35hQUj2PSN4rhVoZXx5EZ1xUBhBgXjko8fa");
});