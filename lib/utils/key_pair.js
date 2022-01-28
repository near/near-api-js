"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyPairEd25519 = exports.KeyPair = exports.PublicKey = exports.KeyType = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const serialize_1 = require("./serialize");
const enums_1 = require("./enums");
const ed2curve_1 = require("ed2curve");
/** All supported key types */
var KeyType;
(function (KeyType) {
    KeyType[KeyType["ED25519"] = 0] = "ED25519";
})(KeyType = exports.KeyType || (exports.KeyType = {}));
function key_type_to_str(keyType) {
    switch (keyType) {
        case KeyType.ED25519: return 'ed25519';
        default: throw new Error(`Unknown key type ${keyType}`);
    }
}
function str_to_key_type(keyType) {
    switch (keyType.toLowerCase()) {
        case 'ed25519': return KeyType.ED25519;
        default: throw new Error(`Unknown key type ${keyType}`);
    }
}
/**
 * PublicKey representation that has type and bytes of the key.
 */
class PublicKey extends enums_1.Assignable {
    static from(value) {
        if (typeof value === 'string') {
            return PublicKey.fromString(value);
        }
        return value;
    }
    static fromString(encodedKey) {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new PublicKey({ keyType: KeyType.ED25519, data: serialize_1.base_decode(parts[0]) });
        }
        else if (parts.length === 2) {
            return new PublicKey({ keyType: str_to_key_type(parts[0]), data: serialize_1.base_decode(parts[1]) });
        }
        else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }
    toString() {
        return `${key_type_to_str(this.keyType)}:${serialize_1.base_encode(this.data)}`;
    }
    verify(message, signature) {
        switch (this.keyType) {
            case KeyType.ED25519: return tweetnacl_1.default.sign.detached.verify(message, signature, this.data);
            default: throw new Error(`Unknown key type ${this.keyType}`);
        }
    }
}
exports.PublicKey = PublicKey;
class KeyPair {
    /**
     * @param curve Name of elliptical curve, case-insensitive
     * @returns Random KeyPair based on the curve
     */
    static fromRandom(curve) {
        switch (curve.toUpperCase()) {
            case 'ED25519': return KeyPairEd25519.fromRandom();
            default: throw new Error(`Unknown curve ${curve}`);
        }
    }
    static fromString(encodedKey) {
        const parts = encodedKey.split(':');
        if (parts.length === 1) {
            return new KeyPairEd25519(parts[0]);
        }
        else if (parts.length === 2) {
            switch (parts[0].toUpperCase()) {
                case 'ED25519': return new KeyPairEd25519(parts[1]);
                default: throw new Error(`Unknown curve: ${parts[0]}`);
            }
        }
        else {
            throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
        }
    }
}
exports.KeyPair = KeyPair;
/**
 * This class provides key pair functionality for Ed25519 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
class KeyPairEd25519 extends KeyPair {
    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58.
     * @param {string} secretKey
     */
    constructor(secretKey) {
        super();
        const keyPair = tweetnacl_1.default.sign.keyPair.fromSecretKey(serialize_1.base_decode(secretKey));
        this.publicKey = new PublicKey({ keyType: KeyType.ED25519, data: keyPair.publicKey });
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
        const newKeyPair = tweetnacl_1.default.sign.keyPair();
        return new KeyPairEd25519(serialize_1.base_encode(newKeyPair.secretKey));
    }
    sign(message) {
        const signature = tweetnacl_1.default.sign.detached(message, serialize_1.base_decode(this.secretKey));
        return { signature, publicKey: this.publicKey };
    }
    verify(message, signature) {
        return this.publicKey.verify(message, signature);
    }
    toString() {
        return `ed25519:${this.secretKey}`;
    }
    getPublicKey() {
        return this.publicKey;
    }
    encryptMessage(message, receiverPublicKey) {
        const ephemeralKeyPair = tweetnacl_1.default.box.keyPair();
        const nonce = tweetnacl_1.default.randomBytes(24);
        const cipher = tweetnacl_1.default.box(message, nonce, ed2curve_1.convertPublicKey(receiverPublicKey.data), ephemeralKeyPair.secretKey);
        const result = new Uint8Array(nonce.length + cipher.length + ephemeralKeyPair.publicKey.length);
        result.set(ephemeralKeyPair.publicKey, 0);
        result.set(nonce, ephemeralKeyPair.publicKey.length);
        result.set(cipher, ephemeralKeyPair.publicKey.length + nonce.length);
        return result;
    }
    decryptMessage(fullCipher) {
        const secretKey = ed2curve_1.convertSecretKey(serialize_1.base_decode(this.secretKey));
        const senderPublicKey = fullCipher.slice(0, 32);
        const nonce = fullCipher.slice(32, 56);
        const cipher = fullCipher.slice(56);
        const plaintext = tweetnacl_1.default.box.open(cipher, nonce, senderPublicKey, secretKey);
        return plaintext;
    }
}
exports.KeyPairEd25519 = KeyPairEd25519;
