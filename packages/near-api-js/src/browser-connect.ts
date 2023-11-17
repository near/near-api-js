/**
 * Connect to NEAR using the provided configuration.
 *
 * {@link browserConnect!ConnectConfig.networkId | ConnectConfig.networkId} and {@link browserConnect!ConnectConfig.nodeUrl | ConnectConfig.nodeUrl} are required.
 *
 * To sign transactions you can also pass: {@link browserConnect!ConnectConfig.keyStore | ConnectConfig.keyStore}
 *
 * Both are passed they are prioritize in that order.
 *
 * @see {@link browserConnect!ConnectConfig | ConnectConfig}
 * @example
 * ```js
 * async function initNear() {
 *   const near = await connect({
 *      networkId: 'testnet',
 *      nodeUrl: 'https://rpc.testnet.near.org'
 *   })
 * }
 * ```
 *
 * @module browserConnect
 */
import { Near, NearConfig } from './near';

export interface ConnectConfig extends NearConfig {
    /** @hidden */
    keyPath?: string;
}

/**
 * Initialize connection to Near network.
 */
export async function connect(config: ConnectConfig): Promise<Near> {
    return new Near(config);
}
