'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("./providers");
const signer_1 = require("./signer");
function getProvider(config) {
    switch (config.type) {
        case undefined:
            return config;
        case 'JsonRpcProvider': return new providers_1.JsonRpcProvider(config.args.url);
        default: throw new Error(`Unknown provider type ${config.type}`);
    }
}
function getSigner(config) {
    switch (config.type) {
        case undefined:
            return config;
        case 'InMemorySigner': {
            return new signer_1.InMemorySigner(config.keyStore);
        }
        default: throw new Error(`Unknown signer type ${config.type}`);
    }
}
class Connection {
    constructor(networkId, provider, signer) {
        this.networkId = networkId;
        this.provider = provider;
        this.signer = signer;
    }
    static fromConfig(config) {
        const provider = getProvider(config.provider);
        const signer = getSigner(config.signer);
        return new Connection(config.networkId, provider, signer);
    }
}
exports.Connection = Connection;
