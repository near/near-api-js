import { TypedError } from '../utils/errors';

export class ServerError extends TypedError {
}

export class TxExecutionError extends ServerError {
}

export class ActionError extends TxExecutionError {
    public index;
}

export class FunctionCallError extends ActionError {
}

export class HostError extends FunctionCallError {
}

export class BadUTF16 extends HostError {
}

export class BadUTF8 extends HostError {
}

export class BalanceExceeded extends HostError {
}

export class WasmTrap extends FunctionCallError {
}

export class BreakpointTrap extends WasmTrap {
}

export class CacheError extends TypedError {
}

export class CallIndirectOOB extends WasmTrap {
}

export class CannotAppendActionToJointPromise extends HostError {
}

export class CannotReturnJointPromise extends HostError {
}

export class CompilationError extends FunctionCallError {
}

export class CodeDoesNotExist extends CompilationError {
    public account_id;
}

export class ContractSizeExceeded extends HostError {
    public limit;
    public size;
}

export class Deprecated extends HostError {
    public method_name;
}

export class PrepareError extends CompilationError {
}

export class Deserialization extends PrepareError {
}

export class DeserializationError extends CacheError {
}

export class EmptyMethodName extends HostError {
}

export class GasExceeded extends HostError {
}

export class GasInstrumentation extends PrepareError {
}

export class GasLimitExceeded extends HostError {
}

export class GenericTrap extends WasmTrap {
}

export class GuestPanic extends HostError {
    public panic_msg;
}

export class IllegalArithmetic extends WasmTrap {
}

export class IncorrectCallIndirectSignature extends WasmTrap {
}

export class Instantiate extends PrepareError {
}

export class IntegerOverflow extends HostError {
}

export class InternalMemoryDeclared extends PrepareError {
}

export class InvalidAccountId extends HostError {
    public account_id;
}

export class InvalidIteratorIndex extends HostError {
    public iterator_index;
}

export class InvalidMethodName extends HostError {
}

export class InvalidPromiseIndex extends HostError {
    public promise_idx;
}

export class InvalidPromiseResultIndex extends HostError {
    public result_idx;
}

export class InvalidPublicKey extends HostError {
}

export class InvalidReceiptIndex extends HostError {
    public receipt_index;
}

export class InvalidRegisterId extends HostError {
    public register_id;
}

export class IteratorWasInvalidated extends HostError {
    public iterator_index;
}

export class KeyLengthExceeded extends HostError {
    public length;
    public limit;
}

export class LinkError extends FunctionCallError {
    public msg;
}

export class Memory extends PrepareError {
}

export class MemoryAccessViolation extends HostError {
}

export class MemoryOutOfBounds extends WasmTrap {
}

export class MethodResolveError extends FunctionCallError {
}

export class MethodEmptyName extends MethodResolveError {
}

export class MethodInvalidSignature extends MethodResolveError {
}

export class MethodNotFound extends MethodResolveError {
}

export class MethodUTF8Error extends MethodResolveError {
}

export class MisalignedAtomicAccess extends WasmTrap {
}

export class NumberInputDataDependenciesExceeded extends HostError {
    public limit;
    public number_of_input_data_dependencies;
}

export class NumberOfLogsExceeded extends HostError {
    public limit;
}

export class NumberPromisesExceeded extends HostError {
    public limit;
    public number_of_promises;
}

export class ProhibitedInView extends HostError {
    public method_name;
}

export class ReadError extends CacheError {
}

export class ReturnedValueLengthExceeded extends HostError {
    public length;
    public limit;
}

export class Serialization extends PrepareError {
}

export class SerializationError extends CacheError {
    public hash;
}

export class StackHeightInstrumentation extends PrepareError {
}

export class StackOverflow extends WasmTrap {
}

export class TotalLogLengthExceeded extends HostError {
    public length;
    public limit;
}

export class Unreachable extends WasmTrap {
}

export class ValueLengthExceeded extends HostError {
    public length;
    public limit;
}

export class WasmUnknownError extends FunctionCallError {
}

export class WasmerCompileError extends CompilationError {
    public msg;
}

export class WriteError extends CacheError {
}

export class InvalidTxError extends TxExecutionError {
}

export class InvalidAccessKeyError extends InvalidTxError {
}

export class AccessKeyNotFound extends InvalidAccessKeyError {
    public account_id;
    public public_key;
}

export class AccountAlreadyExists extends ActionError {
    public account_id;
}

export class AccountDoesNotExist extends ActionError {
    public account_id;
}

export class ActionsValidationError extends TypedError {
}

export class ActorNoPermission extends ActionError {
    public account_id;
    public actor_id;
}

export class AddKeyAlreadyExists extends ActionError {
    public account_id;
    public public_key;
}

export class AddKeyMethodNameLengthExceeded extends ActionsValidationError {
    public length;
    public limit;
}

export class AddKeyMethodNamesNumberOfBytesExceeded extends ActionsValidationError {
    public limit;
    public total_number_of_bytes;
}

export class BalanceMismatchError extends TypedError {
    public final_accounts_balance;
    public final_postponed_receipts_balance;
    public incoming_receipts_balance;
    public incoming_validator_rewards;
    public initial_accounts_balance;
    public initial_postponed_receipts_balance;
    public new_delayed_receipts_balance;
    public other_burnt_amount;
    public outgoing_receipts_balance;
    public processed_delayed_receipts_balance;
    public slashed_burnt_amount;
    public tx_burnt_amount;
}

export class CostOverflow extends InvalidTxError {
}

export class CreateAccountNotAllowed extends ActionError {
    public account_id;
    public predecessor_id;
}

export class CreateAccountOnlyByRegistrar extends ActionError {
    public account_id;
    public predecessor_id;
    public registrar_account_id;
}

export class DeleteAccountStaking extends ActionError {
    public account_id;
}

export class DeleteActionMustBeFinal extends ActionsValidationError {
}

export class DeleteKeyDoesNotExist extends ActionError {
    public account_id;
    public public_key;
}

export class DepositWithFunctionCall extends InvalidAccessKeyError {
}

export class Expired extends InvalidTxError {
}

export class FunctionCallArgumentsLengthExceeded extends ActionsValidationError {
    public length;
    public limit;
}

export class FunctionCallMethodNameLengthExceeded extends ActionsValidationError {
    public length;
    public limit;
}

export class FunctionCallZeroAttachedGas extends ActionsValidationError {
}

export class InsufficientStake extends ActionError {
    public account_id;
    public minimum_stake;
    public stake;
}

export class InvalidChain extends InvalidTxError {
}

export class ReceiptValidationError extends TypedError {
}

export class InvalidDataReceiverId extends ReceiptValidationError {
    public account_id;
}

export class InvalidNonce extends InvalidTxError {
    public ak_nonce;
    public tx_nonce;
}

export class InvalidPredecessorId extends ReceiptValidationError {
    public account_id;
}

export class InvalidReceiverId extends InvalidTxError {
    public account_id;
}

export class InvalidSignature extends InvalidTxError {
}

export class InvalidSignerId extends InvalidTxError {
    public account_id;
}

export class LackBalanceForState extends ActionError {
    public account_id;
    public amount;
}

export class MethodNameMismatch extends InvalidAccessKeyError {
    public method_name;
}

export class NotEnoughAllowance extends InvalidAccessKeyError {
    public account_id;
    public allowance;
    public cost;
    public public_key;
}

export class NotEnoughBalance extends InvalidTxError {
    public balance;
    public cost;
    public signer_id;
}

export class OnlyImplicitAccountCreationAllowed extends ActionError {
    public account_id;
}

export class ReceiverMismatch extends InvalidAccessKeyError {
    public ak_receiver;
    public tx_receiver;
}

export class RequiresFullAccess extends InvalidAccessKeyError {
}

export class SignerDoesNotExist extends InvalidTxError {
    public signer_id;
}

export class TotalNumberOfActionsExceeded extends ActionsValidationError {
    public limit;
    public total_number_of_actions;
}

export class TotalPrepaidGasExceeded extends ActionsValidationError {
    public limit;
    public total_prepaid_gas;
}

export class TriesToStake extends ActionError {
    public account_id;
    public balance;
    public locked;
    public stake;
}

export class TriesToUnstake extends ActionError {
    public account_id;
}

export class UnsuitableStakingKey extends ActionsValidationError {
    public public_key;
}

export class Closed extends ServerError {
}

export class InternalError extends ServerError {
}

export class Timeout extends ServerError {
}
