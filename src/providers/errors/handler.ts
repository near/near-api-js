import type { PublicKey } from '../../crypto/public_key.js';
import type { BlockReference, CryptoHash, EpochId, ShardId } from '../../rpc/types.gen.js';
import type { BlockHash } from '../../types/index.js';
import { RpcError } from './rpc.js';

export class HandlerError extends RpcError {}

export class AccountDoesNotExistError extends HandlerError {
    constructor(
        public readonly accountId: string,
        public readonly blockHash: BlockHash,
        public readonly blockHeight: number
    ) {
        super(`Account ${accountId} does not exist at block height ${blockHeight}`);
    }
}

export class AccessKeyDoesNotExistError extends HandlerError {
    constructor(
        public readonly publicKey: PublicKey,
        public readonly blockHash: BlockHash,
        public readonly blockHeight: number
    ) {
        super(`Access key ${publicKey.toString()} does not exist at block height ${blockHeight}`);
    }
}

export class UnknownBlockError extends HandlerError {
    constructor(public readonly blockReference?: BlockReference) {
        let metadata: string = '';

        if (typeof blockReference === 'object' && 'block_id' in blockReference) {
            metadata = `block = ${blockReference.block_id}`;
        } else if (typeof blockReference === 'object' && 'finality' in blockReference) {
            metadata = `finality = ${blockReference.finality}`;
        } else if (typeof blockReference === 'object' && 'sync_checkpoint' in blockReference) {
            metadata = `sync checkpoint = ${blockReference.sync_checkpoint}`;
        }

        super(
            `Block either has never been observed on the node or has been garbage collected ${metadata ? `(${metadata})` : ''}`.trimEnd()
        );
    }
}

export class GasKeyDoesNotExistError extends HandlerError {
    constructor(
        public readonly publicKey: PublicKey,
        public readonly blockHash: BlockHash,
        public readonly blockHeight: number
    ) {
        super(`Gas key for public key ${publicKey.toString()} does not exist at block height ${blockHeight}`);
    }
}

export class GlobalContractCodeDoesNotExistError extends HandlerError {
    constructor(
        public readonly identifier: unknown,
        public readonly blockHash: BlockHash,
        public readonly blockHeight: number
    ) {
        super(`Global contract code does not exist at block height ${blockHeight}`);
    }
}

export class GarbageCollectedBlockError extends HandlerError {
    constructor(
        public readonly blockHash: BlockHash,
        public readonly blockHeight: number
    ) {
        super(`Block ${blockHash} has been garbage collected`);
    }
}

export class InvalidShardIdError extends HandlerError {
    constructor(public readonly shardId: ShardId) {
        super(`Invalid shard id ${shardId}`);
    }
}

export class UnavailableShardError extends HandlerError {
    constructor(public readonly shardId: ShardId) {
        super(`Shard ${shardId} is unavailable`);
    }
}

export class InvalidTransactionError extends HandlerError {
    constructor() {
        super(`Invalid transaction`);
    }
}

export class UnknownTransactionError extends HandlerError {
    constructor(public readonly txHash: CryptoHash) {
        super(`Unknown transaction ${txHash}`);
    }
}

export class TransactionTimeoutError extends HandlerError {
    constructor() {
        super(`Transaction timed out`);
    }
}

export class UnknownEpochError extends HandlerError {
    constructor() {
        super(`Unknown epoch`);
    }
}

export class EpochOutOfBoundsError extends HandlerError {
    constructor(public readonly epochId: EpochId) {
        super(`Epoch ${epochId} is out of bounds`);
    }
}

export class NodeIsSyncingError extends HandlerError {
    constructor() {
        super(`Node is syncing`);
    }
}

export class NoNewBlocksError extends HandlerError {
    constructor() {
        super(`No new blocks produced`);
    }
}

export class UnknownReceiptError extends HandlerError {
    constructor(public readonly receiptId: CryptoHash) {
        super(`Unknown receipt ${receiptId}`);
    }
}

export class InternalHandlerError extends HandlerError {}

export class NotSyncedYetError extends HandlerError {
    constructor() {
        super(`Node is not synced yet`);
    }
}

export class UnknownChunkError extends HandlerError {
    constructor(public readonly chunkHash: CryptoHash) {
        super(`Unknown chunk ${chunkHash}`);
    }
}

export class DoesNotTrackShardError extends HandlerError {
    constructor() {
        super(`Node does not track this shard`);
    }
}

export class RequestRoutedError extends HandlerError {
    constructor(public readonly transactionHash: CryptoHash) {
        super(`Request was routed for transaction ${transactionHash}`);
    }
}

export class ValidatorInfoUnavailableError extends HandlerError {
    constructor() {
        super(`Validator info is unavailable`);
    }
}

export class NoSyncedBlocksError extends HandlerError {
    constructor() {
        super(`No synced blocks available`);
    }
}

export class InvalidAccountError extends HandlerError {
    constructor(
        public readonly requestedAccountId: string,
        public readonly blockHash: BlockHash,
        public readonly blockHeight: number
    ) {
        super(`Invalid account ${requestedAccountId} at block height ${blockHeight}`);
    }
}

export class TooLargeContractStateError extends HandlerError {
    constructor(
        public readonly contractAccountId: string,
        public readonly blockHash: BlockHash,
        public readonly blockHeight: number
    ) {
        super(`Contract state for ${contractAccountId} is too large at block height ${blockHeight}`);
    }
}

export class InconsistentStateError extends HandlerError {
    constructor(
        public readonly executionOutcomeShardId: ShardId,
        public readonly numberOfShards: number
    ) {
        super(`Inconsistent state: outcome shard ${executionOutcomeShardId}, number of shards ${numberOfShards}`);
    }
}

export class NotConfirmedError extends HandlerError {
    constructor(public readonly transactionOrReceiptId: CryptoHash) {
        super(`Transaction or receipt ${transactionOrReceiptId} is not confirmed`);
    }
}

export class UnknownTransactionOrReceiptError extends HandlerError {
    constructor(public readonly transactionOrReceiptId: CryptoHash) {
        super(`Unknown transaction or receipt ${transactionOrReceiptId}`);
    }
}
