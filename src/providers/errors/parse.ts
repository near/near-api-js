import { PublicKey } from '../../crypto/public_key.js';
import type {
    ActionError,
    ActionsValidationError,
    BlockReference,
    CryptoHash,
    FunctionCallError,
    HostError,
    InvalidAccessKeyError,
    InvalidTxError,
    ReceiptValidationError,
    TxExecutionError,
} from '../../rpc/types.gen.js';
import type { BlockHash } from '../../types/index.js';
import type { Methods } from '../methods.js';
import {
    ContractCodeDoesNotExistError,
    ContractExecutionError,
    ContractMethodInvalidSignatureError,
    ContractMethodNameEmptyError,
    ContractMethodNotFoundError,
    HostAltBn128InvalidInputError,
    HostBadUtf8Error,
    HostBadUtf16Error,
    HostBalanceExceededError,
    HostCannotAppendActionToJointPromiseError,
    HostCannotReturnJointPromiseError,
    HostDeprecatedError,
    HostECRecoverError,
    HostEd25519VerifyInvalidInputError,
    HostEmptyMethodNameError,
    HostGasExceededError,
    HostGasLimitExceededError,
    HostGuestPanicError,
    HostIntegerOverflowError,
    HostInvalidAccountIdError,
    HostInvalidIteratorIndexError,
    HostInvalidMethodNameError,
    HostInvalidPromiseIndexError,
    HostInvalidPromiseResultIndexError,
    HostInvalidPublicKeyError,
    HostInvalidReceiptIndexError,
    HostInvalidRegisterIdError,
    HostIteratorWasInvalidatedError,
    HostKeyLengthExceededError,
    HostMemoryAccessViolationError,
    HostNumberInputDataDependenciesExceededError,
    HostNumberOfLogsExceededError,
    HostNumberPromisesExceededError,
    HostProhibitedInViewError,
    HostReturnedValueLengthExceededError,
    HostSizeExceededError,
    HostTotalLogLengthExceededError,
    HostValueLengthExceededError,
    PrepareWasmError,
    WasmTrapError,
} from './contract_execution.js';
import {
    AccessKeyDoesNotExistError,
    AccountDoesNotExistError,
    DoesNotTrackShardError,
    EpochOutOfBoundsError,
    GarbageCollectedBlockError,
    GasKeyDoesNotExistError,
    GlobalContractCodeDoesNotExistError,
    HandlerError,
    InconsistentStateError,
    InternalHandlerError,
    InvalidAccountError,
    InvalidShardIdError,
    InvalidTransactionError,
    NodeIsSyncingError,
    NoNewBlocksError,
    NoSyncedBlocksError,
    NotConfirmedError,
    NotSyncedYetError,
    RequestRoutedError,
    TooLargeContractStateError,
    TransactionTimeoutError,
    UnavailableShardError,
    UnknownBlockError,
    UnknownChunkError,
    UnknownEpochError,
    UnknownReceiptError,
    UnknownTransactionError,
    UnknownTransactionOrReceiptError,
    ValidatorInfoUnavailableError,
} from './handler.js';
import { type RequestValidationError, RpcMethodNotFoundError, RpcRequestParseError } from './request_validation.js';
import { InternalRpcError, RpcError } from './rpc.js';
import {
    AccessKeyDepositWithFunctionCallError,
    AccessKeyMethodNameMismatchError,
    AccessKeyNotEnoughAllowanceError,
    AccessKeyNotFoundError,
    AccessKeyReceiverMismatchError,
    AccessKeyRequiresFullAccessError,
    AccountAlreadyExistsError,
    AccountDoesNotExistError as AccountDoesNotExistActionError,
    ActionExecutionError,
    ActorNoPermissionError,
    AddKeyAlreadyExistsError,
    AddKeyMethodNameLengthExceededError,
    AddKeyMethodNamesNumberOfBytesExceededError,
    ContractSizeExceededValidationError,
    CostOverflowError,
    CreateAccountNotAllowedError,
    CreateAccountOnlyByRegistrarError,
    DelegateActionExpiredError,
    DelegateActionInvalidNonceError,
    DelegateActionInvalidSignatureError,
    DelegateActionMustBeOnlyOneError,
    DelegateActionNonceTooLargeError,
    DelegateActionSenderDoesNotMatchTxReceiverError,
    DeleteAccountStakingError,
    DeleteAccountWithLargeStateError,
    DeleteActionMustBeFinalError,
    DeleteKeyDoesNotExistError,
    DeterministicStateInitKeyLengthExceededError,
    DeterministicStateInitValueLengthExceededError,
    FlatStorageBlockNotSupportedError,
    FunctionCallArgumentsLengthExceededError,
    FunctionCallMethodNameLengthExceededError,
    FunctionCallZeroAttachedGasError,
    GasKeyAlreadyExistsError,
    GasKeyDoesNotExistError as GasKeyDoesNotExistActionError,
    GasKeyPermissionInvalidError,
    GasKeyTooManyNoncesRequestedError,
    GlobalContractDoesNotExistError,
    InsufficientStakeError,
    IntegerOverflowValidationError,
    InvalidAccountIdValidationError,
    InvalidChainError,
    InvalidDataReceiverIdReceiptError,
    InvalidDeterministicStateInitReceiverError,
    InvalidNonceError,
    InvalidPredecessorIdReceiptError,
    InvalidReceiverIdError,
    InvalidReceiverIdReceiptError,
    InvalidRefundToReceiptError,
    InvalidSignatureError,
    InvalidSignerIdError,
    InvalidSignerIdReceiptError,
    InvalidTransactionVersionError,
    LackBalanceForStateError,
    MemTrieLoadingError,
    MissingTrieValueError,
    NonceTooLargeError,
    NotEnoughBalanceError,
    NumberInputDataDependenciesExceededReceiptError,
    OnlyImplicitAccountCreationAllowedError,
    ReceiptSizeExceededError,
    ReturnedValueLengthExceededReceiptError,
    ShardCongestedError,
    ShardStuckError,
    SignerDoesNotExistError,
    StorageInconsistentStateError,
    StorageInternalError,
    TotalNumberOfActionsExceededError,
    TotalPrepaidGasExceededError,
    TransactionExecutionError,
    TransactionExpiredError,
    TransactionSizeExceededError,
    TriesToStakeError,
    TriesToUnstakeError,
    UnexpectedTrieValueError,
    UnsuitableStakingKeyError,
    UnsupportedProtocolFeatureError,
} from './transaction_execution.js';

type RawRpcError = Extract<Methods[keyof Methods]['response'], { error: object }>['error'];

type RawHandlerError = NonNullable<Extract<RawRpcError, { name: 'HANDLER_ERROR' }>>;

export function parseRpcError(error: RawRpcError): RpcError {
    switch (error.name) {
        case 'REQUEST_VALIDATION_ERROR': {
            return parseRequestValidationError(error.cause);
        }
        case 'HANDLER_ERROR': {
            if (!error.cause) return new RpcError(`Handler error with no cause`);

            return parseHandlerError(error);
        }
        case 'INTERNAL_ERROR': {
            return new InternalRpcError(error.cause.info.error_message);
        }
        default:
            // ensures all RpcError variants are handled at compile time
            error satisfies never;
            return new RpcError(`Unknown RPC error`);
    }
}

type RawRequestValidationError = NonNullable<Extract<RawRpcError, { name: 'REQUEST_VALIDATION_ERROR' }>['cause']>;

function parseRequestValidationError(error: RawRequestValidationError): RequestValidationError {
    switch (error.name) {
        case 'METHOD_NOT_FOUND':
            return new RpcMethodNotFoundError(error.info.method_name);
        case 'PARSE_ERROR':
            return new RpcRequestParseError(error.info.error_message);
        default:
            // ensures all RequestValidationError variants are handled at compile time
            error satisfies never;
            return new RpcError('Unknown request validation error');
    }
}

function parseHandlerError(rawError: RawHandlerError): HandlerError {
    const error = rawError.cause!;

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
        case 'UNKNOWN_BLOCK':
            return new UnknownBlockError(
                'block_reference' in error.info ? (error.info.block_reference as BlockReference) : undefined
            );
        case 'UNKNOWN_GAS_KEY':
            return new GasKeyDoesNotExistError(
                PublicKey.fromString(error.info.public_key),
                error.info.block_hash,
                error.info.block_height
            );

        case 'CONTRACT_EXECUTION_ERROR':
            return parseFunctionCallError(
                'error' in error.info ? error.info.error : error.info.vm_error,
                error.info.block_hash,
                error.info.block_height
            );

        case 'NO_GLOBAL_CONTRACT_CODE':
            return new GlobalContractCodeDoesNotExistError(
                error.info.identifier,
                error.info.block_hash,
                error.info.block_height
            );

        case 'GARBAGE_COLLECTED_BLOCK':
            return new GarbageCollectedBlockError(error.info.block_hash, error.info.block_height);

        case 'INVALID_SHARD_ID':
            return new InvalidShardIdError(error.info.shard_id);

        case 'UNAVAILABLE_SHARD':
            return new UnavailableShardError(
                'requested_shard_id' in error.info ? error.info.requested_shard_id : error.info.shard_id
            );

        case 'INVALID_TRANSACTION':
            if (
                'data' in rawError &&
                typeof rawError.data === 'object' &&
                rawError.data !== null &&
                'TxExecutionError' in rawError.data &&
                typeof rawError.data.TxExecutionError === 'object' &&
                rawError.data.TxExecutionError !== null
            ) {
                return parseTransactionExecutionError(rawError.data.TxExecutionError as TxExecutionError, '', '');
            }

            return new InvalidTransactionError();

        case 'UNKNOWN_TRANSACTION':
            return new UnknownTransactionError(error.info.requested_transaction_hash);

        case 'TIMEOUT_ERROR':
            return new TransactionTimeoutError();

        case 'UNKNOWN_EPOCH':
            return new UnknownEpochError();

        case 'EPOCH_OUT_OF_BOUNDS':
            return new EpochOutOfBoundsError(error.info.epoch_id);

        case 'NODE_IS_SYNCING':
            return new NodeIsSyncingError();

        case 'NO_NEW_BLOCKS':
            return new NoNewBlocksError();

        case 'UNKNOWN_RECEIPT':
            return new UnknownReceiptError(error.info.receipt_id);

        case 'INTERNAL_ERROR':
            return new InternalHandlerError(
                'error_message' in error.info ? error.info.error_message : error.info.debug_info
            );

        case 'NOT_SYNCED_YET':
            return new NotSyncedYetError();

        case 'UNKNOWN_CHUNK':
            return new UnknownChunkError(error.info.chunk_hash);

        case 'DOES_NOT_TRACK_SHARD':
            return new DoesNotTrackShardError();

        case 'REQUEST_ROUTED':
            return new RequestRoutedError(error.info.transaction_hash);

        case 'VALIDATOR_INFO_UNAVAILABLE':
            return new ValidatorInfoUnavailableError();

        case 'NO_SYNCED_BLOCKS':
            return new NoSyncedBlocksError();

        case 'INVALID_ACCOUNT':
            return new InvalidAccountError(
                error.info.requested_account_id,
                error.info.block_hash,
                error.info.block_height
            );

        case 'TOO_LARGE_CONTRACT_STATE':
            return new TooLargeContractStateError(
                error.info.contract_account_id,
                error.info.block_hash,
                error.info.block_height
            );

        case 'INCONSISTENT_STATE':
            return new InconsistentStateError(error.info.execution_outcome_shard_id, error.info.number_or_shards);

        case 'NOT_CONFIRMED':
            return new NotConfirmedError(error.info.transaction_or_receipt_id);

        case 'UNKNOWN_TRANSACTION_OR_RECEIPT':
            return new UnknownTransactionOrReceiptError(error.info.transaction_or_receipt_id);

        default:
            // ensures all HandlerError variants are handled at compile time
            error satisfies never;
            return new HandlerError('Unknown handler error');
    }
}

function parseFunctionCallError(
    error: FunctionCallError,
    blockHash: BlockHash,
    blockHeight: number
): ContractExecutionError {
    if (error === 'WasmUnknownError') return new ContractExecutionError('Unknown WASM error', blockHash, blockHeight);
    // unsused
    if (error === '_EVMError') return new ContractExecutionError(error, blockHash, blockHeight);

    if ('CompilationError' in error) {
        if ('CodeDoesNotExist' in error.CompilationError)
            return new ContractCodeDoesNotExistError(
                error.CompilationError.CodeDoesNotExist.account_id,
                blockHash,
                blockHeight
            );

        if ('WasmerCompileError' in error.CompilationError)
            return new ContractExecutionError(error.CompilationError.WasmerCompileError.msg, blockHash, blockHeight);

        if ('PrepareError' in error.CompilationError)
            return new PrepareWasmError(error.CompilationError.PrepareError, blockHash, blockHeight);

        // ensures all CompilationError variants are handled at compile time
        error.CompilationError satisfies never;
        throw new ContractExecutionError('Unknown compilation error', blockHash, blockHeight);
    }

    if ('MethodResolveError' in error) {
        switch (error.MethodResolveError) {
            case 'MethodEmptyName':
                return new ContractMethodNameEmptyError(blockHash, blockHeight);
            case 'MethodNotFound':
                return new ContractMethodNotFoundError(blockHash, blockHeight);
            case 'MethodInvalidSignature':
                return new ContractMethodInvalidSignatureError(blockHash, blockHeight);
            default:
                // ensures all MethodResolveError variants are handled at compile time
                error.MethodResolveError satisfies never;
                return new ContractExecutionError('Unknown method resolve error', blockHash, blockHeight);
        }
    }

    if ('HostError' in error) return parseHostError(error.HostError, blockHash, blockHeight);

    if ('LinkError' in error) return new ContractExecutionError(error.LinkError.msg, blockHash, blockHeight);

    if ('WasmTrap' in error) return new WasmTrapError(error.WasmTrap, blockHash, blockHeight);

    if ('ExecutionError' in error) return new ContractExecutionError(error.ExecutionError, blockHash, blockHeight);

    // ensures all ContractExecutionError variants are handled at compile time
    error satisfies never;
    return new ContractExecutionError('Unknown contract execution error', blockHash, blockHeight);
}

function parseHostError(error: HostError, blockHash: BlockHash, blockHeight: number): ContractExecutionError {
    if (typeof error === 'string') {
        switch (error) {
            case 'BadUTF16':
                return new HostBadUtf16Error(blockHash, blockHeight);
            case 'BadUTF8':
                return new HostBadUtf8Error(blockHash, blockHeight);
            case 'GasExceeded':
                return new HostGasExceededError(blockHash, blockHeight);
            case 'GasLimitExceeded':
                return new HostGasLimitExceededError(blockHash, blockHeight);
            case 'BalanceExceeded':
                return new HostBalanceExceededError(blockHash, blockHeight);
            case 'EmptyMethodName':
                return new HostEmptyMethodNameError(blockHash, blockHeight);
            case 'IntegerOverflow':
                return new HostIntegerOverflowError(blockHash, blockHeight);
            case 'CannotAppendActionToJointPromise':
                return new HostCannotAppendActionToJointPromiseError(blockHash, blockHeight);
            case 'CannotReturnJointPromise':
                return new HostCannotReturnJointPromiseError(blockHash, blockHeight);
            case 'MemoryAccessViolation':
                return new HostMemoryAccessViolationError(blockHash, blockHeight);
            case 'InvalidAccountId':
                return new HostInvalidAccountIdError(blockHash, blockHeight);
            case 'InvalidMethodName':
                return new HostInvalidMethodNameError(blockHash, blockHeight);
            case 'InvalidPublicKey':
                return new HostInvalidPublicKeyError(blockHash, blockHeight);
        }
    }

    if ('GuestPanic' in error) {
        return new HostGuestPanicError(error.GuestPanic.panic_msg, blockHash, blockHeight);
    }

    if ('InvalidPromiseIndex' in error) {
        return new HostInvalidPromiseIndexError(error.InvalidPromiseIndex.promise_idx, blockHash, blockHeight);
    }

    if ('InvalidPromiseResultIndex' in error) {
        return new HostInvalidPromiseResultIndexError(
            error.InvalidPromiseResultIndex.result_idx,
            blockHash,
            blockHeight
        );
    }

    if ('InvalidRegisterId' in error) {
        return new HostInvalidRegisterIdError(error.InvalidRegisterId.register_id, blockHash, blockHeight);
    }

    if ('IteratorWasInvalidated' in error) {
        return new HostIteratorWasInvalidatedError(error.IteratorWasInvalidated.iterator_index, blockHash, blockHeight);
    }

    if ('InvalidReceiptIndex' in error) {
        return new HostInvalidReceiptIndexError(error.InvalidReceiptIndex.receipt_index, blockHash, blockHeight);
    }

    if ('InvalidIteratorIndex' in error) {
        return new HostInvalidIteratorIndexError(error.InvalidIteratorIndex.iterator_index, blockHash, blockHeight);
    }

    if ('ProhibitedInView' in error) {
        return new HostProhibitedInViewError(error.ProhibitedInView.method_name, blockHash, blockHeight);
    }

    if ('NumberOfLogsExceeded' in error) {
        return new HostNumberOfLogsExceededError(error.NumberOfLogsExceeded.limit, blockHash, blockHeight);
    }

    if ('KeyLengthExceeded' in error) {
        return new HostKeyLengthExceededError(
            error.KeyLengthExceeded.length,
            error.KeyLengthExceeded.limit,
            blockHash,
            blockHeight
        );
    }

    if ('ValueLengthExceeded' in error) {
        return new HostValueLengthExceededError(
            error.ValueLengthExceeded.length,
            error.ValueLengthExceeded.limit,
            blockHash,
            blockHeight
        );
    }

    if ('TotalLogLengthExceeded' in error) {
        return new HostTotalLogLengthExceededError(
            error.TotalLogLengthExceeded.length,
            error.TotalLogLengthExceeded.limit,
            blockHash,
            blockHeight
        );
    }

    if ('NumberPromisesExceeded' in error) {
        return new HostNumberPromisesExceededError(
            error.NumberPromisesExceeded.limit,
            error.NumberPromisesExceeded.number_of_promises,
            blockHash,
            blockHeight
        );
    }

    if ('NumberInputDataDependenciesExceeded' in error) {
        return new HostNumberInputDataDependenciesExceededError(
            error.NumberInputDataDependenciesExceeded.limit,
            error.NumberInputDataDependenciesExceeded.number_of_input_data_dependencies,
            blockHash,
            blockHeight
        );
    }

    if ('ReturnedValueLengthExceeded' in error) {
        return new HostReturnedValueLengthExceededError(
            error.ReturnedValueLengthExceeded.length,
            error.ReturnedValueLengthExceeded.limit,
            blockHash,
            blockHeight
        );
    }

    if ('ContractSizeExceeded' in error) {
        return new HostSizeExceededError(
            error.ContractSizeExceeded.size,
            error.ContractSizeExceeded.limit,
            blockHash,
            blockHeight
        );
    }

    if ('Deprecated' in error) {
        return new HostDeprecatedError(error.Deprecated.method_name, blockHash, blockHeight);
    }

    if ('ECRecoverError' in error) {
        return new HostECRecoverError(error.ECRecoverError.msg, blockHash, blockHeight);
    }

    if ('AltBn128InvalidInput' in error) {
        return new HostAltBn128InvalidInputError(error.AltBn128InvalidInput.msg, blockHash, blockHeight);
    }

    if ('Ed25519VerifyInvalidInput' in error) {
        return new HostEd25519VerifyInvalidInputError(error.Ed25519VerifyInvalidInput.msg, blockHash, blockHeight);
    }

    // ensures all HostError variants are handled at compile time
    error satisfies never;
    return new ContractExecutionError('Unknown host error', blockHash, blockHeight);
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

export function parseTransactionExecutionError(
    error: TxExecutionError,
    txHash: CryptoHash,
    blockHash: BlockHash
): RpcError {
    if ('ActionError' in error) return parseActionError(error.ActionError, txHash, blockHash);
    if ('InvalidTxError' in error) return parseInvalidTransactionError(error.InvalidTxError, txHash, blockHash);

    // ensures all TxExecutionError variants are handled at compile time
    error satisfies never;
    return new TransactionExecutionError('Unknown transaction execution error', txHash, blockHash);
}

function parseActionError(
    error: ActionError,
    txHash: CryptoHash,
    blockHash: BlockHash
): ActionExecutionError | ContractExecutionError {
    const actionIndex = typeof error.index === 'number' ? error.index : null;

    if (typeof error.kind === 'string') {
        switch (error.kind) {
            case 'DelegateActionInvalidSignature':
                return new DelegateActionInvalidSignatureError(actionIndex, txHash, blockHash);
            case 'DelegateActionExpired':
                return new DelegateActionExpiredError(actionIndex, txHash, blockHash);
            default:
                // ensures all string ActionErrorKind variants are handled at compile time
                error.kind satisfies never;
                return new ActionExecutionError('Unknown action error', actionIndex, txHash, blockHash);
        }
    }

    if ('AccountAlreadyExists' in error.kind) {
        return new AccountAlreadyExistsError(
            error.kind.AccountAlreadyExists.account_id,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('AccountDoesNotExist' in error.kind) {
        return new AccountDoesNotExistActionError(
            error.kind.AccountDoesNotExist.account_id,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('ActorNoPermission' in error.kind) {
        return new ActorNoPermissionError(
            error.kind.ActorNoPermission.account_id,
            error.kind.ActorNoPermission.actor_id,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('AddKeyAlreadyExists' in error.kind) {
        return new AddKeyAlreadyExistsError(
            error.kind.AddKeyAlreadyExists.account_id,
            PublicKey.fromString(error.kind.AddKeyAlreadyExists.public_key),
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('DeleteKeyDoesNotExist' in error.kind) {
        return new DeleteKeyDoesNotExistError(
            error.kind.DeleteKeyDoesNotExist.account_id,
            PublicKey.from(error.kind.DeleteKeyDoesNotExist.public_key),
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('DeleteAccountStaking' in error.kind) {
        return new DeleteAccountStakingError(
            error.kind.DeleteAccountStaking.account_id,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('LackBalanceForState' in error.kind) {
        return new LackBalanceForStateError(
            error.kind.LackBalanceForState.account_id,
            BigInt(error.kind.LackBalanceForState.amount),
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('TriesToUnstake' in error.kind) {
        return new TriesToUnstakeError(error.kind.TriesToUnstake.account_id, actionIndex, txHash, blockHash);
    }

    if ('TriesToStake' in error.kind) {
        return new TriesToStakeError(
            error.kind.TriesToStake.account_id,
            BigInt(error.kind.TriesToStake.balance),
            BigInt(error.kind.TriesToStake.locked),
            BigInt(error.kind.TriesToStake.stake),
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('InsufficientStake' in error.kind) {
        return new InsufficientStakeError(
            error.kind.InsufficientStake.account_id,
            BigInt(error.kind.InsufficientStake.minimum_stake),
            BigInt(error.kind.InsufficientStake.stake),
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('OnlyImplicitAccountCreationAllowed' in error.kind) {
        return new OnlyImplicitAccountCreationAllowedError(
            error.kind.OnlyImplicitAccountCreationAllowed.account_id,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('DeleteAccountWithLargeState' in error.kind) {
        return new DeleteAccountWithLargeStateError(
            error.kind.DeleteAccountWithLargeState.account_id,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('DelegateActionInvalidNonce' in error.kind) {
        return new DelegateActionInvalidNonceError(
            error.kind.DelegateActionInvalidNonce.ak_nonce,
            error.kind.DelegateActionInvalidNonce.delegate_nonce,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('DelegateActionNonceTooLarge' in error.kind) {
        return new DelegateActionNonceTooLargeError(
            error.kind.DelegateActionNonceTooLarge.delegate_nonce,
            error.kind.DelegateActionNonceTooLarge.upper_bound,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('GasKeyDoesNotExist' in error.kind) {
        return new GasKeyDoesNotExistActionError(
            error.kind.GasKeyDoesNotExist.account_id,
            PublicKey.fromString(error.kind.GasKeyDoesNotExist.public_key),
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('GasKeyAlreadyExists' in error.kind) {
        return new GasKeyAlreadyExistsError(
            error.kind.GasKeyAlreadyExists.account_id,
            PublicKey.fromString(error.kind.GasKeyAlreadyExists.public_key),
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('GlobalContractDoesNotExist' in error.kind) {
        return new GlobalContractDoesNotExistError(
            error.kind.GlobalContractDoesNotExist.identifier,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('FunctionCallError' in error.kind) {
        return parseFunctionCallError(
            error.kind.FunctionCallError,
            blockHash,
            -1 // blockHeight is unknown here
        );
    }

    if ('NewReceiptValidationError' in error.kind) {
        return parseReceiptValidationError(error.kind.NewReceiptValidationError, actionIndex, txHash, blockHash);
    }

    if ('CreateAccountOnlyByRegistrar' in error.kind) {
        return new CreateAccountOnlyByRegistrarError(
            error.kind.CreateAccountOnlyByRegistrar.account_id,
            error.kind.CreateAccountOnlyByRegistrar.predecessor_id,
            error.kind.CreateAccountOnlyByRegistrar.registrar_account_id,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('CreateAccountNotAllowed' in error.kind) {
        return new CreateAccountNotAllowedError(
            error.kind.CreateAccountNotAllowed.account_id,
            error.kind.CreateAccountNotAllowed.predecessor_id,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('DelegateActionSenderDoesNotMatchTxReceiver' in error.kind) {
        return new DelegateActionSenderDoesNotMatchTxReceiverError(
            error.kind.DelegateActionSenderDoesNotMatchTxReceiver.receiver_id,
            error.kind.DelegateActionSenderDoesNotMatchTxReceiver.sender_id,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('DelegateActionAccessKeyError' in error.kind) {
        return parseInvalidAccessKeyError(error.kind.DelegateActionAccessKeyError, actionIndex, txHash, blockHash);
    }

    // ensures all ActionErrorKind variants are handled at compile time
    error.kind satisfies never;
    return new ActionExecutionError('Unknown action error', actionIndex, txHash, blockHash);
}

function parseReceiptValidationError(
    error: ReceiptValidationError,
    actionIndex: number | null,
    txHash: CryptoHash,
    blockHash: BlockHash
): ActionExecutionError {
    if ('InvalidPredecessorId' in error) {
        return new InvalidPredecessorIdReceiptError(
            error.InvalidPredecessorId.account_id,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('InvalidReceiverId' in error) {
        return new InvalidReceiverIdReceiptError(error.InvalidReceiverId.account_id, actionIndex, txHash, blockHash);
    }

    if ('InvalidSignerId' in error) {
        return new InvalidSignerIdReceiptError(error.InvalidSignerId.account_id, actionIndex, txHash, blockHash);
    }

    if ('InvalidDataReceiverId' in error) {
        return new InvalidDataReceiverIdReceiptError(
            error.InvalidDataReceiverId.account_id,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('ReturnedValueLengthExceeded' in error) {
        return new ReturnedValueLengthExceededReceiptError(
            error.ReturnedValueLengthExceeded.length,
            error.ReturnedValueLengthExceeded.limit,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('NumberInputDataDependenciesExceeded' in error) {
        return new NumberInputDataDependenciesExceededReceiptError(
            error.NumberInputDataDependenciesExceeded.limit,
            error.NumberInputDataDependenciesExceeded.number_of_input_data_dependencies,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('ActionsValidation' in error) {
        error.ActionsValidation;
        return parseActionsValidationError(error.ActionsValidation, actionIndex, txHash, blockHash);
    }

    if ('ReceiptSizeExceeded' in error) {
        return new ReceiptSizeExceededError(
            error.ReceiptSizeExceeded.limit,
            error.ReceiptSizeExceeded.size,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('InvalidRefundTo' in error) {
        return new InvalidRefundToReceiptError(error.InvalidRefundTo.account_id, actionIndex, txHash, blockHash);
    }

    // ensures all ReceiptValidationError variants are handled at compile time
    error satisfies never;
    return new ActionExecutionError('Unknown receipt validation error', actionIndex, txHash, blockHash);
}

function parseActionsValidationError(
    error: ActionsValidationError,
    actionIndex: number | null,
    txHash: CryptoHash,
    blockHash: BlockHash
): ActionExecutionError {
    if (typeof error === 'string') {
        switch (error) {
            case 'DeleteActionMustBeFinal':
                return new DeleteActionMustBeFinalError(actionIndex, txHash, blockHash);
            case 'IntegerOverflow':
                return new IntegerOverflowValidationError(actionIndex, txHash, blockHash);
            case 'FunctionCallZeroAttachedGas':
                return new FunctionCallZeroAttachedGasError(actionIndex, txHash, blockHash);
            case 'DelegateActionMustBeOnlyOne':
                return new DelegateActionMustBeOnlyOneError(actionIndex, txHash, blockHash);
            default:
                // ensures all string ActionsValidationError variants are handled at compile time
                error satisfies never;
                return new ActionExecutionError('Unknown actions validation error', actionIndex, txHash, blockHash);
        }
    }

    if ('TotalPrepaidGasExceeded' in error) {
        return new TotalPrepaidGasExceededError(
            error.TotalPrepaidGasExceeded.limit,
            error.TotalPrepaidGasExceeded.total_prepaid_gas,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('TotalNumberOfActionsExceeded' in error) {
        return new TotalNumberOfActionsExceededError(
            error.TotalNumberOfActionsExceeded.limit,
            error.TotalNumberOfActionsExceeded.total_number_of_actions,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('AddKeyMethodNamesNumberOfBytesExceeded' in error) {
        return new AddKeyMethodNamesNumberOfBytesExceededError(
            error.AddKeyMethodNamesNumberOfBytesExceeded.limit,
            error.AddKeyMethodNamesNumberOfBytesExceeded.total_number_of_bytes,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('AddKeyMethodNameLengthExceeded' in error) {
        return new AddKeyMethodNameLengthExceededError(
            error.AddKeyMethodNameLengthExceeded.length,
            error.AddKeyMethodNameLengthExceeded.limit,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('InvalidAccountId' in error) {
        return new InvalidAccountIdValidationError(error.InvalidAccountId.account_id, actionIndex, txHash, blockHash);
    }

    if ('ContractSizeExceeded' in error) {
        return new ContractSizeExceededValidationError(
            error.ContractSizeExceeded.limit,
            error.ContractSizeExceeded.size,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('FunctionCallMethodNameLengthExceeded' in error) {
        return new FunctionCallMethodNameLengthExceededError(
            error.FunctionCallMethodNameLengthExceeded.length,
            error.FunctionCallMethodNameLengthExceeded.limit,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('FunctionCallArgumentsLengthExceeded' in error) {
        return new FunctionCallArgumentsLengthExceededError(
            error.FunctionCallArgumentsLengthExceeded.length,
            error.FunctionCallArgumentsLengthExceeded.limit,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('UnsuitableStakingKey' in error) {
        return new UnsuitableStakingKeyError(
            PublicKey.fromString(error.UnsuitableStakingKey.public_key),
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('UnsupportedProtocolFeature' in error) {
        return new UnsupportedProtocolFeatureError(
            error.UnsupportedProtocolFeature.protocol_feature,
            error.UnsupportedProtocolFeature.version,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('InvalidDeterministicStateInitReceiver' in error) {
        return new InvalidDeterministicStateInitReceiverError(
            error.InvalidDeterministicStateInitReceiver.derived_id,
            error.InvalidDeterministicStateInitReceiver.receiver_id,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('DeterministicStateInitKeyLengthExceeded' in error) {
        return new DeterministicStateInitKeyLengthExceededError(
            error.DeterministicStateInitKeyLengthExceeded.length,
            error.DeterministicStateInitKeyLengthExceeded.limit,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('DeterministicStateInitValueLengthExceeded' in error) {
        return new DeterministicStateInitValueLengthExceededError(
            error.DeterministicStateInitValueLengthExceeded.length,
            error.DeterministicStateInitValueLengthExceeded.limit,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('GasKeyPermissionInvalid' in error) {
        return new GasKeyPermissionInvalidError(
            error.GasKeyPermissionInvalid.permission,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('GasKeyTooManyNoncesRequested' in error) {
        return new GasKeyTooManyNoncesRequestedError(
            error.GasKeyTooManyNoncesRequested.limit,
            error.GasKeyTooManyNoncesRequested.requested_nonces,
            actionIndex,
            txHash,
            blockHash
        );
    }

    // ensures all ActionsValidationError variants are handled at compile time
    error satisfies never;
    return new ActionExecutionError('Unknown actions validation error', actionIndex, txHash, blockHash);
}

function parseInvalidAccessKeyError(
    error: InvalidAccessKeyError,
    actionIndex: number | null,
    txHash: CryptoHash,
    blockHash: BlockHash
): ActionExecutionError {
    if (typeof error === 'string') {
        switch (error) {
            case 'RequiresFullAccess':
                return new AccessKeyRequiresFullAccessError(actionIndex, txHash, blockHash);
            case 'DepositWithFunctionCall':
                return new AccessKeyDepositWithFunctionCallError(actionIndex, txHash, blockHash);
            default:
                // ensures all string InvalidAccessKeyError variants are handled at compile time
                error satisfies never;
                return new ActionExecutionError('Unknown invalid access key error', actionIndex, txHash, blockHash);
        }
    }

    if ('AccessKeyNotFound' in error) {
        return new AccessKeyNotFoundError(
            error.AccessKeyNotFound.account_id,
            PublicKey.fromString(error.AccessKeyNotFound.public_key),
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('ReceiverMismatch' in error) {
        return new AccessKeyReceiverMismatchError(
            error.ReceiverMismatch.ak_receiver,
            error.ReceiverMismatch.tx_receiver,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('MethodNameMismatch' in error) {
        return new AccessKeyMethodNameMismatchError(
            error.MethodNameMismatch.method_name,
            actionIndex,
            txHash,
            blockHash
        );
    }

    if ('NotEnoughAllowance' in error) {
        return new AccessKeyNotEnoughAllowanceError(
            error.NotEnoughAllowance.account_id,
            BigInt(error.NotEnoughAllowance.allowance),
            BigInt(error.NotEnoughAllowance.cost),
            PublicKey.fromString(error.NotEnoughAllowance.public_key),
            actionIndex,
            txHash,
            blockHash
        );
    }

    // ensures all InvalidAccessKeyError variants are handled at compile time
    error satisfies never;
    return new ActionExecutionError('Unknown invalid access key error', actionIndex, txHash, blockHash);
}

function parseInvalidTransactionError(
    error: InvalidTxError,
    txHash: CryptoHash,
    blockHash: BlockHash
): TransactionExecutionError {
    if (typeof error === 'string') {
        switch (error) {
            case 'InvalidSignature':
                return new InvalidSignatureError(txHash, blockHash);
            case 'CostOverflow':
                return new CostOverflowError(txHash, blockHash);
            case 'InvalidChain':
                return new InvalidChainError(txHash, blockHash);
            case 'Expired':
                return new TransactionExpiredError(txHash, blockHash);
            case 'InvalidTransactionVersion':
                return new InvalidTransactionVersionError(txHash, blockHash);
            default:
                // ensures all string InvalidError variants are handled at compile time
                error satisfies never;
                return new TransactionExecutionError('Unknown invalid transaction error', txHash, blockHash);
        }
    }

    if ('InvalidAccessKeyError' in error) {
        return parseInvalidAccessKeyError(error.InvalidAccessKeyError, null, txHash, blockHash);
    }

    if ('InvalidSignerId' in error) {
        return new InvalidSignerIdError(error.InvalidSignerId.signer_id, txHash, blockHash);
    }

    if ('SignerDoesNotExist' in error) {
        return new SignerDoesNotExistError(error.SignerDoesNotExist.signer_id, txHash, blockHash);
    }

    if ('InvalidNonce' in error) {
        return new InvalidNonceError(error.InvalidNonce.ak_nonce, error.InvalidNonce.tx_nonce, txHash, blockHash);
    }

    if ('NonceTooLarge' in error) {
        return new NonceTooLargeError(error.NonceTooLarge.tx_nonce, error.NonceTooLarge.upper_bound, txHash, blockHash);
    }

    if ('InvalidReceiverId' in error) {
        return new InvalidReceiverIdError(error.InvalidReceiverId.receiver_id, txHash, blockHash);
    }

    if ('NotEnoughBalance' in error) {
        return new NotEnoughBalanceError(
            BigInt(error.NotEnoughBalance.balance),
            BigInt(error.NotEnoughBalance.cost),
            error.NotEnoughBalance.signer_id,
            txHash,
            blockHash
        );
    }

    if ('LackBalanceForState' in error) {
        return new LackBalanceForStateError(
            error.LackBalanceForState.signer_id,
            BigInt(error.LackBalanceForState.amount),
            null,
            txHash,
            blockHash
        );
    }

    if ('TransactionSizeExceeded' in error) {
        return new TransactionSizeExceededError(
            error.TransactionSizeExceeded.limit,
            error.TransactionSizeExceeded.size,
            txHash,
            blockHash
        );
    }

    if ('StorageError' in error) {
        const storage = error.StorageError;

        if (storage === 'StorageInternalError') {
            return new StorageInternalError(txHash, blockHash);
        }

        if (storage === 'UnexpectedTrieValue') {
            return new UnexpectedTrieValueError(txHash, blockHash);
        }

        if ('MissingTrieValue' in storage) {
            return new MissingTrieValueError(
                storage.MissingTrieValue.context,
                storage.MissingTrieValue.hash,
                txHash,
                blockHash
            );
        }

        if ('StorageInconsistentState' in storage) {
            return new StorageInconsistentStateError(storage.StorageInconsistentState, txHash, blockHash);
        }

        if ('FlatStorageBlockNotSupported' in storage) {
            return new FlatStorageBlockNotSupportedError(storage.FlatStorageBlockNotSupported, txHash, blockHash);
        }

        if ('MemTrieLoadingError' in storage) {
            return new MemTrieLoadingError(storage.MemTrieLoadingError, txHash, blockHash);
        }

        // ensures all StorageError variants are handled at compile time
        storage satisfies never;
        return new TransactionExecutionError('Unknown storage error', txHash, blockHash);
    }

    if ('ShardCongested' in error) {
        return new ShardCongestedError(
            error.ShardCongested.congestion_level,
            error.ShardCongested.shard_id,
            txHash,
            blockHash
        );
    }

    if ('ShardStuck' in error) {
        return new ShardStuckError(error.ShardStuck.missed_chunks, error.ShardStuck.shard_id, txHash, blockHash);
    }

    if ('ActionsValidation' in error) {
        return parseActionsValidationError(error.ActionsValidation, null, txHash, blockHash);
    }

    // ensures all InvalidTxError variants are handled at compile time
    error satisfies never;
    return new TransactionExecutionError('Unknown invalid transaction error', txHash, blockHash);
}
