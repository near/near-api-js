import { CurveType, KeyPairString } from './constants.js';
import { KeyPairBase } from './key_pair_base.js';
import { KeyPairEd25519 } from './key_pair_ed25519.js';
import { KeyPairSecp256k1 } from './key_pair_secp256k1.js';

export abstract class KeyPair extends KeyPairBase {
    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve: CurveType): KeyPair {
        switch (curve.toUpperCase()) {
            case 'ED25519': return KeyPairEd25519.fromRandom();
            case 'SECP256K1': return KeyPairSecp256k1.fromRandom();
            default: throw new Error(`Unknown curve ${curve}`);
        }
    }

    /**
     * Creates a key pair from an encoded key string.
     * @param encodedKey The encoded key string.
     * @returns {KeyPair} The key pair created from the encoded key string.
     */
    static fromString(encodedKey: KeyPairString): KeyPair {
        const parts = encodedKey.split(':');
        if (parts.length === 2) {
            switch (parts[0].toUpperCase()) {
                case 'ED25519': return new KeyPairEd25519(parts[1]);
                case 'SECP256K1': return new KeyPairSecp256k1(parts[1]);
                default: throw new Error(`Unknown curve: ${parts[0]}`);
            }
        } else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }
}
