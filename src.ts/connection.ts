'use strict';

import { Provider, JsonRpcProvider } from './providers';

export abstract class Signer {
    abstract async signMessage(message: Uint8Array): Promise<Uint8Array>;
}

export class InMemorySigner {
    async signMessage(message: Uint8Array): Promise<Uint8Array> {
        return message;
    }
}

function getProvider(config: any): Provider {
    return new JsonRpcProvider(config.nodeUrl);
}

function getSigner(config: any): Signer {
    return new InMemorySigner();
}

export class Connection {
    readonly provider: Provider;
    readonly signer: Signer;

    constructor(provider: Provider, signer: Signer) {
        this.provider = provider;
        this.signer = signer;
    }

    static fromConfig(config: any): Connection {
        let provider = getProvider(config);
        let signer = getSigner(config);
        return new Connection(provider, signer);
    }
}
