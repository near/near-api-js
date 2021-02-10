"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const unencrypted_file_system_keystore_1 = require("./key_stores/unencrypted_file_system_keystore");
const key_stores_1 = require("./key_stores");
const near_1 = require("./near");
/**
 * Initialize connection to Near network.
 */
async function connect(config) {
    // Try to find extra key in `KeyPath` if provided.
    if (config.keyPath && config.deps && config.deps.keyStore) {
        try {
            const accountKeyFile = await unencrypted_file_system_keystore_1.readKeyFile(config.keyPath);
            if (accountKeyFile[0]) {
                // TODO: Only load key if network ID matches
                const keyPair = accountKeyFile[1];
                const keyPathStore = new key_stores_1.InMemoryKeyStore();
                await keyPathStore.setKey(config.networkId, accountKeyFile[0], keyPair);
                if (!config.masterAccount) {
                    config.masterAccount = accountKeyFile[0];
                }
                config.deps.keyStore = new key_stores_1.MergeKeyStore([config.deps.keyStore, keyPathStore]);
                console.log(`Loaded master account ${accountKeyFile[0]} key from ${config.keyPath} with public key = ${keyPair.getPublicKey()}`);
            }
        }
        catch (error) {
            console.warn(`Failed to load master account key from ${config.keyPath}: ${error}`);
        }
    }
    return new near_1.Near(config);
}
exports.connect = connect;
