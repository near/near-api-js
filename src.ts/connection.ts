'use strict';

import { Provider, JsonRpcProvider } from './providers';
import { Signer, InMemorySigner } from './signer';

function getProvider(config: any): Provider {
    switch (config.type) {
        case "JsonRpcProvider": return new JsonRpcProvider(config.args.url);
        default: throw new Error(`Unknown provider type ${config.type}`);
    }
}

function getSigner(networkId: string, config: any): Signer {
    switch (config.type) {
        case "InMemorySigner": {
            return new InMemorySigner(config.keyStore);
        }
        default: throw new Error(`Unknown signer type ${config.type}`);
    }
}

export class Connection {
    readonly networkId: string;
    readonly provider: Provider;
    readonly signer: Signer;

    constructor(networkId: string, provider: Provider, signer: Signer) {
        this.networkId = networkId;
        this.provider = provider;
        this.signer = signer;
    }

    static fromConfig(config: any): Connection {
        let provider = getProvider(config.provider);
        let signer = getSigner(config.networkId, config.signer);
        return new Connection(config.networkId, provider, signer);
    }
}
