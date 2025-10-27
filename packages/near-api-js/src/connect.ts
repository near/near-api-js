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
import { InMemoryKeyStore, MergeKeyStore } from './key_stores';
import { Near, NearConfig } from './near';
import { Logger } from '@near-js/utils';
import { Connection } from '@near-js/accounts';
import { JsonRpcProvider } from '@near-js/providers';
import depd from 'depd';

/** @deprecated Will be removed in the next major release */
export interface ConnectConfig extends NearConfig {
    /**
     * Initialize an {@link InMemoryKeyStore} by reading the file at keyPath.
     */
    keyPath?: string;
}

/**
 * @deprecated Will be removed in the next major release
 * 
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
    const deprecate = depd('connect(config)');
    deprecate(`It will be removed in the next major release, please switch to using Account directly`);

    if (config.logger === false) {
        // disables logging
        Logger.overrideLogger(undefined);
    } else if (config.logger !== undefined && config.logger !== null) {
        Logger.overrideLogger(config.logger);
    }

    // Try to find extra key in `KeyPath` if provided.
    if (config.keyPath && (config.keyStore ||  config.deps?.keyStore)) {
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
                config.keyStore = new MergeKeyStore([
                    keyPathStore,
                    config.keyStore || config.deps?.keyStore
                ], { writeKeyStoreIndex: 1 });
                Logger.log(`Loaded master account ${accountKeyFile[0]} key from ${config.keyPath} with public key = ${keyPair.getPublicKey()}`);
            }
        } catch (error) {
            Logger.warn(`Failed to load master account key from ${config.keyPath}: ${error}`);
        }
    }
    return new Near(config);
}

/**
 * Configuration for read-only NEAR connection
 */
export interface ReadOnlyConnectionConfig {
    /** NEAR network ID (e.g., 'mainnet', 'testnet') */
    networkId: string;
    /** RPC endpoint URL */
    nodeUrl: string;
    /** Optional HTTP headers for RPC requests (e.g., API keys, authentication) */
    headers?: { [key: string]: string | number };
}

/**
 * Initialize a read-only connection to NEAR network.
 *
 * Use this for operations that don't require signing transactions:
 * - Querying account state
 * - Calling view functions
 * - Reading blockchain data
 * - Analytics and monitoring
 *
 * For operations requiring transaction signing, use Account directly with a Signer.
 *
 * @param config Read-only connection configuration
 * @returns Connection instance for querying NEAR
 *
 * @example Basic connection
 * ```typescript
 * import { connectReadOnly } from 'near-api-js';
 *
 * const connection = await connectReadOnly({
 *     networkId: 'mainnet',
 *     nodeUrl: 'https://rpc.mainnet.near.org'
 * });
 *
 * // Query account state
 * const accountState = await connection.provider.query({
 *     request_type: 'view_account',
 *     finality: 'final',
 *     account_id: 'example.near'
 * });
 * ```
 *
 * @example With API key authentication
 * ```typescript
 * import { connectReadOnly } from 'near-api-js';
 *
 * const connection = await connectReadOnly({
 *     networkId: 'mainnet',
 *     nodeUrl: 'https://rpc.mainnet.fastnear.com',
 *     headers: { 'Authorization': `Bearer ${process.env.API_KEY}` }
 * });
 * ```
 *
 * @example Call view function
 * ```typescript
 * const result = await connection.provider.query({
 *     request_type: 'call_function',
 *     finality: 'final',
 *     account_id: 'contract.near',
 *     method_name: 'get_data',
 *     args_base64: Buffer.from(JSON.stringify(args)).toString('base64')
 * });
 *
 * const data = JSON.parse(Buffer.from(result.result).toString());
 * ```
 *
 * @see {@link Connection} for the returned Connection object
 * @see {@link JsonRpcProvider} for available query methods
 */
export async function connectReadOnly(config: ReadOnlyConnectionConfig): Promise<Connection> {
    const provider = new JsonRpcProvider({
        url: config.nodeUrl,
        headers: config.headers
    });

    return new Connection(
        config.networkId,
        provider,
        null // No signer for read-only operations
    );
}
