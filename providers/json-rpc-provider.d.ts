import { Provider, FinalTransactionResult, QueryResult } from './provider';
import { Network } from '../utils/network';
import { ConnectionInfo } from '../utils/web';
import { SignedTransaction } from '../protos/signed_transaction_pb';
export declare class JsonRpcProvider extends Provider {
    readonly connection: ConnectionInfo;
    constructor(url?: string, network?: Network);
    getNetwork(): Promise<Network>;
    sendTransaction(signedTransaction: SignedTransaction): Promise<FinalTransactionResult>;
    query(path: string, data: string): Promise<QueryResult>;
    private sendJsonRpc;
}
