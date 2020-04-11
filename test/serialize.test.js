
const fs = require('fs');
const nearAPIJs = require('../lib/index');

class Test extends nearAPIJs.utils.enums.Assignable {
}

test('serialize object', async () => {
    const value = new Test({ x: 255, y: 20, z: '123', q: [1, 2, 3]});
    const schema = new Map([[Test, {kind: 'struct', fields: [['x', 'u8'], ['y', 'u64'], ['z', 'string'], ['q', [3]]] }]]);
    let buf = nearAPIJs.utils.serialize.serialize(schema, value);
    let new_value = nearAPIJs.utils.serialize.deserialize(schema, Test, buf);
    expect(new_value.x).toEqual(255);
    expect(new_value.y.toString()).toEqual('20');
    expect(new_value.z).toEqual('123');
    expect(new_value.q).toEqual(new Uint8Array([1, 2, 3]));
});

test('serialize and sign multi-action tx', async() => {
    const keyStore = new nearAPIJs.keyStores.InMemoryKeyStore();
    const keyPair = nearAPIJs.utils.KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw');
    await keyStore.setKey('test', 'test.near', keyPair);
    const publicKey = keyPair.publicKey;
    const actions = [
        nearAPIJs.transactions.createAccount(),
        nearAPIJs.transactions.deployContract(new Uint8Array([1, 2, 3])),
        nearAPIJs.transactions.functionCall('qqq', new Uint8Array([1, 2, 3]), 1000, 1000000),
        nearAPIJs.transactions.transfer(123),
        nearAPIJs.transactions.stake(1000000, publicKey),
        nearAPIJs.transactions.addKey(publicKey, nearAPIJs.transactions.functionCallAccessKey('zzz', ['www'], null)),
        nearAPIJs.transactions.deleteKey(publicKey),
        nearAPIJs.transactions.deleteAccount('123')
    ];
    const blockHash = nearAPIJs.utils.serialize.base_decode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');
    let [hash, { transaction }] = await nearAPIJs.transactions.signTransaction('123', 1, actions, blockHash, new nearAPIJs.InMemorySigner(keyStore), 'test.near', 'test');
    expect(nearAPIJs.utils.serialize.base_encode(hash)).toEqual('Fo3MJ9XzKjnKuDuQKhDAC6fra5H2UWawRejFSEpPNk3Y');
    const serialized = nearAPIJs.utils.serialize.serialize(nearAPIJs.transactions.SCHEMA, transaction);
    expect(serialized.toString('hex')).toEqual('09000000746573742e6e656172000f56a5f028dfc089ec7c39c1183b321b4d8f89ba5bec9e1762803cc2491f6ef80100000000000000030000003132330fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef608000000000103000000010203020300000071717103000000010203e80300000000000040420f00000000000000000000000000037b0000000000000000000000000000000440420f00000000000000000000000000000f56a5f028dfc089ec7c39c1183b321b4d8f89ba5bec9e1762803cc2491f6ef805000f56a5f028dfc089ec7c39c1183b321b4d8f89ba5bec9e1762803cc2491f6ef800000000000000000000030000007a7a7a010000000300000077777706000f56a5f028dfc089ec7c39c1183b321b4d8f89ba5bec9e1762803cc2491f6ef80703000000313233');
});

function createTransferTx() {
    const actions = [
        nearAPIJs.transactions.transfer(1),
    ];
    const blockHash = nearAPIJs.utils.serialize.base_decode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');
    return nearAPIJs.transactions.createTransaction(
        'test.near',
        nearAPIJs.utils.PublicKey.fromString('Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC'),
        'whatever.near',
        1,
        actions,
        blockHash);
}

test('serialize transfer tx', async() => {
    const transaction = createTransferTx();

    const serialized = transaction.encode();
    expect(serialized.toString('hex')).toEqual('09000000746573742e6e65617200917b3d268d4b58f7fec1b150bd68d69be3ee5d4cc39855e341538465bb77860d01000000000000000d00000077686174657665722e6e6561720fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef6010000000301000000000000000000000000000000');

    const deserialized = nearAPIJs.transactions.Transaction.decode(serialized);
    expect(deserialized.encode()).toEqual(serialized);
});

async function createKeyStore() {
    const keyStore = new nearAPIJs.keyStores.InMemoryKeyStore();
    const keyPair = nearAPIJs.utils.KeyPair.fromString('ed25519:3hoMW1HvnRLSFCLZnvPzWeoGwtdHzke34B2cTHM8rhcbG3TbuLKtShTv3DvyejnXKXKBiV7YPkLeqUHN1ghnqpFv');
    await keyStore.setKey('test', 'test.near', keyPair);
    return keyStore;
}

async function verifySignedTransferTx(signedTx) {
    expect(Buffer.from(signedTx.signature.data).toString('base64')).toEqual('lpqDMyGG7pdV5IOTJVJYBuGJo9LSu0tHYOlEQ+l+HE8i3u7wBZqOlxMQDtpuGRRNp+ig735TmyBwi6HY0CG9AQ==');
    const serialized = signedTx.encode();
    expect(serialized.toString('hex')).toEqual('09000000746573742e6e65617200917b3d268d4b58f7fec1b150bd68d69be3ee5d4cc39855e341538465bb77860d01000000000000000d00000077686174657665722e6e6561720fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef601000000030100000000000000000000000000000000969a83332186ee9755e4839325525806e189a3d2d2bb4b4760e94443e97e1c4f22deeef0059a8e9713100eda6e19144da7e8a0ef7e539b20708ba1d8d021bd01');
    
    const deserialized = nearAPIJs.transactions.SignedTransaction.decode(serialized);
    expect(deserialized.encode()).toEqual(serialized);
}

test('serialize and sign transfer tx', async() => {
    const transaction = createTransferTx();
    const keyStore = await createKeyStore();

    let [, signedTx] = await nearAPIJs.transactions.signTransaction(transaction.receiverId, transaction.nonce, transaction.actions, transaction.blockHash, new nearAPIJs.InMemorySigner(keyStore), 'test.near', 'test');

    verifySignedTransferTx(signedTx);
});

test('serialize and sign transfer tx object', async() => {
    const transaction = createTransferTx();
    const keyStore = await createKeyStore();

    let [, signedTx] = await nearAPIJs.transactions.signTransaction(transaction, new nearAPIJs.InMemorySigner(keyStore), 'test.near', 'test');

    verifySignedTransferTx(signedTx);
});

describe('roundtrip test', () => {
    const dataDir = './test/data';
    const testFiles = fs.readdirSync(dataDir);
    for (const testFile of testFiles) {
        if (/.+\.json$/.exec(testFiles)) {
            const testDefinition = JSON.parse(fs.readFileSync(dataDir + '/'  + testFile));
            test(testFile, () => {
                const data = Buffer.from(testDefinition.data, 'hex');
                const type = Array.from(nearAPIJs.transactions.SCHEMA.keys()).find(key => key.name === testDefinition.type);
                const deserialized = nearAPIJs.utils.serialize.deserialize(nearAPIJs.transactions.SCHEMA, type, data);
                const serialized = nearAPIJs.utils.serialize.serialize(nearAPIJs.transactions.SCHEMA, deserialized);
                expect(serialized).toEqual(data);
            });
        }
    }
});