import {
    generateSeedPhrase as internalGenerateSeedPhrase,
    parseSeedPhrase as internalParseSeedPhrase,
} from 'near-seed-phrase';
import type { KeyPairString } from '../crypto/constants.js';
import { KeyPair } from '../crypto/key_pair.js';

export function parseSeedPhrase(seedPhrase: string): KeyPair {
    const { secretKey } = internalParseSeedPhrase(seedPhrase);

    return KeyPair.fromString(secretKey as KeyPairString);
}

export function generateSeedPhrase(): { seedPhrase: string; keyPair: KeyPair } {
    const { seedPhrase, secretKey } = internalGenerateSeedPhrase();

    return {
        seedPhrase,
        keyPair: KeyPair.fromString(secretKey as KeyPairString),
    };
}
