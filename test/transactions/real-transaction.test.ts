import { describe, expect, test } from 'vitest';

import { actionCreators, baseDecode, createTransaction, encodeTransaction, KeyPair } from '../../src';

const { transfer } = actionCreators;

describe('Real transaction scenarios', () => {
    test('encode transaction with real-world numeric values', () => {
        // Simulate a real transaction as would be created by Account.sendMoney
        const keyPair = KeyPair.fromString(
            'ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw'
        );
        const publicKey = keyPair.getPublicKey();

        // Real-world values that come from the blockchain
        const blockHash = baseDecode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');
        const nonce = 12345678901234; // Often comes as a number from JSON RPC
        const amount = 1000000000000000000000000; // 1 NEAR in yoctoNEAR, often a number

        const actions = [transfer(amount)];

        const transaction = createTransaction('sender.near', publicKey, 'receiver.near', nonce, actions, blockHash);

        // This should not throw "Cannot mix BigInt and other types"
        const serialized = encodeTransaction(transaction);

        expect(serialized).toBeInstanceOf(Uint8Array);
        expect(serialized.length).toBeGreaterThan(0);
    });

    test('encode transaction with large nonce from JSON', () => {
        const keyPair = KeyPair.fromString(
            'ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw'
        );
        const publicKey = keyPair.getPublicKey();
        const blockHash = baseDecode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');

        // Simulate nonce coming from JSON.parse (which gives numbers for values under Number.MAX_SAFE_INTEGER)
        const nonceFromJSON = 158895108000003; // From the deserialize delegate test

        const actions = [transfer(1n)];
        const transaction = createTransaction(
            'test.near',
            publicKey,
            'receiver.near',
            nonceFromJSON,
            actions,
            blockHash
        );

        const serialized = encodeTransaction(transaction);
        expect(serialized).toBeInstanceOf(Uint8Array);
    });

    test('encode transaction with mixed numeric types', () => {
        const keyPair = KeyPair.fromString(
            'ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw'
        );
        const publicKey = keyPair.getPublicKey();
        const blockHash = baseDecode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');

        // Mix of BigInt and number (as might come from different code paths)
        const nonce = 123; // number
        const amount = 5000000000000000000000000n; // BigInt

        const actions = [transfer(amount)];
        const transaction = createTransaction('alice.near', publicKey, 'bob.near', nonce, actions, blockHash);

        const serialized = encodeTransaction(transaction);
        expect(serialized).toBeInstanceOf(Uint8Array);
    });
});
