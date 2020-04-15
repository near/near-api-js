"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_sha256_1 = __importDefault(require("js-sha256"));
const key_pair_1 = require("./utils/key_pair");
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
     * Creates a public key for the account given
     * @param accountId The NEAR account to assign a public key to
     * @param networkId The targeted network. (ex. default, devnet, betanet, etc…)
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
     * @param networkId The targeted network. (ex. default, devnet, betanet, etc…)
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
     * @param networkId The targeted network. (ex. default, devnet, betanet, etc…)
     * @returns {Promise<Signature>}
     */
    async signMessage(message, accountId, networkId) {
        const hash = new Uint8Array(js_sha256_1.default.sha256.array(message));
        if (!accountId) {
            throw new Error('InMemorySigner requires provided account id');
        }
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            throw new Error(`Key for ${accountId} not found in ${networkId}`);
        }
        return keyPair.sign(hash);
    }
}
exports.InMemorySigner = InMemorySigner;
