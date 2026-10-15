import { randomBytes } from '@noble/hashes/utils.js';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { baseDecode, baseEncode } from '../utils/index.js';

import { type KeyPairString, KeyType } from './constants.js';
import { KeyPairBase, type Signature } from './key_pair_base.js';
import { assertValidExpandedMLDSA65 } from './ml_dsa_65_validate.js';
import { PublicKey } from './public_key.js';

const SEED_LENGTH = 32;
const EXPANDED_LENGTH = 4032;

/**
 * ML-DSA-65 key pair for post-quantum transaction signing. The secret key string holds either the
 * 32-byte FIPS 204 seed (canonical) or the 4032-byte expanded private key (legacy), told apart by
 * length. Expanded keys are validated on import and exported unchanged.
 */
export class KeyPairMLDSA65 extends KeyPairBase {
    readonly publicKey: PublicKey;
    readonly secretKey: string;
    private readonly signingKey: Uint8Array;

    constructor(secretKey: string) {
        super();
        const secretKeyBytes = baseDecode(secretKey);
        if (secretKeyBytes.length === SEED_LENGTH) {
            const expanded = ml_dsa65.keygen(secretKeyBytes);
            this.signingKey = expanded.secretKey;
            this.publicKey = new PublicKey({ keyType: KeyType.MLDSA65, data: expanded.publicKey });
        } else if (secretKeyBytes.length === EXPANDED_LENGTH) {
            const publicKey = ml_dsa65.getPublicKey(secretKeyBytes);
            assertValidExpandedMLDSA65(secretKeyBytes, publicKey);
            this.signingKey = secretKeyBytes;
            this.publicKey = new PublicKey({ keyType: KeyType.MLDSA65, data: publicKey });
        } else {
            throw new Error(
                `ML-DSA-65 secret key must be ${SEED_LENGTH} or ${EXPANDED_LENGTH} bytes, got ${secretKeyBytes.length}`
            );
        }
        this.secretKey = secretKey;
    }

    static fromRandom(): KeyPairMLDSA65 {
        return new KeyPairMLDSA65(baseEncode(randomBytes(SEED_LENGTH)));
    }

    sign(message: Uint8Array): Signature {
        return { signature: ml_dsa65.sign(message, this.signingKey), publicKey: this.publicKey };
    }

    verify(message: Uint8Array, signature: Uint8Array): boolean {
        return this.publicKey.verify(message, signature);
    }

    toString(): KeyPairString {
        return `ml-dsa-65:${this.secretKey}`;
    }

    getPublicKey(): PublicKey {
        return this.publicKey;
    }
}
