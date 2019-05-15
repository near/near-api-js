const bs58 = require('bs58');
const nacl = require('tweetnacl');
const ed2curve = require('./ed2curve');

/**
 * This class provides key pair functionality (generating key pairs, encoding key pairs).
 */
class KeyPair {
    /**
     * Construct an instance of key pair given a public key and secret key. It's generally assumed that these
     * are encoded in bs58.
     * @param {string} publicKey 
     * @param {string} secretKey 
     */
    constructor(publicKey, secretKey) {
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }

    /**
     * Get the public key.
     */
    getPublicKey() {
        return this.publicKey;
    }

    /**
     * Get the Curve25519 public key.
     */
    getPublicKeyCurve25519() {
        if (!this.publicKeyCurve25519) {
            this.publicKeyCurve25519 = KeyPair.encodeBufferInBs58(ed2curve.convertPublicKey(bs58.decode(this.publicKey)));
        }
        return this.publicKeyCurve25519;
    }

    /**
     * Get the secret key.
     * @example
     *  // Passing existing key into a function to store in local storage
     *  async setKey(accountId, key) {
     *      window.localStorage.setItem(
     *          BrowserLocalStorageKeystore.storageKeyForPublicKey(accountId), key.getPublicKey());
     *      window.localStorage.setItem(
     *          BrowserLocalStorageKeystore.storageKeyForSecretKey(accountId), key.getSecretKey());
     *  }
     */
    getSecretKey() {
        return this.secretKey;
    }

    /**
     * Get the Curve25519 secret key.
     */
    getSecretKeyCurve25519() {
        if (!this.secretKeyCurve25519) {
            this.secretKeyCurve25519 = KeyPair.encodeBufferInBs58(ed2curve.convertSecretKey(bs58.decode(this.secretKey)));
        }
        return this.secretKeyCurve25519;
    }

    /**
     * Generate a new keypair from a random seed
     * @example
     * const keyWithRandomSeed = KeyPair.fromRandomSeed();
     * keyWithRandomSeed.getPublicKey()
     * // returns [PUBLIC_KEY]
     * 
     * keyWithRandomSeed.getSecretKey()
     * // returns [SECRET_KEY]
     */
    static fromRandomSeed() {
        let newKeypair = nacl.sign.keyPair();
        const result = new KeyPair(
            KeyPair.encodeBufferInBs58(newKeypair.publicKey),
            KeyPair.encodeBufferInBs58(newKeypair.secretKey));
        return result;
    }

    /**
     * Encode a buffer as string using bs58
     * @param {Buffer} buffer 
     * @example
     * KeyPair.encodeBufferInBs58(key.publicKey)
     */
    static encodeBufferInBs58(buffer) {
        const bytes = Buffer.from(buffer);
        const encodedValue = bs58.encode(bytes);
        return encodedValue;
    }
}
module.exports = KeyPair;
