/**
 * Connect to NEAR using the provided configuration.
 *
 * {@link ConnectConfig.networkId} and {@link ConnectConfig.nodeUrl} are required.
 *
 * To sign transactions you can also pass:
 * 1. {@link ConnectConfig.keyStore}
 * 2. {@link ConnectConfig.keyPath}
 *
 * If all three are passed they are prioritize in that order.
 *
 * @see {@link ConnectConfig}
 * @example
 * ```js
 * async function initNear() {
 *   const near = await connect({
 *      networkId: 'testnet',
 *      nodeUrl: 'https://rpc.testnet.near.org'
 *   })
 * }
 * ```
 * @module connect
 */
import { readKeyFile } from './key_stores/unencrypted_file_system_keystore';
import { InMemoryKeyStore, MergeKeyStore } from './key_stores';
import { Near, NearConfig } from './near';
import fetch from './utils/setup-node-fetch';

global.fetch = fetch;

export interface ConnectConfig extends NearConfig {
    /**
     * Initialize an {@link InMemoryKeyStore} by reading the file at keyPath.
     */
    keyPath?: string;
    accountId?: string;
}

/**
 * Initialize connection to Near network.
 */
export async function connect(config: ConnectConfig): Promise<Near> {
    // Try to find extra key in `KeyPath` if provided.
    if (config.keyPath && (config.keyStore || config.deps && config.deps.keyStore)) {
        try {
            const accountKeyFile = await readKeyFile(config.keyPath);
            // If user explicitly specified an accountId, use that instead,
            // fallback to account ID from key file
            const accountId = config.accountId || accountKeyFile[0];
            if (accountId) {
                // TODO: Only load key if network ID matches
                const keyPair = accountKeyFile[1];
                const keyPathStore = new InMemoryKeyStore();
                await keyPathStore.setKey(config.networkId, accountId, keyPair);
                if (!config.masterAccount) {
                    config.masterAccount = accountId;
                }
                config.keyStore = new MergeKeyStore([
                    keyPathStore,
                    (config.keyStore || config.deps.keyStore)
                ], { writeKeyStoreIndex: 1 });
                console.log(`Loaded master account ${accountId} key from ${config.keyPath} with public key = ${keyPair.getPublicKey()}`);
            }
        } catch (error) {
            console.warn(`Failed to load master account key from ${config.keyPath}: ${error}`);
        }
    }
    return new Near(config);
}
