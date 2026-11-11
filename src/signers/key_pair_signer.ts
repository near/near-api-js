import { KeyPair, type KeyPairString, type PublicKey } from '../crypto/index.js';
import { Signer } from './signer.js';

/**
 * Signs locally using an in-memory key pair. Does not submit transactions or store credentials.
 */
export class KeyPairSigner extends Signer {
    private readonly key: KeyPair;

    constructor(key: KeyPair) {
        super();
        this.key = key;
    }

    /**
     * Creates a local signer from a secret key.
     * @param encodedKey - Curve-prefixed Base58 secret key, such as `ed25519:...`.
     * @returns A signer holding the imported key pair in memory.
     * @throws If the key format or key material is invalid.
     */
    public static fromSecretKey(encodedKey: KeyPairString): KeyPairSigner {
        const key = KeyPair.fromString(encodedKey);

        return new KeyPairSigner(key);
    }

    public async getPublicKey(): Promise<PublicKey> {
        return this.key.getPublicKey();
    }

    protected async signBytes(bytes: Uint8Array): Promise<Uint8Array> {
        const { signature } = this.key.sign(bytes);
        return new Uint8Array(signature);
    }
}
