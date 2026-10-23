import {
    generateSeedPhrase as internalGenerateSeedPhrase,
    parseSeedPhrase as internalParseSeedPhrase,
    type SeedPhraseOptions,
} from 'near-seed-phrase';
import type { KeyPairString } from '../crypto/constants.js';
import { KeyPair } from '../crypto/key_pair.js';

export type { SeedPhraseOptions } from 'near-seed-phrase';

/**
 * Derive a key pair, preserving the legacy Ed25519 default at `m/44'/397'/0'`.
 * Set `keyType: 'ml-dsa-65'` for NEP-649; recovery must use the original path and passphrase.
 */
export function parseSeedPhrase(seedPhrase: string, options?: SeedPhraseOptions): KeyPair {
    const { secretKey } = internalParseSeedPhrase(seedPhrase, options);

    return KeyPair.fromString(secretKey as KeyPairString);
}

/**
 * Generate a 12-word Ed25519 phrase by default, or a 24-word NEP-649 phrase
 * when explicitly selecting `keyType: 'ml-dsa-65'`.
 */
export function generateSeedPhrase(options?: SeedPhraseOptions): { seedPhrase: string; keyPair: KeyPair } {
    const { seedPhrase, secretKey } = internalGenerateSeedPhrase(undefined, options);

    return {
        seedPhrase,
        keyPair: KeyPair.fromString(secretKey as KeyPairString),
    };
}
