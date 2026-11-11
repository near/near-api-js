import {
    generateSeedPhrase as internalGenerateSeedPhrase,
    parseSeedPhrase as internalParseSeedPhrase,
} from 'near-seed-phrase';
import type { KeyPairString } from '../crypto/constants.js';
import { KeyPair } from '../crypto/key_pair.js';

/**
 * Derives an Ed25519 key pair from a seed phrase using the `near-seed-phrase` default derivation path.
 * @param seedPhrase - Recovery phrase to import. Treat it as a secret.
 * @returns The derived key pair; does not import credentials into a wallet or create an account.
 * @throws If the underlying seed phrase parser rejects the phrase.
 */
export function parseSeedPhrase(seedPhrase: string): KeyPair {
    const { secretKey } = internalParseSeedPhrase(seedPhrase);

    return KeyPair.fromString(secretKey as KeyPairString);
}

/**
 * Generates a recovery phrase and its derived Ed25519 key pair.
 * @returns The secret recovery phrase and key pair. Neither is persisted and no account is created.
 */
export function generateSeedPhrase(): { seedPhrase: string; keyPair: KeyPair } {
    const { seedPhrase, secretKey } = internalGenerateSeedPhrase();

    return {
        seedPhrase,
        keyPair: KeyPair.fromString(secretKey as KeyPairString),
    };
}
