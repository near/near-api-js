import type { PublicKey } from '../../crypto/public_key.js';
import type { BlockReference } from '../../rpc/types.gen.js';
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

export class ContractCodeDoesNotExistError extends HandlerError {
    constructor(
        public readonly contractId: string,
        public readonly blockHash: BlockHash,
        public readonly blockHeight: number
    ) {
        super(`Contract code for contract ID ${contractId} does not exist at block height ${blockHeight}`);
    }
}

export class ContractMethodNotFoundError extends HandlerError {
    constructor(
        public readonly blockHash: BlockHash,
        public readonly blockHeight: number
    ) {
        super(`Contract method is not found at block height ${blockHeight}`);
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
