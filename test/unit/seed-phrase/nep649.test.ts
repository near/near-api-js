import { createHash } from 'node:crypto';
import { describe, expect, test } from 'vitest';
import { KeyPair } from '../../../src/crypto/key_pair.js';
import { generateSeedPhrase, parseSeedPhrase } from '../../../src/seed-phrase/index.js';
import { baseDecode } from '../../../src/utils/index.js';

const mnemonic =
    'orbit pill once attitude garbage prefer afford what banner weird path present dream tide unfold despair inject physical lens battle fancy finish fever toward';
const shortPath = "m/44'/397'/0'";
const fullPath = "m/44'/397'/0'/0'/1'";
const digest = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

describe('NEP-649 seed phrases', () => {
    // SHA-256 digests of the complete official expanded secret/public key bytes.
    // Source: https://github.com/vsavchyn-dev/NEPs/blob/cecbad372435edd17607a0a45401ab2cf5839fc8/neps/assets/nep-0649/test-vectors.json
    test.each([
        {
            derivationPath: shortPath,
            secretDigest: '22552d23d11aa06162499d16b7264eeb4f4f0b0eeebc37b23cbc92188c9f82aa',
            publicDigest: '377c1d992fb7b6f7975f9d1ad81c41ea80c27587ea8714b51e62057923937391',
        },
        {
            derivationPath: "m/44'/397'/1'/0'/1'",
            secretDigest: 'fda52994570099e3d7d4bdafff160422b96391d70625887e43b58edc79ab55b4',
            publicDigest: '6243d09f02e2adc4698cab290b8ddbdeb8da9399a38f81172d02bb40122c7780',
        },
    ])('matches the independent vector at $derivationPath', ({ derivationPath, secretDigest, publicDigest }) => {
        const key = parseSeedPhrase(mnemonic, { keyType: 'ml-dsa-65', derivationPath });
        expect(key.toString()).toMatch(/^ml-dsa-65:/);
        const secret = baseDecode(key.toString().split(':')[1]!);
        const publicKey = key.getPublicKey().data;
        expect(secret.length).toBe(4032);
        expect(publicKey.length).toBe(1952);
        expect(digest(secret)).toBe(secretDigest);
        expect(digest(publicKey)).toBe(publicDigest);
    });

    test('forwards a nonempty BIP39 passphrase and custom path', () => {
        const options = { keyType: 'ml-dsa-65', derivationPath: fullPath, passphrase: 'test passphrase' } as const;
        const key = parseSeedPhrase(mnemonic, options);
        expect(key.toString()).not.toBe(parseSeedPhrase(mnemonic, { ...options, passphrase: '' }).toString());
        expect(key.toString()).not.toBe(
            parseSeedPhrase(mnemonic, { ...options, derivationPath: shortPath }).toString()
        );
    });

    test('retains 12-word Ed25519 generation by default', () => {
        const { seedPhrase, keyPair } = generateSeedPhrase();
        expect(seedPhrase.split(' ')).toHaveLength(12);
        expect(keyPair.toString()).toMatch(/^ed25519:/);
        expect(parseSeedPhrase(seedPhrase).toString()).toBe(keyPair.toString());
    });

    test('generates and recovers a 24-word PQ phrase with explicit options', () => {
        const options = { keyType: 'ml-dsa-65', derivationPath: fullPath, passphrase: 'test passphrase' } as const;
        const { seedPhrase, keyPair } = generateSeedPhrase(options);
        expect(seedPhrase.split(' ')).toHaveLength(24);
        expect(keyPair.toString()).toMatch(/^ml-dsa-65:/);
        expect(parseSeedPhrase(seedPhrase, options).toString()).toBe(keyPair.toString());
        const restored = KeyPair.fromString(keyPair.toString());
        const message = new TextEncoder().encode('NEP-649 recovery round trip');
        const { signature } = restored.sign(message);
        expect(keyPair.verify(message, signature)).toBe(true);
        expect(keyPair.verify(new TextEncoder().encode('different message'), signature)).toBe(false);
    });
});
