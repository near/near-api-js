/**
 * Connect to NEAR using the provided configuration.
 *
 * {@link ConnectConfig#networkId} and {@link ConnectConfig#nodeUrl} are required.
 *
 * To sign transactions you can also pass: {@link ConnectConfig#keyStore}
 *
 * Both are passed they are prioritize in that order.
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
 *
 * @module browserConnect
 */
import depd from 'depd';
import { Near, NearConfig } from './near';

/** @deprecated Will be removed in the next major release */
export interface ConnectConfig extends NearConfig {
    /** @hidden */
    keyPath?: string;
}

/**
 * @deprecated Will be removed in the next major release
 * 
 * Initialize connection to Near network.
 */
export async function connect(config: ConnectConfig): Promise<Near> {
    const deprecate = depd('connect(config)');
    deprecate(`It will be removed in the next major release, please switch to using Account directly`);

    return new Near(config);
}
