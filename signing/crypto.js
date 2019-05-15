const KeyPair = require('./key_pair');
const bs58 = require('bs58');
const nacl = require('tweetnacl');

/**
 * This class provides crypto functionality (encrypting and decrypting binaries).
 */
function encryptBox(message, secretKeyCurve25519, publicKeyCurve25519, nonce) {
    if (typeof(message) === "string") {
        message = Buffer.from(message);
    }
    if (typeof(secretKeyCurve25519) === "string") {
        secretKeyCurve25519 = bs58.decode(secretKeyCurve25519);
    }
    if (typeof(publicKeyCurve25519) === "string") {
        publicKeyCurve25519 = bs58.decode(publicKeyCurve25519);
    }
    if (nonce == null) {
        nonce = nacl.randomBytes(nacl.box.nonceLength);
    }

    var boxed = nacl.box(message, nonce, publicKeyCurve25519, secretKeyCurve25519)
    const catted = Buffer.concat([nonce, boxed]);
    return KeyPair.encodeBufferInBs58(catted);
}

function decryptBox(box, secretKeyCurve25519, publicKeyCurve25519) {
    if (typeof(box) === "string") {
        box = bs58.decode(box);
    }
    const nonce = box.slice(0, nacl.box.nonceLength);
    box = box.slice(nacl.box.nonceLength);

    if (typeof(secretKeyCurve25519) === "string") {
        secretKeyCurve25519 = bs58.decode(secretKeyCurve25519);
    }
    if (typeof(publicKeyCurve25519) === "string") {
        publicKeyCurve25519 = bs58.decode(publicKeyCurve25519);
    }

    var unboxed = nacl.box.open(box, nonce, publicKeyCurve25519, secretKeyCurve25519);
    return Buffer.from(unboxed).toString('utf8');
}

function generateSharedSecret(secretKeyCurve25519, publicKeyCurve25519) {
    if (typeof(publicKeyCurve25519) === "string") {
        publicKeyCurve25519 = bs58.decode(publicKeyCurve25519);
    }
    if (typeof(secretKeyCurve25519) === "string") {
        secretKeyCurve25519 = bs58.decode(secretKeyCurve25519);
    }
    return KeyPair.encodeBufferInBs58(nacl.box.before(publicKeyCurve25519, secretKeyCurve25519));
}

function encryptBoxAfter(message, sharedSecret, nonce) {
    if (typeof(message) === "string") {
        message = Buffer.from(message);
    }
    if (typeof(sharedSecret) === "string") {
        sharedSecret = bs58.decode(sharedSecret);
    }
    if (nonce == null) {
        nonce = nacl.randomBytes(nacl.box.nonceLength);
    }

    var boxed = nacl.box.after(message, nonce, sharedSecret);
    const catted = Buffer.concat([nonce, boxed]);
    return KeyPair.encodeBufferInBs58(catted);
}

function decryptBoxAfter(box, sharedSecret) {
    if (typeof(box) === "string") {
        box = bs58.decode(box);
    }
    const nonce = box.slice(0, nacl.box.nonceLength);
    box = box.slice(nacl.box.nonceLength);

    if (typeof(sharedSecret) === "string") {
        sharedSecret = bs58.decode(sharedSecret);
    }

    var unboxed = nacl.box.open.after(box, nonce, sharedSecret);
    return Buffer.from(unboxed).toString('utf8');
}

module.exports = {
    encryptBox: encryptBox,
    decryptBox: decryptBox,
    generateSharedSecret: generateSharedSecret,
    encryptBoxAfter: encryptBoxAfter,
    decryptBoxAfter: decryptBoxAfter,
}
