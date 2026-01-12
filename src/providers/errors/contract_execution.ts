import type { PrepareError, WasmTrap } from '../../rpc/types.gen.js';
import type { BlockHash } from '../../types/index.js';
import { HandlerError } from './handler.js';

export class ContractExecutionError extends HandlerError {
    constructor(
        message: string,
        public readonly blockHash: BlockHash,
        public readonly blockHeight: number
    ) {
        super(message);
    }
}

export class WasmTrapError extends ContractExecutionError {
    constructor(
        public readonly reason: WasmTrap,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`WASM trap during contract execution at block height ${blockHeight}`, blockHash, blockHeight);
    }
}

export class ContractCodeDoesNotExistError extends ContractExecutionError {
    constructor(
        public readonly contractId: string,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(
            `Contract code for contract ID ${contractId} does not exist at block height ${blockHeight}`,
            blockHash,
            blockHeight
        );
    }
}

export class ContractMethodNotFoundError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super(`Contract method is not found at block height ${blockHeight}`, blockHash, blockHeight);
    }
}

export class ContractMethodNameEmptyError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super(`Contract method name is empty`, blockHash, blockHeight);
    }
}

export class ContractMethodInvalidSignatureError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super(`Contract method invalid signature`, blockHash, blockHeight);
    }
}

export class PrepareWasmError extends ContractExecutionError {
    constructor(
        public readonly reason: PrepareError,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Failed to prepare WASM because of '${reason}'`, blockHash, blockHeight);
    }
}

export class HostBadUtf16Error extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super('Bad UTF-16', blockHash, blockHeight);
    }
}
export class HostBadUtf8Error extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super('Bad UTF-8', blockHash, blockHeight);
    }
}
export class HostGasExceededError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super('Gas exceeded', blockHash, blockHeight);
    }
}
export class HostGasLimitExceededError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super('Gas limit exceeded', blockHash, blockHeight);
    }
}
export class HostBalanceExceededError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super('Balance exceeded', blockHash, blockHeight);
    }
}
export class HostEmptyMethodNameError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super('Empty method name', blockHash, blockHeight);
    }
}
export class HostGuestPanicError extends ContractExecutionError {
    constructor(
        public readonly panicMessage: string,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Contract panicked: ${panicMessage}`, blockHash, blockHeight);
    }
}
export class HostIntegerOverflowError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super('Integer overflow', blockHash, blockHeight);
    }
}
export class HostInvalidPromiseIndexError extends ContractExecutionError {
    constructor(
        public readonly promiseIndex: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Invalid promise index ${promiseIndex}`, blockHash, blockHeight);
    }
}
export class HostCannotAppendActionToJointPromiseError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super('Cannot append action to joint promise', blockHash, blockHeight);
    }
}
export class HostCannotReturnJointPromiseError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super(`Cannot return joint promise`, blockHash, blockHeight);
    }
}
export class HostInvalidPromiseResultIndexError extends ContractExecutionError {
    constructor(
        public readonly resultIndex: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Invalid promise result index ${resultIndex}`, blockHash, blockHeight);
    }
}
export class HostInvalidRegisterIdError extends ContractExecutionError {
    constructor(
        public readonly registerId: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Invalid register id ${registerId}`, blockHash, blockHeight);
    }
}
export class HostIteratorWasInvalidatedError extends ContractExecutionError {
    constructor(
        public readonly iteratorIndex: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Iterator ${iteratorIndex} was invalidated`, blockHash, blockHeight);
    }
}
export class HostMemoryAccessViolationError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super(`Memory access violation`, blockHash, blockHeight);
    }
}
export class HostInvalidReceiptIndexError extends ContractExecutionError {
    constructor(
        public readonly receiptIndex: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Invalid receipt index ${receiptIndex}`, blockHash, blockHeight);
    }
}
export class HostInvalidIteratorIndexError extends ContractExecutionError {
    constructor(
        public readonly iteratorIndex: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Invalid iterator index ${iteratorIndex}`, blockHash, blockHeight);
    }
}
export class HostInvalidAccountIdError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super(`Invalid account ID`, blockHash, blockHeight);
    }
}
export class HostInvalidMethodNameError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super(`Invalid method name`, blockHash, blockHeight);
    }
}
export class HostInvalidPublicKeyError extends ContractExecutionError {
    constructor(blockHash: BlockHash, blockHeight: number) {
        super(`Invalid public key`, blockHash, blockHeight);
    }
}
export class HostProhibitedInViewError extends ContractExecutionError {
    constructor(
        public readonly methodName: string,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Method ${methodName} is prohibited in view calls`, blockHash, blockHeight);
    }
}
export class HostNumberOfLogsExceededError extends ContractExecutionError {
    constructor(
        public readonly limit: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Number of logs exceeded limit ${limit}`, blockHash, blockHeight);
    }
}
export class HostKeyLengthExceededError extends ContractExecutionError {
    constructor(
        public readonly length: number,
        public readonly limit: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Key length ${length} exceeds limit ${limit}`, blockHash, blockHeight);
    }
}
export class HostValueLengthExceededError extends ContractExecutionError {
    constructor(
        public readonly length: number,
        public readonly limit: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Value length ${length} exceeds limit ${limit}`, blockHash, blockHeight);
    }
}
export class HostTotalLogLengthExceededError extends ContractExecutionError {
    constructor(
        public readonly length: number,
        public readonly limit: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Total log length ${length} exceeds limit ${limit}`, blockHash, blockHeight);
    }
}
export class HostNumberPromisesExceededError extends ContractExecutionError {
    constructor(
        public readonly limit: number,
        public readonly numberOfPromises: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Number of promises ${numberOfPromises} exceeds limit ${limit}`, blockHash, blockHeight);
    }
}
export class HostNumberInputDataDependenciesExceededError extends ContractExecutionError {
    constructor(
        public readonly limit: number,
        public readonly numberOfInputDataDependencies: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(
            `Number of input data dependencies ${numberOfInputDataDependencies} exceeds limit ${limit}`,
            blockHash,
            blockHeight
        );
    }
}
export class HostReturnedValueLengthExceededError extends ContractExecutionError {
    constructor(
        public readonly length: number,
        public readonly limit: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Returned value length ${length} exceeds limit ${limit}`, blockHash, blockHeight);
    }
}
export class HostSizeExceededError extends ContractExecutionError {
    constructor(
        public readonly size: number,
        public readonly limit: number,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Contract size ${size} exceeds limit ${limit}`, blockHash, blockHeight);
    }
}
export class HostDeprecatedError extends ContractExecutionError {
    constructor(
        public readonly methodName: string,
        blockHash: BlockHash,
        blockHeight: number
    ) {
        super(`Method ${methodName} is deprecated`, blockHash, blockHeight);
    }
}
export class HostECRecoverError extends ContractExecutionError {
    constructor(message: string, blockHash: BlockHash, blockHeight: number) {
        super(`ECRecover error: ${message}`, blockHash, blockHeight);
    }
}
export class HostAltBn128InvalidInputError extends ContractExecutionError {
    constructor(message: string, blockHash: BlockHash, blockHeight: number) {
        super(`AltBn128 invalid input: ${message}`, blockHash, blockHeight);
    }
}
export class HostEd25519VerifyInvalidInputError extends ContractExecutionError {
    constructor(message: string, blockHash: BlockHash, blockHeight: number) {
        super(`Ed25519 verify invalid input: ${message}`, blockHash, blockHeight);
    }
}
