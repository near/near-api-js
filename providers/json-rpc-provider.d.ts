import { Provider, FinalTransactionResult, QueryResult } from './provider';
import { Network } from '../utils/network';
import { ConnectionInfo } from '../utils/web';
export declare class JsonRpcProvider extends Provider {
    readonly connection: ConnectionInfo;
    constructor(url?: string, network?: Network);
    getNetwork(): Promise<Network>;
    sendTransaction(signedTransaction: string | Promise<string>): Promise<FinalTransactionResult>;
    query(path: string, data: string): Promise<QueryResult>;
    private sendJsonRpc;
}
