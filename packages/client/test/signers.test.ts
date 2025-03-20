import { beforeAll, expect, test } from '@jest/globals';
import { InMemoryKeyStore } from '@near-js/keystores';
import { generateRandomKeyPair, getSignerFromKeystore, getSignerFromPrivateKey } from '../src';

const keyStore = new InMemoryKeyStore();
const NETWORK_ID = 'custom';
const ACCOUNT_ID = 'dontcare';

beforeAll(async () => {
    const keyPair = generateRandomKeyPair('ed25519');
    await keyStore.setKey(NETWORK_ID, ACCOUNT_ID, keyPair);
});

test('signer from privateKey/keyPair', async () => {
    const keyPair = await keyStore.getKey(NETWORK_ID, ACCOUNT_ID);

    const signer = getSignerFromPrivateKey(keyPair.toString());
    expect(signer).toBeDefined();

    const publicKey = await signer.getPublicKey();
    expect(publicKey).toEqual(keyPair.getPublicKey());

    const message = new TextEncoder().encode('test');
    const signature = await signer.signMessage(message);

    expect(keyPair.getPublicKey().verify(message, signature)).toBeTruthy();
});

test('signer from keyStore', async () => {
    const signer = getSignerFromKeystore(ACCOUNT_ID, NETWORK_ID, keyStore);
    expect(signer).toBeDefined();

    const publicKey = await signer.getPublicKey();
    expect(publicKey).toBeDefined();

    const message = new TextEncoder().encode('test');
    const signature = await signer.signMessage(message);

    const keyPair = await keyStore.getKey(NETWORK_ID, ACCOUNT_ID);
    expect(keyPair.getPublicKey().verify(message, signature)).toBeTruthy();
});