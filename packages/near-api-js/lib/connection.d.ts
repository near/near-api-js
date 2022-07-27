import { Provider } from './providers';
import { Signer } from './signer';
/**
 * Connects an account to a given network via a given provider
 */
export declare class Connection {
    readonly networkId: string;
    readonly provider: Provider;
    readonly signer: Signer;
    readonly jsvmAccountId: string;
    constructor(networkId: string, provider: Provider, signer: Signer, jsvmAccountId: string);
    /**
     * @param config Contains connection info details
     */
    static fromConfig(config: any): Connection;
}
