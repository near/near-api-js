import { expectTypeOf, test } from 'vitest';
import type { KeyPair } from '../../../src/crypto/key_pair.js';
import { generateSeedPhrase, parseSeedPhrase, type SeedPhraseOptions } from '../../../src/seed-phrase/index.js';

test('exposes typed opt-in derivation options', () => {
    const options: SeedPhraseOptions = { keyType: 'ml-dsa-65', derivationPath: "m/44'/397'/0'", passphrase: 'test' };
    expectTypeOf(parseSeedPhrase('phrase', options)).toEqualTypeOf<KeyPair>();
    expectTypeOf(parseSeedPhrase('phrase')).toEqualTypeOf<KeyPair>();
    expectTypeOf(generateSeedPhrase(options)).toEqualTypeOf<{ seedPhrase: string; keyPair: KeyPair }>();
    // @ts-expect-error NEP-649 does not define a secp256k1 mnemonic derivation tree.
    parseSeedPhrase('phrase', { keyType: 'secp256k1' });
    // @ts-expect-error Paths are strings, not numeric indices.
    generateSeedPhrase({ derivationPath: 0 });
});
