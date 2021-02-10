import { Near, NearConfig } from './near';

export type ConnectConfig = NearConfig & {
    keyPath?: string;
}

/**
 * Initialize connection to Near network.
 */
export async function connect(config: ConnectConfig): Promise<Near> {
    return new Near(config);
}