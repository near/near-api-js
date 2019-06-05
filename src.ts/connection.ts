'use strict';

import { Provider, JsonRpcProvider } from './providers';
import { InMemoryKeyStore } from './key_stores';
import { Signer, InMemorySigner } from './signer';
import { KeyPair } from './utils/key_pair';

function getProvider(config: any): Provider {
    switch (config.type) {
        case "JsonRpcProvider": return new JsonRpcProvider(config.args.url);
        default: throw new Error(`Unknown provider type ${config.type}`);
    }
}

function getSigner(networkId: string, config: any): Signer {
    switch (config.type) {
        case "InMemorySigner": {
            let keyStore = new InMemoryKeyStore();
            Object.keys(config.keyStore).forEach((accountId: string) => {
                let keyPair = KeyPair.fromString(config.keyStore[accountId]);
                keyStore.setKey(networkId, accountId, keyPair);
            });
            return new InMemorySigner(keyStore);
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
