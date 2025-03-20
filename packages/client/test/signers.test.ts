import { beforeAll, expect, test, describe } from '@jest/globals';
import { InMemoryKeyStore } from '@near-js/keystores';
import { generateRandomKeyPair, getSignerFromKeystore, getSignerFromPrivateKey, MessageSigner } from '../src';
import { sha256 } from '@noble/hashes/sha256';
import { CurveType, KeyPair } from '@near-js/crypto';

const keyStore = new InMemoryKeyStore();
const NETWORK_ID = 'custom';
const ACCOUNT_ID = 'dontcare';
const MESSAGE = new TextEncoder().encode('test');
const HASHED_MESSAGE = sha256(MESSAGE);

async function setupKeyPair(keyType: CurveType) {
    const keyPair = generateRandomKeyPair(keyType);
    await keyStore.setKey(NETWORK_ID, ACCOUNT_ID, keyPair);
    return keyPair;
}

async function testSigningAndVerification(signer: MessageSigner, keyPair: KeyPair) {
    expect(signer).toBeDefined();

    const publicKey = await signer.getPublicKey();
    expect(publicKey).toEqual(keyPair.getPublicKey());

    const signature = await signer.signMessage(MESSAGE);
    expect(keyPair.getPublicKey().verify(HASHED_MESSAGE, signature)).toBeTruthy();
}

// Parameterized test for both key types
["ed25519", "SECP256K1"].forEach((keyType) => {
    describe(keyType, () => {
        let keyPair: KeyPair;

        beforeAll(async () => {
            keyPair = await setupKeyPair(keyType as CurveType);
        });

        test('signing with privateKey/keyPair signer', async () => {
            const signer = getSignerFromPrivateKey(keyPair.toString());
            await testSigningAndVerification(signer, keyPair);
        });

        test('signing with keyStore signer', async () => {
            const signer = getSignerFromKeystore(ACCOUNT_ID, NETWORK_ID, keyStore);
            await testSigningAndVerification(signer, keyPair);
        });
    });
});
