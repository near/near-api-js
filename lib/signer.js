"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemorySigner = exports.Signer = void 0;
const sha256_browser_1 = require("@aws-crypto/sha256-browser");
const key_pair_1 = require("./utils/key_pair");
const in_memory_key_store_1 = require("./key_stores/in_memory_key_store");
/**
 * General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.
 */
class Signer {
}
exports.Signer = Signer;
/**
 * Signs using in memory key store.
 */
class InMemorySigner extends Signer {
    constructor(keyStore) {
        super();
        this.keyStore = keyStore;
    }
    /**
     * Creates a single account Signer instance with account, network and keyPair provided.
     *
     * Intended to be useful for temporary keys (e.g. claiming a Linkdrop).
     *
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account to assign the key pair to
     * @param keyPair The keyPair to use for signing
     */
    static async fromKeyPair(networkId, accountId, keyPair) {
        const keyStore = new in_memory_key_store_1.InMemoryKeyStore();
        await keyStore.setKey(networkId, accountId, keyPair);
        return new InMemorySigner(keyStore);
    }
    /**
     * Creates a public key for the account given
     * @param accountId The NEAR account to assign a public key to
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns {Promise<PublicKey>}
     */
    async createKey(accountId, networkId) {
        const keyPair = key_pair_1.KeyPair.fromRandom('ed25519');
        await this.keyStore.setKey(networkId, accountId, keyPair);
        return keyPair.getPublicKey();
    }
    /**
     * Gets the existing public key for a given account
     * @param accountId The NEAR account to assign a public key to
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns {Promise<PublicKey>} Returns the public key or null if not found
     */
    async getPublicKey(accountId, networkId) {
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            return null;
        }
        return keyPair.getPublicKey();
    }
    /**
     * @param message A message to be signed, typically a serialized transaction
     * @param accountId the NEAR account signing the message
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns {Promise<Signature>}
     */
    async signMessage(message, accountId, networkId) {
        const hash = new sha256_browser_1.Sha256();
        hash.update(message);
        const result = await hash.digest();
        if (!accountId) {
            throw new Error('InMemorySigner requires provided account id');
        }
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            throw new Error(`Key for ${accountId} not found in ${networkId}`);
        }
        return keyPair.sign(result);
    }
    toString() {
        return `InMemorySigner(${this.keyStore})`;
    }
}
exports.InMemorySigner = InMemorySigner;
