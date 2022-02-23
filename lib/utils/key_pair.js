"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyPairSecp256k1 = exports.KeyPairEd25519 = exports.KeyPair = exports.PublicKey = exports.KeyType = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const serialize_1 = require("./serialize");
const enums_1 = require("./enums");
const crypto_1 = require("crypto");
const secp256k1_1 = __importDefault(require("secp256k1"));
/** All supported key types */
var KeyType;
(function (KeyType) {
    KeyType[KeyType["ED25519"] = 0] = "ED25519";
    KeyType[KeyType["SECP256K1"] = 1] = "SECP256K1";
})(KeyType = exports.KeyType || (exports.KeyType = {}));
function key_type_to_str(keyType) {
    switch (keyType) {
        case KeyType.ED25519: return 'ed25519';
        case KeyType.SECP256K1: return 'secp256k1';
        default: throw new Error(`Unknown key type ${keyType}`);
    }
}
function str_to_key_type(keyType) {
    switch (keyType.toLowerCase()) {
        case 'ed25519': return KeyType.ED25519;
        case 'secp256k1': return KeyType.SECP256K1;
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
            // we don't need the recovery id to verify secp25k61 signatures locally, so drop  it here
            // also inject the 0x04 header back into the pubkey before trying to interact with it in
            // the secp256k1 library
            case KeyType.SECP256K1: return secp256k1_1.default.ecdsaVerify(signature.subarray(0, 64), message, new Uint8Array([0x04, ...this.data]));
            default: throw new Error(`Unknown key type ${this.keyType}`);
        }
    }
    static borshDeserialize(reader) {
        const keyType = reader.readU8();
        let data;
        switch (keyType) {
            case KeyType.ED25519:
                data = reader.readFixedArray(32);
                break;
            case KeyType.SECP256K1:
                data = reader.readFixedArray(64);
                break;
            default: throw new Error(`Unknown key type ${keyType}`);
        }
        return new PublicKey({ keyType, data });
    }
    borshSerialize(writer) {
        writer.writeU8(this.keyType);
        writer.writeFixedArray(this.data);
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
            case 'SECP256K1': return KeyPairSecp256k1.fromRandom();
            default: throw new Error(`Unknown curve ${curve}`);
        }
    }
    static fromString(encodedKey) {
        const parts = encodedKey.split(':');
        //TODO: clarify what we must do here
        if (parts.length === 1) {
            return new KeyPairEd25519(parts[0]);
        }
        else if (parts.length === 2) {
            switch (parts[0].toUpperCase()) {
                case 'ED25519': return new KeyPairEd25519(parts[1]);
                case 'SECP256K1': return new KeyPairSecp256k1(parts[1]);
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
}
exports.KeyPairEd25519 = KeyPairEd25519;
/**
 * This class provides key pair functionality for secp256k1 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 * nearcore expects secp256k1 public keys to be 64 bytes at all times,
 * even when string encoded the secp256k1 library returns 65 byte keys
 * (including a 1 byte header that indicates how the pubkey was encoded).
 * We'll force the secp256k1 library to always encode uncompressed
 * keys with the corresponding 0x04 header byte, then manually
 * insert/remove that byte as needed.
 */
class KeyPairSecp256k1 extends KeyPair {
    /**
     * Construct an instance of key pair given a secret key.
     * It's generally assumed that these are encoded in base58.
     * @param {string} secretKey
     */
    constructor(secretKey) {
        super();
        const withHeader = secp256k1_1.default.publicKeyCreate(serialize_1.base_decode(secretKey), false);
        const data = withHeader.subarray(1, withHeader.length); // remove the 0x04 header byte
        this.publicKey = new PublicKey({
            keyType: KeyType.SECP256K1,
            data
        });
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
        // TODO: find better way to generate PK
        const secretKey = crypto_1.randomBytes(32);
        return new KeyPairSecp256k1(serialize_1.base_encode(secretKey));
    }
    sign(message) {
        // nearcore expects 65 byte signatures formed by appending the recovery id to the 64 byte signature
        const { signature, recid } = secp256k1_1.default.ecdsaSign(message, serialize_1.base_decode(this.secretKey));
        return { signature: new Uint8Array([...signature, recid]), publicKey: this.publicKey };
    }
    verify(message, signature) {
        return this.publicKey.verify(message, signature);
    }
    toString() {
        return `secp256k1:${this.secretKey}`;
    }
    getPublicKey() {
        return this.publicKey;
    }
}
exports.KeyPairSecp256k1 = KeyPairSecp256k1;
