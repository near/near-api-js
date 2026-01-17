import { parseSeedPhrase as internalParseSeedPhrase } from 'near-seed-phrase';
import type { KeyPairString } from '../crypto/constants.js';
import { KeyPair } from '../crypto/key_pair.js';

export function parseSeedPhrase(seedPhrase: string): KeyPair {
    const { secretKey } = internalParseSeedPhrase(seedPhrase);

    return KeyPair.fromString(secretKey as KeyPairString);
}
