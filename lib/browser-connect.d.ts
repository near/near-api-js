import { Near, NearConfig } from './near';
export declare type ConnectConfig = NearConfig & {
    keyPath?: string;
};
/**
 * Initialize connection to Near network.
 */
export declare function connect(config: ConnectConfig): Promise<Near>;
