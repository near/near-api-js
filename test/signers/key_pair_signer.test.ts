import { sha256 } from '@noble/hashes/sha256';
import { serialize } from 'borsh';
import { TextEncoder } from 'util';
import { expect, test } from 'vitest';
import {
    actionCreators,
    buildDelegateAction,
    createTransaction,
    decodeSignedTransaction,
    encodeTransaction,
    KeyPair,
    KeyPairSigner,
    Nep413MessageSchema,
    PublicKey,
} from '../../src';

global.TextEncoder = TextEncoder;

test('test sign transaction with different public key', async () => {
    const signer = new KeyPairSigner(
        KeyPair.fromString(
            'ed25519:sDa8GRWHy16zXzE5ALViy17miA7Lo39DWp8DY5HsTBEayarAWefzbgXmSpW4f8tQn3V8odsY7yGLGmgGaQN2BBF'
        )
    );

    const transaction = createTransaction(
        'signer',
        // the key is different from what signer operates
        KeyPair.fromString(
            'ed25519:2Pm1R2qRtkbFErVrjqgtNutMqEVvrErQ3wSns6rN4jd7nnmzCbda4kwRCBAnBR7RWf2faRqVMuFaJzhJp1eYfhvV'
        ).getPublicKey(),
        'receiver',
        1n,
        [],
        new Uint8Array(new Array(32))
    );

    await expect(() => signer.signTransaction(transaction)).rejects.toThrow(
        /The public key doesn't match the signer's key/
    );
});

test('test sign transaction with relevant public key', async () => {
    const signer = new KeyPairSigner(
        KeyPair.fromString(
            'ed25519:sDa8GRWHy16zXzE5ALViy17miA7Lo39DWp8DY5HsTBEayarAWefzbgXmSpW4f8tQn3V8odsY7yGLGmgGaQN2BBF'
        )
    );

    const transaction = createTransaction(
        'signer',
        await signer.getPublicKey(),
        'receiver',
        1n,
        [],
        new Uint8Array(new Array(32))
    );

    const [hash, { signature }] = await signer.signTransaction(transaction);

    expect(Buffer.from(hash).toString('hex')).toBe('2571e3539ab5556e39441913e66abd07e634fb9850434006a719306100e641a2');

    expect(Buffer.from(signature.data).toString('hex')).toBe(
        'bfe2858d227e3116076a8e5ea9c5bef923c7755f19f0137d1acd9bb67973f1b8a7f83dfc0be23e307e106c8807eaa6e14c0fcb46c42acdf293c4a6a81a27fc05'
    );
});

test('serialize and sign transfer tx object', async () => {
    const keyPair = KeyPair.fromString(
        'ed25519:3hoMW1HvnRLSFCLZnvPzWeoGwtdHzke34B2cTHM8rhcbG3TbuLKtShTv3DvyejnXKXKBiV7YPkLeqUHN1ghnqpFv'
    );
    const signer = new KeyPairSigner(keyPair);

    const actions = [actionCreators.transfer(1n)];
    const blockHash = new Uint8Array([
        15, 164, 115, 253, 38, 144, 29, 242, 150, 190, 106, 220, 76, 196, 223, 52, 208, 64, 239, 162, 67, 82, 36, 182,
        152, 105, 16, 230, 48, 194, 254, 246,
    ]);
    const transaction = createTransaction(
        'test.near',
        PublicKey.fromString('ed25519:Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC'),
        'whatever.near',
        1,
        actions,
        blockHash
    );

    const [, signedTx] = await signer.signTransaction(transaction);

    expect(Buffer.from(signedTx.signature.ed25519Signature!.data).toString('base64')).toEqual(
        'lpqDMyGG7pdV5IOTJVJYBuGJo9LSu0tHYOlEQ+l+HE8i3u7wBZqOlxMQDtpuGRRNp+ig735TmyBwi6HY0CG9AQ=='
    );
    const serialized = encodeTransaction(signedTx);
    expect(Buffer.from(serialized).toString('hex')).toEqual(
        '09000000746573742e6e65617200917b3d268d4b58f7fec1b150bd68d69be3ee5d4cc39855e341538465bb77860d01000000000000000d00000077686174657665722e6e6561720fa473fd26901df296be6adc4cc4df34d040efa2435224b6986910e630c2fef601000000030100000000000000000000000000000000969a83332186ee9755e4839325525806e189a3d2d2bb4b4760e94443e97e1c4f22deeef0059a8e9713100eda6e19144da7e8a0ef7e539b20708ba1d8d021bd01'
    );

    const deserialized = decodeSignedTransaction(serialized);
    expect(encodeTransaction(deserialized)).toEqual(serialized);
});

test('test sign NEP-413 message with callback url', async () => {
    const signer = new KeyPairSigner(
        KeyPair.fromString(
            'ed25519:3FyRtUUMxiNT1g2ST6mbj7W1CN7KfQBbomawC7YG4A1zwHmw2TRsn1Wc8NaFcBCoJDu3zt3znJDSwKQ31oRaKXH7'
        )
    );

    const { signature } = await signer.signNep413Message('round-toad.testnet', {
        message: 'Hello NEAR!',
        recipient: 'example.near',
        nonce: new Uint8Array(Buffer.from('KNV0cOpvJ50D5vfF9pqWom8wo2sliQ4W+Wa7uZ3Uk6Y=', 'base64')),
        callbackUrl: 'http://localhost:3000',
    });

    const expectedSignature = new Uint8Array(
        Buffer.from(
            'zzZQ/GwAjrZVrTIFlvmmQbDQHllfzrr8urVWHaRt5cPfcXaCSZo35c5LDpPpTKivR6BxLyb3lcPM0FfCW5lcBQ==',
            'base64'
        )
    );

    expect(signature).toStrictEqual(expectedSignature);
});

test('test sign NEP-413 message without callback url', async () => {
    const signer = new KeyPairSigner(
        KeyPair.fromString(
            'ed25519:3FyRtUUMxiNT1g2ST6mbj7W1CN7KfQBbomawC7YG4A1zwHmw2TRsn1Wc8NaFcBCoJDu3zt3znJDSwKQ31oRaKXH7'
        )
    );

    const { signature } = await signer.signNep413Message('round-toad.testnet', {
        message: 'Hello NEAR!',
        recipient: 'example.near',
        nonce: new Uint8Array(Buffer.from('KNV0cOpvJ50D5vfF9pqWom8wo2sliQ4W+Wa7uZ3Uk6Y=', 'base64')),
    });

    const expectedSignature = new Uint8Array(
        Buffer.from(
            'NnJgPU1Ql7ccRTITIoOVsIfElmvH1RV7QAT4a9Vh6ShCOnjIzRwxqX54JzoQ/nK02p7VBMI2vJn48rpImIJwAw==',
            'base64'
        )
    );

    expect(signature).toStrictEqual(expectedSignature);
});

test('test sign NEP-413 message throws error on invalid nonce', async () => {
    const signer = new KeyPairSigner(
        KeyPair.fromString(
            'ed25519:3FyRtUUMxiNT1g2ST6mbj7W1CN7KfQBbomawC7YG4A1zwHmw2TRsn1Wc8NaFcBCoJDu3zt3znJDSwKQ31oRaKXH7'
        )
    );

    await expect(() =>
        signer.signNep413Message('example.near', {
            message: 'Hello NEAR!',
            recipient: 'round-toad.testnet',
            nonce: new Uint8Array(new Array(28)),
        })
    ).rejects.toThrow();
});

test('generate correct hash for NEP-413-compliant message', async () => {
    const signMessageParams = {
        message: 'Hello NEAR!',
        recipient: 'round-toad.testnet',
        nonce: new Uint8Array(Buffer.from('KNV0cOpvJ50D5vfF9pqWom8wo2sliQ4W+Wa7uZ3Uk6Y=', 'base64')),
    };

    const serializedPrefix = serialize('u32', 2147484061);
    const serializedParams = serialize(Nep413MessageSchema, signMessageParams);

    const serializedPayload = new Uint8Array(serializedPrefix.length + serializedParams.length);
    serializedPayload.set(serializedPrefix);
    serializedPayload.set(serializedParams, serializedPrefix.length);

    const existingSerializedPayloadHash = new Uint8Array(sha256(serializedPayload));

    const expectedSerializedPayloadHash = new Uint8Array([
        1, 152, 236, 223, 103, 218, 230, 0, 34, 54, 210, 18, 244, 68, 108, 252, 140, 166, 102, 57, 242, 4, 202, 234,
        205, 94, 246, 245, 198, 141, 23, 250,
    ]);

    expect(existingSerializedPayloadHash).toEqual(expectedSerializedPayloadHash);
});

test('verify signature generated using NEP-413 payload hash', async () => {
    const signer = new KeyPairSigner(
        KeyPair.fromString(
            'ed25519:3FyRtUUMxiNT1g2ST6mbj7W1CN7KfQBbomawC7YG4A1zwHmw2TRsn1Wc8NaFcBCoJDu3zt3znJDSwKQ31oRaKXH7'
        )
    );

    const { signature } = await signer.signNep413Message('example.near', {
        message: 'Hello NEAR!',
        recipient: 'round-toad.testnet',
        nonce: new Uint8Array(Buffer.from('KNV0cOpvJ50D5vfF9pqWom8wo2sliQ4W+Wa7uZ3Uk6Y=', 'base64')),
    });

    const signMessageParams = {
        message: 'Hello NEAR!',
        recipient: 'round-toad.testnet',
        nonce: new Uint8Array(Buffer.from('KNV0cOpvJ50D5vfF9pqWom8wo2sliQ4W+Wa7uZ3Uk6Y=', 'base64')),
    };
    const serializedPrefix = serialize('u32', 2147484061);
    const serializedParams = serialize(Nep413MessageSchema, signMessageParams);

    const serializedPayload = new Uint8Array(serializedPrefix.length + serializedParams.length);
    serializedPayload.set(serializedPrefix);
    serializedPayload.set(serializedParams, serializedPrefix.length);

    const existingSerializedPayloadHash = new Uint8Array(sha256(serializedPayload));

    const publicKey = await signer.getPublicKey();

    expect(publicKey.verify(existingSerializedPayloadHash, signature)).toBe(true);
});

test('test getPublicKey returns correct public key', async () => {
    const keyPair = KeyPair.fromString('ed25519:4RDn17Y8bm6FRg57BhW7eVnrHTF2nsmRfkj1nPXR1zYB');
    const signer = new KeyPairSigner(keyPair);

    const publicKey = (await signer.getPublicKey()).toString();
    expect(publicKey).toBe('ed25519:Bpz2oUnMM8MM8trXmdAJW5sS1TtPkMot4cosa16ZeYFQ');
});

test('test static fromSecretKey creates a corresponding KeyPair', async () => {
    const signer = KeyPairSigner.fromSecretKey('ed25519:4RDn17Y8bm6FRg57BhW7eVnrHTF2nsmRfkj1nPXR1zYB');

    const publicKey = (await signer.getPublicKey()).toString();
    expect(publicKey).toBe('ed25519:Bpz2oUnMM8MM8trXmdAJW5sS1TtPkMot4cosa16ZeYFQ');
});

test('test sign delegate action', async () => {
    const signer = new KeyPairSigner(
        KeyPair.fromString(
            'ed25519:3FyRtUUMxiNT1g2ST6mbj7W1CN7KfQBbomawC7YG4A1zwHmw2TRsn1Wc8NaFcBCoJDu3zt3znJDSwKQ31oRaKXH7'
        )
    );

    const delegateAction = buildDelegateAction({
        receiverId: 'receiver.testnet',
        senderId: 'sender.testnet',
        nonce: 1n,
        maxBlockHeight: 1848319858n,
        actions: [],
        publicKey: await signer.getPublicKey(),
    });

    const [hash, { signature }] = await signer.signDelegateAction(delegateAction);

    expect(Buffer.from(hash).toString('hex')).toBe('6d35575b3566fddf04f79317c3e574eb89c5bc228c5e755f2a3179e164dbb36b');

    expect(Buffer.from(signature.data).toString('hex')).toBe(
        '6996219a3d971a256fcf7b7ad748aec7f1c84868cd59df3d756d8a022498a636e63f16809a54918c473e9a8bf4b0b35477a6b671eab65b1b28fd9fae2a668c00'
    );
});

test('test sign delegate action with wrong public key', async () => {
    const signer = new KeyPairSigner(
        KeyPair.fromString(
            'ed25519:3FyRtUUMxiNT1g2ST6mbj7W1CN7KfQBbomawC7YG4A1zwHmw2TRsn1Wc8NaFcBCoJDu3zt3znJDSwKQ31oRaKXH7'
        )
    );

    const delegateAction = buildDelegateAction({
        receiverId: 'receiver.testnet',
        senderId: 'sender.testnet',
        nonce: 1n,
        maxBlockHeight: 1848319858n,
        actions: [],
        publicKey: KeyPair.fromString(
            'ed25519:2Pm1R2qRtkbFErVrjqgtNutMqEVvrErQ3wSns6rN4jd7nnmzCbda4kwRCBAnBR7RWf2faRqVMuFaJzhJp1eYfhvV'
        ).getPublicKey(),
    });

    await expect(() => signer.signDelegateAction(delegateAction)).rejects.toThrow();
});
