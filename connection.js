'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("./providers");
class Signer {
}
exports.Signer = Signer;
class InMemorySigner {
    async signMessage(message) {
        return message;
    }
}
exports.InMemorySigner = InMemorySigner;
function getProvider(config) {
    return new providers_1.JsonRpcProvider(config.nodeUrl);
}
function getSigner(config) {
    return new InMemorySigner();
}
class Connection {
    constructor(provider, signer) {
        this.provider = provider;
        this.signer = signer;
    }
    static fromConfig(config) {
        let provider = getProvider(config);
        let signer = getSigner(config);
        return new Connection(provider, signer);
    }
}
exports.Connection = Connection;
