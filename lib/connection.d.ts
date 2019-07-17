import { Provider } from './providers';
import { Signer } from './signer';
export declare class Connection {
    readonly networkId: string;
    readonly provider: Provider;
    readonly signer: Signer;
    constructor(networkId: string, provider: Provider, signer: Signer);
    static fromConfig(config: any): Connection;
}
