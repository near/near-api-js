const { KeyPair, PublicKey } = require('@near-js/crypto');
const { InMemoryKeyStore } = require('@near-js/keystores');
const { InMemorySigner } = require('@near-js/signers');
const { Assignable } = require('@near-js/types');
const { baseDecode, baseEncode } = require('@near-js/utils');
const fs = require('fs');
const BN = require('bn.js');
const { deserialize, serialize } = require('borsh');

const {
    actionCreators,
    createTransaction,
    decodeSignedTransaction,
    decodeTransaction,
    encodeTransaction,
    SCHEMA,
    signTransaction,
} = require('../lib');

const {
    addKey,
    createAccount,
    deleteAccount,
    deleteKey,
    deployContract,
    functionCall,
    functionCallAccessKey,
    stake,
    transfer,
} = actionCreators;

class Test extends Assignable {
}

test('serialize object', async () => {
    const value = new Test({ x: 255, y: 20, z: '123', q: [1, 2, 3] });
    const schema = { struct: { x: 'u8', y: 'u16', z: 'string', q: { array: { type: 'u8' } } } };
    let buf = serialize(schema, value);
    let new_value = new Test(deserialize(schema, buf));
    expect(new_value.x).toEqual(255);
    expect(new_value.y.toString()).toEqual('20');
    expect(new_value.z).toEqual('123');
    expect(new_value.q).toEqual([1, 2, 3]);
});

test('deserialize delegate', async () => {
    const serialized = [8, 16, 0, 0, 0, 116, 104, 101, 45, 117, 115, 101, 114, 46, 116, 101, 115, 116, 110, 101, 116, 27, 0, 0, 0, 104, 101, 108, 108, 111, 46, 110, 101, 97, 114, 45, 101, 120, 97, 109, 112, 108, 101, 115, 46, 116, 101, 115, 116, 110, 101, 116, 1, 0, 0, 0, 2, 12, 0, 0, 0, 115, 101, 116, 95, 103, 114, 101, 101, 116, 105, 110, 103, 20, 0, 0, 0, 123, 34, 103, 114, 101, 101, 116, 105, 110, 103, 34, 58, 34, 72, 101, 108, 108, 111, 34, 125, 0, 224, 87, 235, 72, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 9, 120, 166, 131, 144, 0, 0, 61, 158, 123, 9, 0, 0, 0, 0, 0, 154, 156, 80, 116, 108, 65, 42, 39, 47, 253, 146, 109, 67, 106, 83, 230, 57, 183, 195, 122, 150, 6, 246, 220, 173, 35, 120, 139, 167, 94, 183, 29, 0, 41, 98, 10, 45, 51, 177, 89, 159, 190, 247, 41, 255, 243, 17, 186, 140, 168, 139, 9, 81, 33, 8, 74, 73, 85, 254, 127, 62, 54, 193, 60, 50, 235, 49, 13, 37, 152, 94, 172, 24, 198, 220, 119, 148, 99, 89, 19, 187, 251, 80, 76, 230, 77, 28, 80, 140, 133, 81, 139, 159, 62, 245, 167, 4];
    const { signedDelegate: { delegateAction } } = deserialize(SCHEMA.Action, serialized);
    expect(delegateAction.senderId).toEqual('the-user.testnet');
    expect(delegateAction.receiverId).toEqual('hello.near-examples.testnet');
    expect(String(delegateAction.nonce)).toEqual('158895108000003');
});

test('serialize and sign multi-action tx', async () => {
    const keyStore = new InMemoryKeyStore();
    const keyPair = KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw');
    await keyStore.setKey('test', 'test.near', keyPair);
    const publicKey = keyPair.publicKey;
    const actions = [
        createAccount(),
        deployContract(new Uint8Array([1, 2, 3])),
        functionCall('qqq', new Uint8Array([1, 2, 3]), 1000, 1000000),
        transfer(123),
        stake(1000000, publicKey),
        addKey(publicKey, functionCallAccessKey('zzz', ['www'], null)),
        deleteKey(publicKey),
        deleteAccount('123')
    ];
    const blockHash = baseDecode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');
    let [hash, { transaction }] = await signTransaction('123', 1, actions, blockHash, new InMemorySigner(keyStore), 'test.near', 'test');
    expect(baseEncode(hash)).toEqual('Fo3MJ9XzKjnKuDuQKhDAC6fra5H2UWawRejFSEpPNk3Y');
    const serialized = Buffer.from(serialize(SCHEMA.Transaction, transaction));
    expect(serialized.toString('hex')).toEqual('09000000746573742e6e656172000f56a5f028dfc089ec7c39c1183b321b4d8f89ba5bec9e1762803cc2491f6ef80100000000000000030000003132330fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef608000000000103000000010203020300000071717103000000010203e80300000000000040420f00000000000000000000000000037b0000000000000000000000000000000440420f00000000000000000000000000000f56a5f028dfc089ec7c39c1183b321b4d8f89ba5bec9e1762803cc2491f6ef805000f56a5f028dfc089ec7c39c1183b321b4d8f89ba5bec9e1762803cc2491f6ef800000000000000000000030000007a7a7a010000000300000077777706000f56a5f028dfc089ec7c39c1183b321b4d8f89ba5bec9e1762803cc2491f6ef80703000000313233');
});

function createTransferTx() {
    const actions = [
        transfer(1),
    ];
    const blockHash = baseDecode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');
    return createTransaction(
        'test.near',
        PublicKey.fromString('Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC'),
        'whatever.near',
        1,
        actions,
        blockHash);
}

test('serialize transfer tx', async () => {
    const transaction = createTransferTx();

    const serialized = encodeTransaction(transaction);
    expect(Buffer.from(serialized).toString('hex')).toEqual('09000000746573742e6e65617200917b3d268d4b58f7fec1b150bd68d69be3ee5d4cc39855e341538465bb77860d01000000000000000d00000077686174657665722e6e6561720fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef6010000000301000000000000000000000000000000');

    const deserialized = decodeTransaction(serialized);
    expect(encodeTransaction(deserialized)).toEqual(serialized);
});

async function createKeyStore() {
    const keyStore = new InMemoryKeyStore();
    const keyPair = KeyPair.fromString('ed25519:3hoMW1HvnRLSFCLZnvPzWeoGwtdHzke34B2cTHM8rhcbG3TbuLKtShTv3DvyejnXKXKBiV7YPkLeqUHN1ghnqpFv');
    await keyStore.setKey('test', 'test.near', keyPair);
    return keyStore;
}

async function verifySignedTransferTx(signedTx) {
    expect(Buffer.from(signedTx.signature.data).toString('base64')).toEqual('lpqDMyGG7pdV5IOTJVJYBuGJo9LSu0tHYOlEQ+l+HE8i3u7wBZqOlxMQDtpuGRRNp+ig735TmyBwi6HY0CG9AQ==');
    const serialized = encodeTransaction(signedTx);
    expect(Buffer.from(serialized).toString('hex')).toEqual('09000000746573742e6e65617200917b3d268d4b58f7fec1b150bd68d69be3ee5d4cc39855e341538465bb77860d01000000000000000d00000077686174657665722e6e6561720fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef601000000030100000000000000000000000000000000969a83332186ee9755e4839325525806e189a3d2d2bb4b4760e94443e97e1c4f22deeef0059a8e9713100eda6e19144da7e8a0ef7e539b20708ba1d8d021bd01');

    const deserialized = decodeSignedTransaction(serialized);
    expect(encodeTransaction(deserialized)).toEqual(serialized);
}

test('serialize and sign transfer tx', async () => {
    const transaction = createTransferTx();
    const keyStore = await createKeyStore();

    let [, signedTx] = await signTransaction(transaction.receiverId, transaction.nonce, transaction.actions, transaction.blockHash, new InMemorySigner(keyStore), 'test.near', 'test');

    verifySignedTransferTx(signedTx);
});

test('serialize and sign transfer tx object', async () => {
    const transaction = createTransferTx();
    const keyStore = await createKeyStore();

    let [, signedTx] = await signTransaction(transaction, new InMemorySigner(keyStore), 'test.near', 'test');

    verifySignedTransferTx(signedTx);
});

describe('roundtrip test', () => {
    const dataDir = './test/data';
    const testFiles = fs.readdirSync(dataDir);
    for (const testFile of testFiles) {
        if (/.+\.json$/.test(testFile)) {
            const testDefinition = JSON.parse(fs.readFileSync(dataDir + '/' + testFile));
            test(testFile, () => {
                const data = Buffer.from(testDefinition.data, 'hex');
                const type = testDefinition.type;
                const deserialized = deserialize(SCHEMA[type], Uint8Array.from(data));
                const serialized = Buffer.from(serialize(SCHEMA[type], deserialized));
                expect(serialized).toEqual(data);
            });
        }
    }
});

describe('serialize and deserialize on different types of nonce', () => {
    const actions = [
        transfer(1),
    ];
    const blockHash = baseDecode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');
    const targetNonce = new BN(1);
    test('number typed nonce', async () => {
        const transaction = createTransaction(
            'test.near',
            PublicKey.fromString('Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC'),
            'whatever.near',
            1,
            actions,
            blockHash);
        const serialized = encodeTransaction(transaction);
        expect(Buffer.from(serialized).toString('hex')).toEqual('09000000746573742e6e65617200917b3d268d4b58f7fec1b150bd68d69be3ee5d4cc39855e341538465bb77860d01000000000000000d00000077686174657665722e6e6561720fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef6010000000301000000000000000000000000000000');
        const deserialized = decodeTransaction(serialized);
        expect(encodeTransaction(deserialized)).toEqual(serialized);
        expect(deserialized.nonce.toString()).toEqual(targetNonce.toString());
    });

    test('string typed nonce', async () => {
        const transaction = createTransaction(
            'test.near',
            PublicKey.fromString('Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC'),
            'whatever.near',
            '1',
            actions,
            blockHash);
        const serialized = encodeTransaction(transaction);
        expect(Buffer.from(serialized).toString('hex')).toEqual('09000000746573742e6e65617200917b3d268d4b58f7fec1b150bd68d69be3ee5d4cc39855e341538465bb77860d01000000000000000d00000077686174657665722e6e6561720fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef6010000000301000000000000000000000000000000');
        const deserialized = decodeTransaction(serialized);
        expect(encodeTransaction(deserialized)).toEqual(serialized);
        expect(deserialized.nonce.toString()).toEqual(targetNonce.toString());
    });

    test('BN typed nonce', async () => {
        const transaction = createTransaction(
            'test.near',
            PublicKey.fromString('Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC'),
            'whatever.near',
            new BN(1),
            actions,
            blockHash);
        const serialized = encodeTransaction(transaction);
        expect(Buffer.from(serialized).toString('hex')).toEqual('09000000746573742e6e65617200917b3d268d4b58f7fec1b150bd68d69be3ee5d4cc39855e341538465bb77860d01000000000000000d00000077686174657665722e6e6561720fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef6010000000301000000000000000000000000000000');
        const deserialized = decodeTransaction(serialized);
        expect(encodeTransaction(deserialized)).toEqual(serialized);
        expect(deserialized.nonce.toString()).toEqual(targetNonce.toString());
    });
});
