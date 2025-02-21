import type { SignedTransaction } from '@near-js/transactions';
import type {
    BlockReference,
    BlockResult,
    ChunkId,
    ChunkResult,
    FinalExecutionOutcome,
    QueryResponseKind,
    TxExecutionStatus,
} from '@near-js/types';

interface GetTransactionParams {
    transactionHash: string;
    account: string;
    includeReceipts?: boolean;
    waitUntil?: TxExecutionStatus;
}

export interface RpcQueryProvider {
    block(block: BlockReference): Promise<BlockResult>;
    chunk(chunkId: ChunkId): Promise<ChunkResult>;
    getTransaction(params: GetTransactionParams): Promise<FinalExecutionOutcome>;
    sendTransaction(transaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    query<T extends QueryResponseKind>(...args: any[]): Promise<T>;
}
