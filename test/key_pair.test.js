
const nearApi = require('../src/index');
const { sha256 } = require('js-sha256');
describe('Using Ed25519 Curve', () => {
    test('test sign and verify', async () => {
        const keyPair = new nearApi.utils.key_pair.KeyPairEd25519('26x56YPzPDro5t2smQfGcYAPy3j7R2jB2NUb7xKbAGK23B6x4WNQPh3twb6oDksFov5X8ts5CtntUNbpQpAKFdbR');
        expect(keyPair.publicKey.toString()).toEqual('ed25519:AYWv9RAN1hpSQA4p1DLhCNnpnNXwxhfH9qeHN8B4nJ59');
        const message = new Uint8Array(sha256.array('message'));
        const signature = keyPair.sign(message);
        expect(nearApi.utils.serialize.base_encode(signature.signature)).toEqual('26gFr4xth7W9K7HPWAxq3BLsua8oTy378mC1MYFiEXHBBpeBjP8WmJEJo8XTBowetvqbRshcQEtBUdwQcAqDyP8T');
    });

    test('test sign and verify with random', async () => {
        const keyPair = nearApi.utils.key_pair.KeyPairEd25519.fromRandom();
        const message = new Uint8Array(sha256.array('message'));
        const signature = keyPair.sign(message);
        expect(keyPair.verify(message, signature.signature)).toBeTruthy();
    });

    test('test sign and verify with public key', async () => {
        const keyPair = new nearApi.utils.key_pair.KeyPairEd25519('5JueXZhEEVqGVT5powZ5twyPP8wrap2K7RdAYGGdjBwiBdd7Hh6aQxMP1u3Ma9Yanq1nEv32EW7u8kUJsZ6f315C');
        const message = new Uint8Array(sha256.array('message'));
        const signature = keyPair.sign(message);
        const publicKey = nearApi.utils.key_pair.PublicKey.from('ed25519:EWrekY1deMND7N3Q7Dixxj12wD7AVjFRt2H9q21QHUSW');
        expect(publicKey.verify(message, signature.signature)).toBeTruthy();
    });

    test('test from secret', async () => {
        const keyPair = new nearApi.utils.key_pair.KeyPairEd25519('5JueXZhEEVqGVT5powZ5twyPP8wrap2K7RdAYGGdjBwiBdd7Hh6aQxMP1u3Ma9Yanq1nEv32EW7u8kUJsZ6f315C');
        expect(keyPair.publicKey.toString()).toEqual('ed25519:EWrekY1deMND7N3Q7Dixxj12wD7AVjFRt2H9q21QHUSW');
    });

    test('convert to string', async () => {
        const keyPair = nearApi.utils.key_pair.KeyPairEd25519.fromRandom();
        const newKeyPair = nearApi.utils.key_pair.KeyPair.fromString(keyPair.toString());
        expect(newKeyPair.secretKey).toEqual(keyPair.secretKey);

        const keyString = 'ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw';
        const keyPair2 = nearApi.utils.key_pair.KeyPair.fromString(keyString);
        expect(keyPair2.toString()).toEqual(keyString);
    });
});

describe('Using Secp256k1 Curve', () => {
    test('Should sign and verify with Secp256k1', async () => {
        const keyPair = new nearApi.utils.key_pair.KeyPairSecp256k1('Cqmi5vHc59U1MHhq7JCxTSJentvVBYMcKGUA7s7kwnKn');
        expect(keyPair.publicKey.toString()).toEqual('secp256k1:45KcWwYt6MYRnnWFSxyQVkuu9suAzxoSkUMEnFNBi9kDayTo5YPUaqMWUrf7YHUDNMMj3w75vKuvfAMgfiFXBy28');
        const message = new Uint8Array(sha256.array('message'));
        const signature = keyPair.sign(message);
        expect(nearApi.utils.serialize.base_encode(signature.signature)).toEqual('3xamkuNXQr4HHLXygRdp42Q19BRs6X5vENHbVtj7duaphZpdaRR2dZD7NvxWHw2twFiUxCvYXue6ZDsWg77DWBxNb');
    });

    test('Should sign and verify random message using Secp256k1 curve', async () => {
        const keyPair = nearApi.utils.key_pair.KeyPairSecp256k1.fromRandom();
        const message = new Uint8Array(sha256.array('message'));
        const signature = keyPair.sign(message);
        expect(keyPair.verify(message, signature.signature)).toBeTruthy();
    });

    test('Should sign and verify public key created using Secp256k1', async () => {
        const keyPair = new nearApi.utils.key_pair.KeyPairSecp256k1('Cqmi5vHc59U1MHhq7JCxTSJentvVBYMcKGUA7s7kwnKn');
        const message = new Uint8Array(sha256.array('message'));
        const signature = keyPair.sign(message);
        const publicKey = nearApi.utils.key_pair.PublicKey.from('secp256k1:45KcWwYt6MYRnnWFSxyQVkuu9suAzxoSkUMEnFNBi9kDayTo5YPUaqMWUrf7YHUDNMMj3w75vKuvfAMgfiFXBy28');
        expect(publicKey.verify(message, signature.signature)).toBeTruthy();
    });

    test('Should create proper publicKey from secret using Secp256k1', async () => {
        const keyPair = new nearApi.utils.key_pair.KeyPairSecp256k1('Cqmi5vHc59U1MHhq7JCxTSJentvVBYMcKGUA7s7kwnKn');
        expect(keyPair.publicKey.toString()).toEqual('secp256k1:45KcWwYt6MYRnnWFSxyQVkuu9suAzxoSkUMEnFNBi9kDayTo5YPUaqMWUrf7YHUDNMMj3w75vKuvfAMgfiFXBy28');
    });

    test('Should return proper key converted to string using Secp256k1', async () => {
        const keyPair = nearApi.utils.key_pair.KeyPairSecp256k1.fromRandom();
        const newKeyPair = nearApi.utils.key_pair.KeyPair.fromString(keyPair.toString());
        expect(newKeyPair.secretKey).toEqual(keyPair.secretKey);

        const keyString = 'secp256k1:7s1Jno8tbqFHBMqLh3epaFBbk194zAuMqo8yPbxvTbXn';
        const keyPair2 = nearApi.utils.key_pair.KeyPair.fromString(keyString);
        expect(keyPair2.toString()).toEqual(keyString);
    });
});
