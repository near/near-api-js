'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const elliptic_1 = require("elliptic");
const serialize_1 = require("./serialize");
let _ed25519curve = null;
function getEd25519Curve() {
    if (!_ed25519curve) {
        _ed25519curve = new elliptic_1.eddsa('ed25519');
    }
    return _ed25519curve;
}
/**
 * This class provides key pair functionality (generating key pairs, encoding key pairs).
 */
class KeyPairEd25519 {
    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58.
     * @param {string} secretKey
     */
    constructor(secretKey) {
        const keyPair = getEd25519Curve().keyFromSecret(serialize_1.base_decode(secretKey));
        this.publicKey = serialize_1.base_encode(Buffer.from(keyPair.getPublic()));
        this.secretKey = secretKey;
    }
    /**
     * Generate a new random keypair.
     * @example
     * const keyRandom = KeyPair.fromRandom();
     * keyRandom.publicKey
     * // returns [PUBLIC_KEY]
     *
     * keyRandom.secretKey
     * // returns [SECRET_KEY]
     */
    static fromRandom() {
        let secretKey = crypto_1.randomBytes(32);
        return new KeyPairEd25519(serialize_1.base_encode(secretKey));
    }
    sign(message) {
        const keyPair = getEd25519Curve().keyFromSecret(serialize_1.base_decode(this.secretKey));
        return keyPair.sign(message).toBytes();
    }
    verify(message, signature) {
        const keyPair = getEd25519Curve().keyFromSecret(serialize_1.base_decode(this.secretKey));
        return keyPair.verify(message, signature);
    }
}
exports.KeyPairEd25519 = KeyPairEd25519;
