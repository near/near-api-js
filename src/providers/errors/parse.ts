import { PublicKey } from '../../crypto/public_key.js';
import type { Methods } from '../methods.js';
import {
    AccessKeyDoesNotExistError,
    AccountDoesNotExistError,
    ContractCodeDoesNotExistError,
    ContractMethodNotFoundError,
    HandlerError,
} from './handler.js';
import { RpcError } from './rpc.js';

type RawRpcError = Extract<Methods[keyof Methods]['response'], { error: object }>['error'];

type RawHandlerError = NonNullable<Extract<RawRpcError, { name: 'HANDLER_ERROR' }>['cause']>;

export function parseRpcError(error: RawRpcError): RpcError {
    switch (error.name) {
        case 'REQUEST_VALIDATION_ERROR': {
            return new RpcError();
        }
        case 'HANDLER_ERROR': {
            if (!error.cause) return new RpcError();

            return parseHandlerError(error.cause);
        }
        case 'INTERNAL_ERROR': {
            return new RpcError();
        }
    }
}

function parseHandlerError(error: RawHandlerError): HandlerError {
    switch (error.name) {
        case 'UNKNOWN_ACCOUNT': {
            return new AccountDoesNotExistError(
                error.info.requested_account_id,
                error.info.block_hash,
                error.info.block_height
            );
        }
        case 'UNKNOWN_ACCESS_KEY':
            return new AccessKeyDoesNotExistError(
                PublicKey.fromString(error.info.public_key),
                error.info.block_hash,
                error.info.block_height
            );
        case 'NO_CONTRACT_CODE':
            return new ContractCodeDoesNotExistError(
                error.info.contract_account_id,
                error.info.block_hash,
                error.info.block_height
            );

        case 'INTERNAL_ERROR':
        case 'UNKNOWN_BLOCK':
        case 'NOT_SYNCED_YET':
        case 'INVALID_SHARD_ID':
        case 'UNKNOWN_CHUNK':
        case 'DOES_NOT_TRACK_SHARD':
        case 'REQUEST_ROUTED':
        case 'INVALID_TRANSACTION':
        case 'UNKNOWN_TRANSACTION':
        case 'TIMEOUT_ERROR':
        case 'UNKNOWN_EPOCH':
        case 'VALIDATOR_INFO_UNAVAILABLE':
        case 'NO_SYNCED_BLOCKS':
        case 'UNAVAILABLE_SHARD':
        case 'GARBAGE_COLLECTED_BLOCK':
        case 'INVALID_ACCOUNT':
        case 'TOO_LARGE_CONTRACT_STATE':
        case 'UNKNOWN_GAS_KEY':
        case 'CONTRACT_EXECUTION_ERROR':
        case 'NO_GLOBAL_CONTRACT_CODE':
        case 'NODE_IS_SYNCING':
        case 'NO_NEW_BLOCKS':
        case 'EPOCH_OUT_OF_BOUNDS':
        case 'INCONSISTENT_STATE':
        case 'NOT_CONFIRMED':
        case 'UNKNOWN_TRANSACTION_OR_RECEIPT':
        case 'UNKNOWN_RECEIPT':
            return new HandlerError(error.name);
    }
}

export function parseRpcErrorMessage(errorMessage: string, blockHash: string, blockHeight: number): RpcError {
    switch (true) {
        case /^account (.*?) does not exist while viewing$/.test(errorMessage): {
            const [, accountId] = errorMessage.match(/^account (.*?) does not exist while viewing$/)!;
            if (typeof accountId !== 'string') return new RpcError(errorMessage);
            return new AccountDoesNotExistError(accountId, blockHash, blockHeight);
        }
        case /^Account (.*?) doesn't exist$/.test(errorMessage): {
            const [, accountId] = errorMessage.match(/^Account (.*?) doesn't exist$/)!;
            if (typeof accountId !== 'string') return new RpcError(errorMessage);
            return new AccountDoesNotExistError(accountId, blockHash, blockHeight);
        }
        case /^access key (.*?) does not exist while viewing$/.test(errorMessage): {
            const [, pk] = errorMessage.match(/^access key (.*?) does not exist while viewing$/)!;
            if (typeof pk !== 'string') return new RpcError(errorMessage);
            return new AccessKeyDoesNotExistError(PublicKey.fromString(pk), blockHash, blockHeight);
        }
        case /^wasm execution failed with error: FunctionCallError\(CompilationError\(CodeDoesNotExist { account_id: "(.*?)" }\)\)$/.test(
            errorMessage
        ): {
            const [, accountId] = errorMessage.match(
                /^wasm execution failed with error: FunctionCallError\(CompilationError\(CodeDoesNotExist { account_id: "(.*?)" }\)\)$/
            )!;
            if (typeof accountId !== 'string') return new RpcError(errorMessage);
            return new ContractCodeDoesNotExistError(accountId, blockHash, blockHeight);
        }
        case /^wasm execution failed with error: CompilationError\(CodeDoesNotExist { account_id: "(.*?)" }\)$/.test(
            errorMessage
        ): {
            const [, accountId] = errorMessage.match(
                /^wasm execution failed with error: CompilationError\(CodeDoesNotExist { account_id: "(.*?)" }\)$/
            )!;
            if (typeof accountId !== 'string') return new RpcError(errorMessage);
            return new ContractCodeDoesNotExistError(accountId, blockHash, blockHeight);
        }
        case /^wasm execution failed with error: FunctionCallError\(MethodResolveError\(MethodNotFound\)\)$/.test(
            errorMessage
        ): {
            return new ContractMethodNotFoundError(blockHash, blockHeight);
        }
        case /^wasm execution failed with error: MethodResolveError\(MethodNotFound\)$/.test(errorMessage): {
            return new ContractMethodNotFoundError(blockHash, blockHeight);
        }
        // case /Transaction nonce \d+ must be larger than nonce of the used access key \d+/.test(errorMessage):
        default:
            return new RpcError(errorMessage);
    }
}
