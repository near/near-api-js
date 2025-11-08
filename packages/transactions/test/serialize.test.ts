import { describe, expect, test } from 'bun:test';
import { KeyPair, PublicKey } from '@near-js/crypto';
import { baseDecode } from '@near-js/utils';
import { sha256 } from '@noble/hashes/sha256';
import { deserialize, serialize } from 'borsh';
import * as fs from 'node:fs';


import {
    GlobalContractDeployMode,
    GlobalContractIdentifier,
    SCHEMA,
    actionCreators,
    createTransaction,
    decodeTransaction,
    encodeTransaction
} from '../src';

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
    deployGlobalContract,
    useGlobalContract
} = actionCreators;

class Test {
    constructor(props: any) {
        for (const [k, v] of Object.entries(props || {})) {
            this[k] = v;
        }
    }
}

test('serialize object', async () => {
    const value = new Test({ x: 255, y: 20, z: '123', q: [1, 2, 3] });
    const schema = { struct: { x: 'u8', y: 'u16', z: 'string', q: { array: { type: 'u8' } } } };
    const buf = serialize(schema, value);
    const new_value = new Test(deserialize(schema, buf));
    // @ts-expect-error test input
    expect(new_value.x).toEqual(255);
    // @ts-expect-error test input
    expect(new_value.y.toString()).toEqual('20');
    // @ts-expect-error test input
    expect(new_value.z).toEqual('123');
    // @ts-expect-error test input
    expect(new_value.q).toEqual([1, 2, 3]);
});

test('deserialize delegate', async () => {
    const serialized = [8, 16, 0, 0, 0, 116, 104, 101, 45, 117, 115, 101, 114, 46, 116, 101, 115, 116, 110, 101, 116, 27, 0, 0, 0, 104, 101, 108, 108, 111, 46, 110, 101, 97, 114, 45, 101, 120, 97, 109, 112, 108, 101, 115, 46, 116, 101, 115, 116, 110, 101, 116, 1, 0, 0, 0, 2, 12, 0, 0, 0, 115, 101, 116, 95, 103, 114, 101, 101, 116, 105, 110, 103, 20, 0, 0, 0, 123, 34, 103, 114, 101, 101, 116, 105, 110, 103, 34, 58, 34, 72, 101, 108, 108, 111, 34, 125, 0, 224, 87, 235, 72, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 9, 120, 166, 131, 144, 0, 0, 61, 158, 123, 9, 0, 0, 0, 0, 0, 154, 156, 80, 116, 108, 65, 42, 39, 47, 253, 146, 109, 67, 106, 83, 230, 57, 183, 195, 122, 150, 6, 246, 220, 173, 35, 120, 139, 167, 94, 183, 29, 0, 41, 98, 10, 45, 51, 177, 89, 159, 190, 247, 41, 255, 243, 17, 186, 140, 168, 139, 9, 81, 33, 8, 74, 73, 85, 254, 127, 62, 54, 193, 60, 50, 235, 49, 13, 37, 152, 94, 172, 24, 198, 220, 119, 148, 99, 89, 19, 187, 251, 80, 76, 230, 77, 28, 80, 140, 133, 81, 139, 159, 62, 245, 167, 4];
    // @ts-expect-error test input
    const { signedDelegate: { delegateAction } } = deserialize(SCHEMA.Action, serialized);
    expect(delegateAction.senderId).toEqual('the-user.testnet');
    expect(delegateAction.receiverId).toEqual('hello.near-examples.testnet');
    expect(String(delegateAction.nonce)).toEqual('158895108000003');
});

test('serialize multi-action tx', async () => {
    const keyPair = KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw');
    const publicKey = keyPair.getPublicKey();
    const actions = [
        createAccount(),
        deployContract(new Uint8Array([1, 2, 3])),
        functionCall('qqq', new Uint8Array([1, 2, 3]), 1000n, 1000000n),
        transfer(123n),
        stake(1000000n, publicKey),
        addKey(publicKey, functionCallAccessKey('zzz', ['www'], undefined)),
        deleteKey(publicKey),
        deleteAccount('123')
    ];
    const blockHash = baseDecode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');
    const transaction = createTransaction('test.near', publicKey, '123', 1n, actions, blockHash);
    // expect(baseEncode(hash)).toEqual('Fo3MJ9XzKjnKuDuQKhDAC6fra5H2UWawRejFSEpPNk3Y');
    const serialized = Buffer.from(serialize(SCHEMA.Transaction, transaction));
    expect(serialized.toString('hex')).toEqual('09000000746573742e6e656172000f56a5f028dfc089ec7c39c1183b321b4d8f89ba5bec9e1762803cc2491f6ef80100000000000000030000003132330fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef608000000000103000000010203020300000071717103000000010203e80300000000000040420f00000000000000000000000000037b0000000000000000000000000000000440420f00000000000000000000000000000f56a5f028dfc089ec7c39c1183b321b4d8f89ba5bec9e1762803cc2491f6ef805000f56a5f028dfc089ec7c39c1183b321b4d8f89ba5bec9e1762803cc2491f6ef800000000000000000000030000007a7a7a010000000300000077777706000f56a5f028dfc089ec7c39c1183b321b4d8f89ba5bec9e1762803cc2491f6ef80703000000313233');
});

function createTransferTx() {
    const actions = [
        transfer(1n),
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

describe('roundtrip test', () => {
    const dataDir = './test/data';
    const testFiles = fs.readdirSync(dataDir);
    for (const testFile of testFiles) {
        if (/.+\.json$/.test(testFile)) {
            // @ts-expect-error test input
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
        transfer(1n),
    ];
    const blockHash = baseDecode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');
    const targetNonce = 1n;
    test('number typed nonce', async () => {
        const transaction = createTransaction(
            'test.near',
            PublicKey.fromString('Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC'),
            'whatever.near',
            1,
            actions,
            blockHash
        );
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

    test('BigInt typed nonce', async () => {
        const transaction = createTransaction(
            'test.near',
            PublicKey.fromString('Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC'),
            'whatever.near',
            1n,
            actions,
            blockHash);
        const serialized = encodeTransaction(transaction);
        expect(Buffer.from(serialized).toString('hex')).toEqual('09000000746573742e6e65617200917b3d268d4b58f7fec1b150bd68d69be3ee5d4cc39855e341538465bb77860d01000000000000000d00000077686174657665722e6e6561720fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef6010000000301000000000000000000000000000000');
        const deserialized = decodeTransaction(serialized);
        expect(encodeTransaction(deserialized)).toEqual(serialized);
        expect(deserialized.nonce.toString()).toEqual(targetNonce.toString());
    });
});
describe('Global Contract Actions Serialization', () => {
    const signerId = 'test.near';
    const publicKey = KeyPair.fromRandom('ed25519').getPublicKey();
    const receiverId = 'test.near'; // For these actions, receiver is often the signer
    const nonce = 1n;
    const blockHash = baseDecode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');
    const sampleWasmCode = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]); // Minimal valid WASM
    const sampleCodeHash = sha256(sampleWasmCode);

    test('serialize and deserialize DeployGlobalContract action (CodeHash mode)', () => {
        const action = deployGlobalContract(
            sampleWasmCode,
            new GlobalContractDeployMode({ CodeHash: null })
        );
        const transaction = createTransaction(signerId, publicKey, receiverId, nonce, [action], blockHash);
        const serializedTx = encodeTransaction(transaction);
        const deserializedTx = decodeTransaction(serializedTx);

        expect(deserializedTx.actions.length).toBe(1);
        const deserializedAction = deserializedTx.actions[0].deployGlobalContract;
        expect(deserializedAction).toBeDefined();
        if (deserializedAction) { // Type guard
            expect(Uint8Array.from(deserializedAction.code)).toEqual(sampleWasmCode);
            expect(deserializedAction.deployMode).toStrictEqual({ CodeHash: {} });
            expect(deserializedAction.deployMode.CodeHash).toStrictEqual({});
        }
    });

    test('serialize and deserialize DeployGlobalContract action (AccountId mode)', () => {
        const action = deployGlobalContract(
            sampleWasmCode,
            new GlobalContractDeployMode({ AccountId: null })
        );
        const transaction = createTransaction(signerId, publicKey, receiverId, nonce, [action], blockHash);
        const serializedTx = encodeTransaction(transaction);
        const deserializedTx = decodeTransaction(serializedTx);

        expect(deserializedTx.actions.length).toBe(1);
        const deserializedAction = deserializedTx.actions[0].deployGlobalContract;
        expect(deserializedAction).toBeDefined();
        if (deserializedAction) { // Type guard
            expect(Uint8Array.from(deserializedAction.code)).toEqual(sampleWasmCode);
            expect(deserializedAction.deployMode).toStrictEqual({ AccountId: {} });
        }
    });

    test('serialize and deserialize UseGlobalContract action (CodeHash identifier)', () => {
        const action = useGlobalContract(
            new GlobalContractIdentifier({ CodeHash: sampleCodeHash })
        );
        const transaction = createTransaction(signerId, publicKey, receiverId, nonce, [action], blockHash);
        const serializedTx = encodeTransaction(transaction);
        const deserializedTx = decodeTransaction(serializedTx);

        expect(deserializedTx.actions.length).toBe(1);
        const deserializedAction = deserializedTx.actions[0].useGlobalContract;
        expect(deserializedAction).toBeDefined();
        if (deserializedAction) { // Type guard
            expect(deserializedAction.contractIdentifier).toEqual({ CodeHash: Array.from(sampleCodeHash) });
        }
    });

    test('serialize and deserialize UseGlobalContract action (AccountId identifier)', () => {
        const contractOwnerAccountId = 'contract_owner.near';
        const action = useGlobalContract(
            new GlobalContractIdentifier({ AccountId: contractOwnerAccountId })
        );
        const transaction = createTransaction(signerId, publicKey, receiverId, nonce, [action], blockHash);
        const serializedTx = encodeTransaction(transaction);
        const deserializedTx = decodeTransaction(serializedTx);

        expect(deserializedTx.actions.length).toBe(1);
        const deserializedAction = deserializedTx.actions[0].useGlobalContract;
        expect(deserializedAction).toBeDefined();
        if (deserializedAction) { // Type guard
            expect(deserializedAction.contractIdentifier.AccountId).toBe(contractOwnerAccountId);
        }
    });
});
