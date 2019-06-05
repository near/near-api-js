import { Provider } from './providers';
export declare abstract class Signer {
    abstract signMessage(message: Uint8Array): Promise<Uint8Array>;
}
export declare class InMemorySigner {
    signMessage(message: Uint8Array): Promise<Uint8Array>;
}
export declare class Connection {
    readonly provider: Provider;
    readonly signer: Signer;
    constructor(provider: Provider, signer: Signer);
    static fromConfig(config: any): Connection;
}
