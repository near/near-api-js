import { Logger } from '@near-js/utils';
import { InMemoryKeyStore, MergeKeyStore } from './key_stores';
/**
 * Connect to NEAR using the provided configuration.
 *
 * {@link ConnectConfig#networkId} and {@link ConnectConfig#nodeUrl} are required.
 *
 * To sign transactions you can also pass:
 * 1. {@link ConnectConfig#keyStore}
 * 2. {@link ConnectConfig#keyPath}
 * 3. {@link ConnectConfig#deps.keyStore} (deprecated, only for use in legacy applications)
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
 * @example disable library logs
 * ```js
 * async function initNear() {
 *   const near = await connect({
 *      networkId: 'testnet',
 *      nodeUrl: 'https://rpc.testnet.near.org',
 *      logger: false
 *   })
 * }
 * @module connect
 */
import { readKeyFile } from './key_stores/unencrypted_file_system_keystore';
import { Near, type NearConfig } from './near';

export interface ConnectConfig extends NearConfig {
    /**
     * Initialize an {@link InMemoryKeyStore} by reading the file at keyPath.
     */
    keyPath?: string;
}

/**
 * Initialize connection to Near network.
 * @param config The configuration object for connecting to NEAR Protocol.
 * @returns A Promise that resolves to a `Near` object representing the connection.
 *
 * @example
 * ```js
 * const connectionConfig = {
 *   networkId: 'testnet',
 *   nodeUrl: 'https://rpc.testnet.near.org',
 *   walletUrl: 'https://wallet.testnet.near.org',
 *   helperUrl: 'https://helper.testnet.near.org',
 *   keyStore: new InMemoryKeyStore(),
 *   deps: { keyStore: new BrowserLocalStorageKeyStore() },
 *   logger: true,
 *   keyPath: '/path/to/account-key.json',
 *   masterAccount: 'master-account.near',
 * };
 *
 * const nearConnection = await connect(connectionConfig);
 * console.log(nearConnection); // Near object representing the connection
 * ```
 */
export async function connect(config: ConnectConfig): Promise<Near> {
    if (config.logger === false) {
        // disables logging
        Logger.overrideLogger(undefined);
    } else if (config.logger !== undefined && config.logger !== null) {
        Logger.overrideLogger(config.logger);
    }

    // Try to find extra key in `KeyPath` if provided.
    if (config.keyPath && (config.keyStore || config.deps?.keyStore)) {
        try {
            const accountKeyFile = await readKeyFile(config.keyPath);
            if (accountKeyFile[0]) {
                // TODO: Only load key if network ID matches
                const keyPair = accountKeyFile[1];
                const keyPathStore = new InMemoryKeyStore();
                await keyPathStore.setKey(config.networkId, accountKeyFile[0], keyPair);
                if (!config.masterAccount) {
                    config.masterAccount = accountKeyFile[0];
                }
                config.keyStore = new MergeKeyStore([keyPathStore, config.keyStore || config.deps?.keyStore], {
                    writeKeyStoreIndex: 1,
                });
                Logger.log(
                    `Loaded master account ${accountKeyFile[0]} key from ${config.keyPath} with public key = ${keyPair.getPublicKey()}`,
                );
            }
        } catch (error) {
            Logger.warn(`Failed to load master account key from ${config.keyPath}: ${error}`);
        }
    }
    return new Near(config);
}
