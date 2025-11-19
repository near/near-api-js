import { KeyPair, PublicKey, KeyPairString } from "../crypto/index.js";
import { Signer } from "./signer.js";

/**
 * Signs using in KeyPair.
 */
export class KeyPairSigner extends Signer {
    private readonly key: KeyPair;

    constructor(key: KeyPair) {
        super();
        this.key = key;
    }

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
