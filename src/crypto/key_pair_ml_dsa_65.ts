import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { baseDecode, baseEncode } from '../utils/index.js';

import { type KeyPairString, KeyType } from './constants.js';
import { KeyPairBase, type Signature } from './key_pair_base.js';
import { PublicKey } from './public_key.js';

/** ML-DSA-65 key pair for post-quantum transaction signing. */
export class KeyPairMLDSA65 extends KeyPairBase {
    readonly publicKey: PublicKey;
    readonly secretKey: string;

    constructor(secretKey: string) {
        super();
        const secretKeyBytes = baseDecode(secretKey);
        this.publicKey = new PublicKey({ keyType: KeyType.MLDSA65, data: ml_dsa65.getPublicKey(secretKeyBytes) });
        this.secretKey = secretKey;
    }

    static fromRandom(): KeyPairMLDSA65 {
        const { secretKey } = ml_dsa65.keygen();
        return new KeyPairMLDSA65(baseEncode(secretKey));
    }

    sign(message: Uint8Array): Signature {
        return { signature: ml_dsa65.sign(message, baseDecode(this.secretKey)), publicKey: this.publicKey };
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
