import { Provider, JsonRpcProvider } from './providers';
import { Signer, InMemorySigner } from './signer';

/**
 * @param config Contains connection info details
 * @returns {Provider}
 */
function getProvider(config: any): Provider {
    switch (config.type) {
        case undefined:
            return config;
        case 'JsonRpcProvider': return new JsonRpcProvider({ ...config.args });
        default: throw new Error(`Unknown provider type ${config.type}`);
    }
}

/**
 * @param config Contains connection info details
 * @returns {Signer}
 */
function getSigner(config: any): Signer {
    switch (config.type) {
        case undefined:
            return config;
        case 'InMemorySigner': {
            return new InMemorySigner(config.keyStore);
        }
        default: throw new Error(`Unknown signer type ${config.type}`);
    }
}

/**
 * Connects an account to a given network via a given provider
 */
export class Connection {
    readonly networkId: string;
    readonly provider: Provider;
    readonly signer: Signer;
    readonly jsvmAccountId: string;

    constructor(networkId: string, provider: Provider, signer: Signer, jsvmAccountId: string) {
        this.networkId = networkId;
        this.provider = provider;
        this.signer = signer;
        this.jsvmAccountId = jsvmAccountId; 
    }

    /**
     * @param config Contains connection info details
     */
    static fromConfig(config: any): Connection {
        const provider = getProvider(config.provider);
        const signer = getSigner(config.signer);
        return new Connection(config.networkId, provider, signer, config.jsvmAccountId);
    }
}
