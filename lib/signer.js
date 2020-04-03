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
    async createKey(accountId, networkId) {
        const keyPair = key_pair_1.KeyPair.fromRandom('ed25519');
        await this.keyStore.setKey(networkId, accountId, keyPair);
        return keyPair.getPublicKey();
    }
    async getPublicKey(accountId, networkId) {
        const keyPair = await this.keyStore.getKey(networkId, accountId);
        if (keyPair === null) {
            return null;
        }
        return keyPair.getPublicKey();
    }
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
