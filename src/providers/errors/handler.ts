import type { PublicKey } from '../../crypto/public_key.js';
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
