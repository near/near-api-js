import type { CurveType, KeyPairString } from './constants.js';
import { KeyPairBase } from './key_pair_base.js';
import { KeyPairEd25519 } from './key_pair_ed25519.js';
import { KeyPairMLDSA65 } from './key_pair_ml_dsa_65.js';
import { KeyPairSecp256k1 } from './key_pair_secp256k1.js';

export abstract class KeyPair extends KeyPairBase {
    /**
     * Generates a local key pair without creating an account or saving credentials.
     * @param curve - Key algorithm: `ed25519`, `secp256k1`, or `ml-dsa-65` (case-insensitive).
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve: CurveType): KeyPair {
        switch (curve.toUpperCase()) {
            case 'ED25519':
                return KeyPairEd25519.fromRandom();
            case 'SECP256K1':
                return KeyPairSecp256k1.fromRandom();
            case 'ML-DSA-65':
                return KeyPairMLDSA65.fromRandom();
            default:
                throw new Error(`Unknown curve ${curve}`);
        }
    }

    /**
     * Creates a key pair from an encoded key string.
     * @param encodedKey - Curve-prefixed Base58 secret key, such as `ed25519:...`.
     * @returns {KeyPair} The key pair created from the encoded key string.
     * @throws If the prefix, encoding, or key material is invalid.
     */
    static fromString(encodedKey: KeyPairString): KeyPair {
        const parts = encodedKey.split(':');
        if (parts.length === 2) {
            switch (parts[0]!.toUpperCase()) {
                case 'ED25519':
                    return new KeyPairEd25519(parts[1]!);
                case 'SECP256K1':
                    return new KeyPairSecp256k1(parts[1]!);
                case 'ML-DSA-65':
                    return new KeyPairMLDSA65(parts[1]!);
                default:
                    throw new Error(`Unknown curve: ${parts[0]}`);
            }
        } else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }
}
