import { Signer, KeyPairSigner } from "@near-js/signers";
import {
    Provider,
    JsonRpcProvider,
    FailoverRpcProvider,
} from "@near-js/providers";
import { IntoConnection } from "./interface";
import depd from 'depd';

/**
 * @param config Contains connection info details
 * @returns {Provider}
 */
function getProvider(config: any): Provider {
    switch (config.type) {
        case undefined:
            return config;
        case "JsonRpcProvider":
            return new JsonRpcProvider({ ...config.args });
        case "FailoverRpcProvider": {
            const providers = (config?.args || []).map(
                (arg) => new JsonRpcProvider(arg)
            );
            return new FailoverRpcProvider(providers);
        }
        default:
            throw new Error(`Unknown provider type ${config.type}`);
    }
}

/**
 * @param config Contains connection info details
 * @returns {Signer | null}
 */
function getSigner(config: any): Signer | null {
    if (config === null || config === undefined) {
        return null;
    }
    switch (config.type) {
        case undefined:
            return config;
        case "KeyPairSigner": {
            return new KeyPairSigner(config.keyPair);
        }
        default:
            throw new Error(
                `Unknown signer type ${config.type}. ` +
                `For read-only operations, pass signer: null to connect(). ` +
                `Valid signer types: KeyPairSigner, or a Signer instance.`
            );
    }
}

/**
 * @deprecated Will be removed in the next major release
 * 
 * Connects an account to a given network via a given provider
 */
export class Connection implements IntoConnection {
    readonly networkId: string;
    readonly provider: Provider;
    readonly signer: Signer | null;

    constructor(
        networkId: string,
        provider: Provider,
        signer: Signer | null,
    ) {
        const deprecate = depd('new Connection(networkId, provider, signer)');
        deprecate('`Connection` is no longer used anywhere, please switch to constructing `Account` without it - use `new Account(accountId, provider, signer)`');

        this.networkId = networkId;
        this.provider = provider;
        this.signer = signer;
    }

    getConnection(): Connection {
        return this;
    }

    /**
     * @param config Contains connection info details
     */
    static fromConfig(config: any): Connection {
        const provider = getProvider(config.provider);
        const signer = getSigner(config.signer);
        return new Connection(
            config.networkId,
            provider,
            signer,
        );
    }
}
