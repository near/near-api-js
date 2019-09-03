
const nearlib = require('../lib/index');

class Test {
    constructor(x, y, z, q) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.q = q;
    }
}

test('serialize object', async () => {
    const value = new Test(255, 20, '123', [1, 2, 3]);
    const schema = new Map([[Test, {kind: 'struct', fields: [['x', 'u8'], ['y', 'u64'], ['z', 'string'], ['q', [3]]] }]]);
    let buf = nearlib.utils.serialize.serialize(schema, value);
    let new_value = nearlib.utils.serialize.deserialize(schema, Test, buf);
    expect(new_value.x).toEqual(255);
    expect(new_value.y.toString()).toEqual('20');
    expect(new_value.z).toEqual('123');
    expect(new_value.q).toEqual(new Uint8Array([1, 2, 3]));
});

test('serialize and sign multi-action tx', async() => {
    const keyStore = new nearlib.keyStores.InMemoryKeyStore();
    const keyPair = nearlib.utils.KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw');
    await keyStore.setKey('test', 'test.near', keyPair);
    const publicKey = keyPair.publicKey;
    const actions = [
        nearlib.transactions.createAccount(),
        nearlib.transactions.deployContract(new Uint8Array([1, 2, 3])),
        nearlib.transactions.functionCall('qqq', new Uint8Array([1, 2, 3]), 1000, 1000000),
        nearlib.transactions.transfer(123),
        nearlib.transactions.stake(1000000, publicKey),
        nearlib.transactions.addKey(publicKey, nearlib.transactions.functionCallAccessKey('zzz', ['www'], null)),
        nearlib.transactions.deleteKey(publicKey),
        nearlib.transactions.deleteAccount('123')
    ];
    const blockHash = nearlib.utils.serialize.base_decode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');
    let [hash] = await nearlib.transactions.signTransaction('123', 1, actions, blockHash, new nearlib.InMemorySigner(keyStore), 'test.near', 'test');
    expect(nearlib.utils.serialize.base_encode(hash)).toEqual('Fo3MJ9XzKjnKuDuQKhDAC6fra5H2UWawRejFSEpPNk3Y');
});

test('serialize transfer tx', async() => {
    const actions = [
        nearlib.transactions.transfer(1),
    ];
    const blockHash = nearlib.utils.serialize.base_decode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');
    const transaction = new nearlib.transactions.Transaction({
        signerId: 'test.near',
        publicKey: nearlib.utils.PublicKey.fromString('Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC'),
        nonce: 1,
        receiverId: 'whatever.near',
        actions,
        blockHash
    });
    const serialized = nearlib.utils.serialize.serialize(nearlib.transactions.SCHEMA, transaction);
    expect(serialized.toString('hex')).toEqual('09000000746573742e6e65617200917b3d268d4b58f7fec1b150bd68d69be3ee5d4cc39855e341538465bb77860d01000000000000000d00000077686174657665722e6e6561720fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef6010000000301000000000000000000000000000000');
});

test('serialize and sign transfer tx', async() => {
    const keyStore = new nearlib.keyStores.InMemoryKeyStore();
    const keyPair = nearlib.utils.KeyPair.fromString('ed25519:3hoMW1HvnRLSFCLZnvPzWeoGwtdHzke34B2cTHM8rhcbG3TbuLKtShTv3DvyejnXKXKBiV7YPkLeqUHN1ghnqpFv');
    await keyStore.setKey('test', 'test.near', keyPair);
    const actions = [
        nearlib.transactions.transfer(1),
    ];
    const blockHash = nearlib.utils.serialize.base_decode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');

    let [, signedTx] = await nearlib.transactions.signTransaction('whatever.near', 1, actions, blockHash, new nearlib.InMemorySigner(keyStore), 'test.near', 'test');

    expect(Buffer.from(signedTx.signature.data).toString('base64')).toEqual('lpqDMyGG7pdV5IOTJVJYBuGJo9LSu0tHYOlEQ+l+HE8i3u7wBZqOlxMQDtpuGRRNp+ig735TmyBwi6HY0CG9AQ==');
    const serialized = nearlib.utils.serialize.serialize(nearlib.transactions.SCHEMA, signedTx);
    expect(serialized.toString('base64')).toEqual('CQAAAHRlc3QubmVhcgCRez0mjUtY9/7BsVC9aNab4+5dTMOYVeNBU4Rlu3eGDQEAAAAAAAAADQAAAHdoYXRldmVyLm5lYXIPpHP9JpAd8pa+atxMxN800EDvokNSJLaYaRDmMML+9gEAAAADAQAAAAAAAAAAAAAAAAAAAACWmoMzIYbul1Xkg5MlUlgG4Ymj0tK7S0dg6URD6X4cTyLe7vAFmo6XExAO2m4ZFE2n6KDvflObIHCLodjQIb0B');
});
