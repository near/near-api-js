import { Provider, FinalTransactionResult } from './provider';
import { Network } from '../utils/network';
import { ConnectionInfo } from '../utils/web';
import { SignedTransaction } from '../protos';
export declare class JsonRpcProvider extends Provider {
    readonly connection: ConnectionInfo;
    constructor(url?: string, network?: Network);
    getNetwork(): Promise<Network>;
    sendTransaction(signedTransaction: SignedTransaction): Promise<FinalTransactionResult>;
    txStatus(txHash: Uint8Array): Promise<FinalTransactionResult>;
    query(path: string, data: string): Promise<any>;
    private sendJsonRpc;
}
