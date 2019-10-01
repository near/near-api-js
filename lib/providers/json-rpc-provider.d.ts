import { Provider, FinalExecutionOutcome, NodeStatusResult, BlockResult } from './provider';
import { Network } from '../utils/network';
import { ConnectionInfo } from '../utils/web';
import { SignedTransaction } from '../transaction';
export declare class JsonRpcProvider extends Provider {
    readonly connection: ConnectionInfo;
    constructor(url?: string, network?: Network);
    getNetwork(): Promise<Network>;
    status(): Promise<NodeStatusResult>;
    sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    txStatus(txHash: Uint8Array): Promise<FinalExecutionOutcome>;
    query(path: string, data: string): Promise<any>;
    block(height: number): Promise<BlockResult>;
    private sendJsonRpc;
}
