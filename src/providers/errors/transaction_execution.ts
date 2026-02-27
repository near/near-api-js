import type { PublicKey } from '../../crypto/public_key.js';
import type {
    AccessKeyPermission,
    CryptoHash,
    GlobalContractIdentifier,
    MissingTrieValueContext,
} from '../../rpc/types.gen.js';
import type { BlockHash } from '../../types/index.js';
import { RpcError } from './rpc.js';

export class TransactionExecutionError extends RpcError {
    constructor(
        message: string,
        public readonly txHash: CryptoHash,
        public readonly blockHash: BlockHash
    ) {
        super(message);
    }
}

export class ActionExecutionError extends TransactionExecutionError {
    constructor(
        message: string,
        public readonly actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(message, txHash, blockHash);
    }
}

export class AccountAlreadyExistsActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Account ${accountId} already exists`, actionIndex, txHash, blockHash);
    }
}

export class AccountDoesNotExistActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Account ${accountId} does not exist`, actionIndex, txHash, blockHash);
    }
}

export class ActorNoPermissionActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        public readonly actorId: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Actor ${actorId} has no permission on account ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class AddKeyAlreadyExistsActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        public readonly publicKey: PublicKey,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Public key ${publicKey} already exists on account ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class DeleteKeyDoesNotExistActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        public readonly publicKey: PublicKey,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Public key ${publicKey} does not exist on account ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class DeleteAccountStakingActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Account ${accountId} cannot be deleted because it is staking`, actionIndex, txHash, blockHash);
    }
}

export class LackBalanceForStateActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        public readonly amount: bigint,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(
            `Account ${accountId} lacks balance ${amount.toString()} yoctoNear for state`,
            actionIndex,
            txHash,
            blockHash
        );
    }
}

export class TriesToUnstakeActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Account ${accountId} tries to unstake`, actionIndex, txHash, blockHash);
    }
}

export class TriesToStakeActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        public readonly balance: bigint,
        public readonly locked: bigint,
        public readonly stake: bigint,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(
            `Invalid stake attempt for ${accountId} (balance: ${balance}, locked: ${locked}, stake: ${stake})`,
            actionIndex,
            txHash,
            blockHash
        );
    }
}

export class InsufficientStakeActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        public readonly minimumStake: bigint,
        public readonly stake: bigint,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(
            `Insufficient stake for ${accountId} (minimum: ${minimumStake}, stake: ${stake})`,
            actionIndex,
            txHash,
            blockHash
        );
    }
}

export class OnlyImplicitAccountCreationAllowedActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Only implicit account creation allowed for ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class DeleteAccountWithLargeStateActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Account ${accountId} cannot be deleted because it has a large state`, actionIndex, txHash, blockHash);
    }
}

export class DelegateActionInvalidSignatureActionError extends ActionExecutionError {
    constructor(actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Delegate action has an invalid signature`, actionIndex, txHash, blockHash);
    }
}

export class DelegateActionExpiredActionError extends ActionExecutionError {
    constructor(actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Delegate action has expired`, actionIndex, txHash, blockHash);
    }
}

export class DelegateActionInvalidNonceActionError extends ActionExecutionError {
    constructor(
        public readonly akNonce: number,
        public readonly delegateNonce: number,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Invalid delegate nonce (ak: ${akNonce}, delegate: ${delegateNonce})`, actionIndex, txHash, blockHash);
    }
}

export class DelegateActionNonceTooLargeActionError extends ActionExecutionError {
    constructor(
        public readonly delegateNonce: number,
        public readonly upperBound: number,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Delegate nonce ${delegateNonce} exceeds upper bound ${upperBound}`, actionIndex, txHash, blockHash);
    }
}

export class GasKeyDoesNotExistActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        public readonly publicKey: PublicKey,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Gas key ${publicKey} does not exist on account ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class GasKeyAlreadyExistsActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        public readonly publicKey: PublicKey,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Gas key ${publicKey} already exists on account ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class GlobalContractDoesNotExistActionError extends ActionExecutionError {
    constructor(
        public readonly identifier: GlobalContractIdentifier,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Global contract ${identifier} does not exist`, actionIndex, txHash, blockHash);
    }
}

export class CreateAccountOnlyByRegistrarActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        public readonly predecessorId: string,
        public readonly registrarAccountId: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(
            `Account ${accountId} can only be created by registrar ${registrarAccountId}, but was attempted by ${predecessorId}`,
            actionIndex,
            txHash,
            blockHash
        );
    }
}

export class CreateAccountNotAllowedActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        public readonly predecessorId: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Account ${accountId} cannot be created by ${predecessorId}`, actionIndex, txHash, blockHash);
    }
}

export class DelegateActionSenderDoesNotMatchTxReceiverActionError extends ActionExecutionError {
    constructor(
        public readonly receiverId: string,
        public readonly senderId: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(
            `Delegate action sender ${senderId} does not match transaction receiver ${receiverId}`,
            actionIndex,
            txHash,
            blockHash
        );
    }
}
export class AccessKeyNotFoundActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        public readonly publicKey: PublicKey,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Access key ${publicKey} does not exist on account ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class AccessKeyReceiverMismatchActionError extends ActionExecutionError {
    constructor(
        public readonly akReceiver: string,
        public readonly txReceiver: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(
            `Access key receiver ${akReceiver} does not match transaction receiver ${txReceiver}`,
            actionIndex,
            txHash,
            blockHash
        );
    }
}

export class AccessKeyMethodNameMismatchActionError extends ActionExecutionError {
    constructor(
        public readonly methodName: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Access key does not allow method ${methodName}`, actionIndex, txHash, blockHash);
    }
}

export class AccessKeyRequiresFullAccessActionError extends ActionExecutionError {
    constructor(actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Access key requires full access`, actionIndex, txHash, blockHash);
    }
}

export class AccessKeyNotEnoughAllowanceActionError extends ActionExecutionError {
    constructor(
        public readonly accountId: string,
        public readonly allowance: bigint,
        public readonly cost: bigint,
        public readonly publicKey: PublicKey,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(
            `Not enough allowance for access key ${publicKey} on account ${accountId} (allowance: ${allowance}, cost: ${cost})`,
            actionIndex,
            txHash,
            blockHash
        );
    }
}

export class AccessKeyDepositWithFunctionCallActionError extends ActionExecutionError {
    constructor(actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Deposit is not allowed with function call`, actionIndex, txHash, blockHash);
    }
}

export class InvalidPredecessorIdReceiptActionError extends ActionExecutionError {
    constructor(accountId: string, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Invalid predecessor ID: ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class InvalidReceiverIdReceiptActionError extends ActionExecutionError {
    constructor(accountId: string, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Invalid receiver ID: ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class InvalidSignerIdReceiptActionError extends ActionExecutionError {
    constructor(accountId: string, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Invalid signer ID: ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class InvalidDataReceiverIdReceiptActionError extends ActionExecutionError {
    constructor(accountId: string, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Invalid data receiver ID: ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class ReturnedValueLengthExceededReceiptActionError extends ActionExecutionError {
    constructor(length: number, limit: number, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Returned value length ${length} exceeds limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class NumberInputDataDependenciesExceededReceiptActionError extends ActionExecutionError {
    constructor(limit: number, count: number, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Number of input data dependencies ${count} exceeds limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class ReceiptSizeExceededActionError extends ActionExecutionError {
    constructor(limit: number, size: number, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Receipt size ${size} exceeds limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class InvalidRefundToReceiptActionError extends ActionExecutionError {
    constructor(accountId: string, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Invalid refund-to account ID: ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class DeleteActionMustBeFinalActionError extends ActionExecutionError {
    constructor(actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Delete action must be final`, actionIndex, txHash, blockHash);
    }
}

export class TotalPrepaidGasExceededActionError extends ActionExecutionError {
    constructor(limit: number, total: number, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Total prepaid gas ${total} exceeds limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class TotalNumberOfActionsExceededActionError extends ActionExecutionError {
    constructor(limit: number, total: number, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Total number of actions ${total} exceeds limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class AddKeyMethodNamesNumberOfBytesExceededActionError extends ActionExecutionError {
    constructor(
        limit: number,
        totalBytes: number,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Total method name bytes ${totalBytes} exceed limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class AddKeyMethodNameLengthExceededActionError extends ActionExecutionError {
    constructor(length: number, limit: number, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Method name length ${length} exceeds limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class IntegerOverflowValidationActionError extends ActionExecutionError {
    constructor(actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Integer overflow during action validation`, actionIndex, txHash, blockHash);
    }
}

export class InvalidAccountIdValidationActionError extends ActionExecutionError {
    constructor(accountId: string, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Invalid account ID: ${accountId}`, actionIndex, txHash, blockHash);
    }
}

export class ContractSizeExceededValidationActionError extends ActionExecutionError {
    constructor(limit: number, size: number, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Contract size ${size} exceeds limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class FunctionCallMethodNameLengthExceededActionError extends ActionExecutionError {
    constructor(length: number, limit: number, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Function method name length ${length} exceeds limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class FunctionCallArgumentsLengthExceededActionError extends ActionExecutionError {
    constructor(length: number, limit: number, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Function call arguments length ${length} exceeds limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class UnsuitableStakingKeyActionError extends ActionExecutionError {
    constructor(publicKey: PublicKey, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Unsuitable staking key ${publicKey}`, actionIndex, txHash, blockHash);
    }
}

export class FunctionCallZeroAttachedGasActionError extends ActionExecutionError {
    constructor(actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Function call has zero attached gas`, actionIndex, txHash, blockHash);
    }
}

export class DelegateActionMustBeOnlyOneActionError extends ActionExecutionError {
    constructor(actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Delegate action must be the only action in transaction`, actionIndex, txHash, blockHash);
    }
}

export class UnsupportedProtocolFeatureActionError extends ActionExecutionError {
    constructor(
        feature: string,
        version: number,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Unsupported protocol feature ${feature} (version ${version})`, actionIndex, txHash, blockHash);
    }
}

export class InvalidDeterministicStateInitReceiverActionError extends ActionExecutionError {
    constructor(
        derived: string,
        receiver: string,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(
            `Invalid deterministic state init receiver ${receiver} (derived ${derived})`,
            actionIndex,
            txHash,
            blockHash
        );
    }
}

export class DeterministicStateInitKeyLengthExceededActionError extends ActionExecutionError {
    constructor(length: number, limit: number, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Deterministic state init key length ${length} exceeds limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class DeterministicStateInitValueLengthExceededActionError extends ActionExecutionError {
    constructor(length: number, limit: number, actionIndex: number | null, txHash: CryptoHash, blockHash: BlockHash) {
        super(`Deterministic state init value length ${length} exceeds limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class GasKeyPermissionInvalidActionError extends ActionExecutionError {
    constructor(
        public readonly permission: AccessKeyPermission,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Invalid gas key permission`, actionIndex, txHash, blockHash);
    }
}

export class GasKeyTooManyNoncesRequestedActionError extends ActionExecutionError {
    constructor(
        limit: number,
        requested: number,
        actionIndex: number | null,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Requested ${requested} nonces exceeds limit ${limit}`, actionIndex, txHash, blockHash);
    }
}

export class InvalidSignerIdError extends TransactionExecutionError {
    constructor(
        public readonly signerId: string,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Invalid signer ID: ${signerId}`, txHash, blockHash);
    }
}

export class SignerDoesNotExistError extends TransactionExecutionError {
    constructor(
        public readonly signerId: string,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Signer ${signerId} does not exist`, txHash, blockHash);
    }
}

export class InvalidNonceError extends TransactionExecutionError {
    constructor(
        public readonly accessKeyNonce: number,
        public readonly transactionNonce: number,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Invalid nonce (ak: ${accessKeyNonce}, tx: ${transactionNonce})`, txHash, blockHash);
    }
}

export class NonceTooLargeError extends TransactionExecutionError {
    constructor(
        public readonly transactionNonce: number,
        public readonly upperBound: number,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Transaction nonce ${transactionNonce} exceeds upper bound ${upperBound}`, txHash, blockHash);
    }
}

export class InvalidReceiverIdError extends TransactionExecutionError {
    constructor(
        public readonly receiverId: string,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Invalid receiver ID: ${receiverId}`, txHash, blockHash);
    }
}

export class InvalidSignatureError extends TransactionExecutionError {
    constructor(txHash: CryptoHash, blockHash: BlockHash) {
        super(`Invalid transaction signature`, txHash, blockHash);
    }
}

export class NotEnoughBalanceError extends TransactionExecutionError {
    constructor(
        public readonly balance: bigint,
        public readonly cost: bigint,
        public readonly signerId: string,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Not enough balance for ${signerId} (balance: ${balance}, cost: ${cost})`, txHash, blockHash);
    }
}

export class CostOverflowError extends TransactionExecutionError {
    constructor(txHash: CryptoHash, blockHash: BlockHash) {
        super(`Transaction cost overflow`, txHash, blockHash);
    }
}

export class InvalidChainError extends TransactionExecutionError {
    constructor(txHash: CryptoHash, blockHash: BlockHash) {
        super(`Invalid chain ID`, txHash, blockHash);
    }
}

export class TransactionExpiredError extends TransactionExecutionError {
    constructor(txHash: CryptoHash, blockHash: BlockHash) {
        super(`Transaction expired`, txHash, blockHash);
    }
}

export class TransactionSizeExceededError extends TransactionExecutionError {
    constructor(
        public readonly limit: number,
        public readonly size: number,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Transaction size ${size} exceeds limit ${limit}`, txHash, blockHash);
    }
}

export class InvalidTransactionVersionError extends TransactionExecutionError {
    constructor(txHash: CryptoHash, blockHash: BlockHash) {
        super(`Invalid transaction version`, txHash, blockHash);
    }
}

export class StorageInternalError extends TransactionExecutionError {
    constructor(txHash: CryptoHash, blockHash: BlockHash) {
        super(`Internal storage error`, txHash, blockHash);
    }
}

export class MissingTrieValueError extends TransactionExecutionError {
    constructor(
        public readonly context: MissingTrieValueContext,
        public readonly hash: CryptoHash,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Missing trie value ${hash}`, txHash, blockHash);
    }
}

export class UnexpectedTrieValueError extends TransactionExecutionError {
    constructor(txHash: CryptoHash, blockHash: BlockHash) {
        super(`Unexpected trie value`, txHash, blockHash);
    }
}

export class StorageInconsistentStateError extends TransactionExecutionError {
    constructor(
        public readonly details: string,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Storage inconsistent state: ${details}`, txHash, blockHash);
    }
}

export class FlatStorageBlockNotSupportedError extends TransactionExecutionError {
    constructor(
        public readonly details: string,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Flat storage block not supported: ${details}`, txHash, blockHash);
    }
}

export class MemTrieLoadingError extends TransactionExecutionError {
    constructor(
        public readonly details: string,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`MemTrie loading error: ${details}`, txHash, blockHash);
    }
}

export class ShardCongestedError extends TransactionExecutionError {
    constructor(
        public readonly congestionLevel: number,
        public readonly shardId: number,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Shard ${shardId} congested (level: ${congestionLevel})`, txHash, blockHash);
    }
}

export class ShardStuckError extends TransactionExecutionError {
    constructor(
        public readonly missedChunks: number,
        public readonly shardId: number,
        txHash: CryptoHash,
        blockHash: BlockHash
    ) {
        super(`Shard ${shardId} stuck (missed chunks: ${missedChunks})`, txHash, blockHash);
    }
}
