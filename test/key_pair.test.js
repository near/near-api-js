const KeyPair = require('../signing/key_pair.js');
const {encryptBox, decryptBox, generateSharedSecret, encryptBoxAfter, decryptBoxAfter} = require('../signing/crypto.js');

let keyPair, keyPair2;

beforeAll(async () => {
    keyPair = KeyPair.fromRandomSeed();
    keyPair2 = KeyPair.fromRandomSeed();
});

test('KeyPair to Curve25519', async () => {
    const keyPub = keyPair.getPublicKey();
    const keySec = keyPair.getSecretKey();
    keyPair.keyPubCurve25519 = keyPair.getPublicKeyCurve25519();
    keyPair.keySecCurve25519 = keyPair.getSecretKeyCurve25519();
    keyPair2.keyPubCurve25519 = keyPair2.getPublicKeyCurve25519();
    keyPair2.keySecCurve25519 = keyPair2.getSecretKeyCurve25519();
    expect(keyPair.keyPubCurve25519).not.toBeNull();  
    expect(keyPair.keySecCurve25519).not.toBeNull();
});

test('KeyPair sharedSecret', async () => {
    var shared_secret_1 = generateSharedSecret(keyPair.keySecCurve25519, keyPair2.keyPubCurve25519);
    var shared_secret_2 = generateSharedSecret(keyPair2.keySecCurve25519, keyPair.keyPubCurve25519);
    expect(shared_secret_1).toEqual(shared_secret_2);  
});

test('KeyPair encrypt/decrypt box', async () => {
    var boxed = encryptBox("hello mike", keyPair.keySecCurve25519, keyPair2.keyPubCurve25519);
    var unboxed = decryptBox(boxed, keyPair2.keySecCurve25519, keyPair.keyPubCurve25519);
    expect("hello mike").toEqual(unboxed);  
});

test('KeyPair encrypt/decrypt box after', async () => {
    var shared_secret_1 = generateSharedSecret(keyPair.keySecCurve25519, keyPair2.keyPubCurve25519);
    var shared_secret_2 = generateSharedSecret(keyPair2.keySecCurve25519, keyPair.keyPubCurve25519);
    expect(shared_secret_1).toEqual(shared_secret_2);

    var boxed = encryptBoxAfter("hello joe", shared_secret_1);
    var unboxed = decryptBoxAfter(boxed, shared_secret_2);
    expect("hello joe").toEqual(unboxed);
});
