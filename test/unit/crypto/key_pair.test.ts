import { sha256 } from '@noble/hashes/sha2.js';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { describe, expect, test } from 'vitest';
import {
    baseDecode,
    baseEncode,
    KeyPair,
    KeyPairEd25519,
    KeyPairMLDSA65,
    KeyPairSecp256k1,
    type KeyPairString,
    PublicKey,
} from '../../../src/index.js';

const encoder = new TextEncoder();

describe('Using Ed25519 Curve', () => {
    test('test sign and verify', async () => {
        const keyPair = new KeyPairEd25519(
            '26x56YPzPDro5t2smQfGcYAPy3j7R2jB2NUb7xKbAGK23B6x4WNQPh3twb6oDksFov5X8ts5CtntUNbpQpAKFdbR'
        );
        expect(keyPair.publicKey.toString()).toEqual('ed25519:AYWv9RAN1hpSQA4p1DLhCNnpnNXwxhfH9qeHN8B4nJ59');
        const message = sha256(encoder.encode('message'));
        const signature = keyPair.sign(message);
        expect(baseEncode(signature.signature)).toEqual(
            '26gFr4xth7W9K7HPWAxq3BLsua8oTy378mC1MYFiEXHBBpeBjP8WmJEJo8XTBowetvqbRshcQEtBUdwQcAqDyP8T'
        );
    });

    test('test sign and verify with random', async () => {
        const keyPair = KeyPairEd25519.fromRandom();
        const message = sha256(encoder.encode('message'));
        const signature = keyPair.sign(message);
        expect(keyPair.verify(message, signature.signature)).toBeTruthy();
    });

    test('test sign and verify with public key', async () => {
        const keyPair = new KeyPairEd25519(
            '5JueXZhEEVqGVT5powZ5twyPP8wrap2K7RdAYGGdjBwiBdd7Hh6aQxMP1u3Ma9Yanq1nEv32EW7u8kUJsZ6f315C'
        );
        const message = sha256(encoder.encode('message'));
        const signature = keyPair.sign(message);
        const publicKey = PublicKey.from('ed25519:EWrekY1deMND7N3Q7Dixxj12wD7AVjFRt2H9q21QHUSW');
        expect(publicKey.verify(message, signature.signature)).toBeTruthy();
    });

    test('test from secret', async () => {
        const keyPair = new KeyPairEd25519(
            '5JueXZhEEVqGVT5powZ5twyPP8wrap2K7RdAYGGdjBwiBdd7Hh6aQxMP1u3Ma9Yanq1nEv32EW7u8kUJsZ6f315C'
        );
        expect(keyPair.publicKey.toString()).toEqual('ed25519:EWrekY1deMND7N3Q7Dixxj12wD7AVjFRt2H9q21QHUSW');
    });

    test('convert to string', async () => {
        const keyPair = KeyPairEd25519.fromRandom();
        const newKeyPair = KeyPair.fromString(keyPair.toString());
        expect((newKeyPair as KeyPairEd25519).secretKey).toEqual(keyPair.secretKey);

        const keyString =
            'ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw';
        const keyPair2 = KeyPair.fromString(keyString);
        expect(keyPair2.toString()).toEqual(keyString);
    });
});

describe('Using Secp256k1 Curve', () => {
    test('Should sign and verify with Secp256k1', async () => {
        const keyPair = new KeyPairSecp256k1('Cqmi5vHc59U1MHhq7JCxTSJentvVBYMcKGUA7s7kwnKn');
        expect(keyPair.publicKey.toString()).toEqual(
            'secp256k1:45KcWwYt6MYRnnWFSxyQVkuu9suAzxoSkUMEnFNBi9kDayTo5YPUaqMWUrf7YHUDNMMj3w75vKuvfAMgfiFXBy28'
        );
        const message = sha256(encoder.encode('message'));
        const signature = keyPair.sign(message);
        expect(baseEncode(signature.signature)).toEqual(
            '3xamkuNXQr4HHLXygRdp42Q19BRs6X5vENHbVtj7duaphZpdaRR2dZD7NvxWHw2twFiUxCvYXue6ZDsWg77DWBxNb'
        );
    });

    test('Should sign and verify random message using Secp256k1 curve', async () => {
        const keyPair = KeyPairSecp256k1.fromRandom();
        const message = sha256(encoder.encode('message'));
        const signature = keyPair.sign(message);
        expect(keyPair.verify(message, signature.signature)).toBeTruthy();
    });

    test('Should sign and verify public key created using Secp256k1', async () => {
        const keyPair = new KeyPairSecp256k1('Cqmi5vHc59U1MHhq7JCxTSJentvVBYMcKGUA7s7kwnKn');
        const message = sha256(encoder.encode('message'));
        const signature = keyPair.sign(message);
        const publicKey = PublicKey.from(
            'secp256k1:45KcWwYt6MYRnnWFSxyQVkuu9suAzxoSkUMEnFNBi9kDayTo5YPUaqMWUrf7YHUDNMMj3w75vKuvfAMgfiFXBy28'
        );
        expect(publicKey.verify(message, signature.signature)).toBeTruthy();
    });

    test('Should create proper publicKey from secret using Secp256k1', async () => {
        const keyPair = new KeyPairSecp256k1('Cqmi5vHc59U1MHhq7JCxTSJentvVBYMcKGUA7s7kwnKn');
        expect(keyPair.publicKey.toString()).toEqual(
            'secp256k1:45KcWwYt6MYRnnWFSxyQVkuu9suAzxoSkUMEnFNBi9kDayTo5YPUaqMWUrf7YHUDNMMj3w75vKuvfAMgfiFXBy28'
        );
    });

    test('Should return proper key converted to string using Secp256k1', async () => {
        const keyPair = KeyPairSecp256k1.fromRandom();
        const newKeyPair = KeyPair.fromString(keyPair.toString());
        expect((newKeyPair as KeyPairSecp256k1).secretKey).toEqual(keyPair.secretKey);

        const keyString = 'secp256k1:7s1Jno8tbqFHBMqLh3epaFBbk194zAuMqo8yPbxvTbXn';
        const keyPair2 = KeyPair.fromString(keyString);
        expect(keyPair2.toString()).toEqual(keyString);
    });
});

test('ML-DSA-65 signs and verifies', () => {
    const keyPair = KeyPairMLDSA65.fromRandom();
    const message = sha256(encoder.encode('message'));
    const signature = keyPair.sign(message);

    expect(keyPair.verify(message, signature.signature)).toBeTruthy();
    expect(KeyPair.fromString(keyPair.toString()).getPublicKey().toString()).toEqual(keyPair.getPublicKey().toString());
});

test('ML-DSA-65 accepts the canonical 32-byte seed form', () => {
    const keyString = 'ml-dsa-65:GdMxikMuRimoKStcDp78N8GXVK54z2HxgNhwKP6F3nMR';
    const keyPair = KeyPair.fromString(keyString);
    const seed = Uint8Array.from(
        Buffer.from('e82fe9d0fd2a6af0798736fc2ed44907faf66d4a7a543499e7f1c04f18a7d3c4', 'hex')
    );
    expect(keyPair.getPublicKey().data).toEqual(ml_dsa65.keygen(seed).publicKey);
    expect(keyPair.toString()).toEqual(keyString);
    const message = sha256(encoder.encode('message'));
    expect(keyPair.verify(message, keyPair.sign(message).signature)).toBeTruthy();
});

test('ML-DSA-65 generates keys in the seed form', () => {
    expect(baseDecode(KeyPairMLDSA65.fromRandom().secretKey).length).toEqual(32);
});

test('ML-DSA-65 accepts a valid expanded key and exports it unchanged', () => {
    const expanded = ml_dsa65.keygen(new Uint8Array(32).fill(3));
    const keyString = `ml-dsa-65:${baseEncode(expanded.secretKey)}` as KeyPairString;
    const keyPair = KeyPair.fromString(keyString);
    expect(keyPair.getPublicKey().data).toEqual(expanded.publicKey);
    expect(keyPair.toString()).toEqual(keyString);
});

test('ML-DSA-65 seed and expanded forms of one key agree', () => {
    const seed = new Uint8Array(32).fill(5);
    const fromSeed = new KeyPairMLDSA65(baseEncode(seed));
    const fromExpanded = new KeyPairMLDSA65(baseEncode(ml_dsa65.keygen(seed).secretKey));
    expect(fromSeed.getPublicKey().toString()).toEqual(fromExpanded.getPublicKey().toString());
});

test('ML-DSA-65 rejects secret keys of any other length', () => {
    for (const length of [0, 31, 33, 64, 2560, 4031, 4033, 4896]) {
        expect(() => new KeyPairMLDSA65(baseEncode(new Uint8Array(length).fill(7)))).toThrow();
    }
});

test('ML-DSA-65 rejects expanded keys with a corrupted tr, t0 or s1', () => {
    const expanded = ml_dsa65.keygen(new Uint8Array(32).fill(4)).secretKey;
    const cases: Array<[string, number, number]> = [
        ['tr', 64, 0x01],
        ['tr last byte', 127, 0x80],
        ['s1', 128, 0x88],
        ['t0 first byte', 1536, 0x01],
        ['t0 last byte', 4031, 0x01],
    ];
    for (const [part, offset, mask] of cases) {
        const corrupted = Uint8Array.from(expanded);
        corrupted[offset] = corrupted[offset]! ^ mask;
        expect(() => new KeyPairMLDSA65(baseEncode(corrupted)), part).toThrow();
    }
});

test('convert to string', async () => {
    const keyPair = KeyPairEd25519.fromRandom();
    const newKeyPair = KeyPair.fromString(keyPair.toString());
    expect((newKeyPair as KeyPairEd25519).secretKey).toEqual(keyPair.secretKey);

    const keyString =
        'ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw';
    const keyPair2 = KeyPair.fromString(keyString);
    expect(keyPair2.toString()).toEqual(keyString);
});

test('public key from too short string', async () => {
    const tooShortPublicKey = 'tooShortPublicKey';
    expect(() => PublicKey.fromString(baseEncode(tooShortPublicKey))).toThrow(
        `Invalid public key size (${tooShortPublicKey.length}), must be 32`
    );
});

test('public key from string', async () => {
    const validPublicKey = '0123456789ABCDEF0123456789ABCDEF';
    expect(() => PublicKey.fromString(baseEncode(validPublicKey))).not.toThrow();
});
