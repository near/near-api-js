import { TypedError } from '../utils/errors';
export declare class ServerError extends TypedError {
}
export declare class TxExecutionError extends ServerError {
}
export declare class ActionError extends TxExecutionError {
    index: any;
}
export declare class FunctionCallError extends ActionError {
}
export declare class HostError extends FunctionCallError {
}
export declare class BadUTF16 extends HostError {
}
export declare class BadUTF8 extends HostError {
}
export declare class BalanceExceeded extends HostError {
}
export declare class WasmTrap extends FunctionCallError {
}
export declare class BreakpointTrap extends WasmTrap {
}
export declare class CacheError extends TypedError {
}
export declare class CallIndirectOOB extends WasmTrap {
}
export declare class CannotAppendActionToJointPromise extends HostError {
}
export declare class CannotReturnJointPromise extends HostError {
}
export declare class CompilationError extends FunctionCallError {
}
export declare class CodeDoesNotExist extends CompilationError {
    account_id: any;
}
export declare class ContractSizeExceeded extends HostError {
    limit: any;
    size: any;
}
export declare class Deprecated extends HostError {
    method_name: any;
}
export declare class PrepareError extends CompilationError {
}
export declare class Deserialization extends PrepareError {
}
export declare class DeserializationError extends CacheError {
}
export declare class EmptyMethodName extends HostError {
}
export declare class GasExceeded extends HostError {
}
export declare class GasInstrumentation extends PrepareError {
}
export declare class GasLimitExceeded extends HostError {
}
export declare class GenericTrap extends WasmTrap {
}
export declare class GuestPanic extends HostError {
    panic_msg: any;
}
export declare class IllegalArithmetic extends WasmTrap {
}
export declare class IncorrectCallIndirectSignature extends WasmTrap {
}
export declare class Instantiate extends PrepareError {
}
export declare class IntegerOverflow extends HostError {
}
export declare class InternalMemoryDeclared extends PrepareError {
}
export declare class InvalidAccountId extends HostError {
    account_id: any;
}
export declare class InvalidIteratorIndex extends HostError {
    iterator_index: any;
}
export declare class InvalidMethodName extends HostError {
}
export declare class InvalidPromiseIndex extends HostError {
    promise_idx: any;
}
export declare class InvalidPromiseResultIndex extends HostError {
    result_idx: any;
}
export declare class InvalidPublicKey extends HostError {
}
export declare class InvalidReceiptIndex extends HostError {
    receipt_index: any;
}
export declare class InvalidRegisterId extends HostError {
    register_id: any;
}
export declare class IteratorWasInvalidated extends HostError {
    iterator_index: any;
}
export declare class KeyLengthExceeded extends HostError {
    length: any;
    limit: any;
}
export declare class LinkError extends FunctionCallError {
    msg: any;
}
export declare class Memory extends PrepareError {
}
export declare class MemoryAccessViolation extends HostError {
}
export declare class MemoryOutOfBounds extends WasmTrap {
}
export declare class MethodResolveError extends FunctionCallError {
}
export declare class MethodEmptyName extends MethodResolveError {
}
export declare class MethodInvalidSignature extends MethodResolveError {
}
export declare class MethodNotFound extends MethodResolveError {
}
export declare class MethodUTF8Error extends MethodResolveError {
}
export declare class MisalignedAtomicAccess extends WasmTrap {
}
export declare class NumberInputDataDependenciesExceeded extends HostError {
    limit: any;
    number_of_input_data_dependencies: any;
}
export declare class NumberOfLogsExceeded extends HostError {
    limit: any;
}
export declare class NumberPromisesExceeded extends HostError {
    limit: any;
    number_of_promises: any;
}
export declare class ProhibitedInView extends HostError {
    method_name: any;
}
export declare class ReadError extends CacheError {
}
export declare class ReturnedValueLengthExceeded extends HostError {
    length: any;
    limit: any;
}
export declare class Serialization extends PrepareError {
}
export declare class SerializationError extends CacheError {
    hash: any;
}
export declare class StackHeightInstrumentation extends PrepareError {
}
export declare class StackOverflow extends WasmTrap {
}
export declare class TotalLogLengthExceeded extends HostError {
    length: any;
    limit: any;
}
export declare class Unreachable extends WasmTrap {
}
export declare class ValueLengthExceeded extends HostError {
    length: any;
    limit: any;
}
export declare class WasmUnknownError extends FunctionCallError {
}
export declare class WasmerCompileError extends CompilationError {
    msg: any;
}
export declare class WriteError extends CacheError {
}
export declare class InvalidTxError extends TxExecutionError {
}
export declare class InvalidAccessKeyError extends InvalidTxError {
}
export declare class AccessKeyNotFound extends InvalidAccessKeyError {
    account_id: any;
    public_key: any;
}
export declare class AccountAlreadyExists extends ActionError {
    account_id: any;
}
export declare class AccountDoesNotExist extends ActionError {
    account_id: any;
}
export declare class ActionsValidationError extends TypedError {
}
export declare class ActorNoPermission extends ActionError {
    account_id: any;
    actor_id: any;
}
export declare class AddKeyAlreadyExists extends ActionError {
    account_id: any;
    public_key: any;
}
export declare class AddKeyMethodNameLengthExceeded extends ActionsValidationError {
    length: any;
    limit: any;
}
export declare class AddKeyMethodNamesNumberOfBytesExceeded extends ActionsValidationError {
    limit: any;
    total_number_of_bytes: any;
}
export declare class BalanceMismatchError extends TypedError {
    final_accounts_balance: any;
    final_postponed_receipts_balance: any;
    incoming_receipts_balance: any;
    incoming_validator_rewards: any;
    initial_accounts_balance: any;
    initial_postponed_receipts_balance: any;
    new_delayed_receipts_balance: any;
    other_burnt_amount: any;
    outgoing_receipts_balance: any;
    processed_delayed_receipts_balance: any;
    slashed_burnt_amount: any;
    tx_burnt_amount: any;
}
export declare class CostOverflow extends InvalidTxError {
}
export declare class CreateAccountNotAllowed extends ActionError {
    account_id: any;
    predecessor_id: any;
}
export declare class CreateAccountOnlyByRegistrar extends ActionError {
    account_id: any;
    predecessor_id: any;
    registrar_account_id: any;
}
export declare class DeleteAccountStaking extends ActionError {
    account_id: any;
}
export declare class DeleteActionMustBeFinal extends ActionsValidationError {
}
export declare class DeleteKeyDoesNotExist extends ActionError {
    account_id: any;
    public_key: any;
}
export declare class DepositWithFunctionCall extends InvalidAccessKeyError {
}
export declare class Expired extends InvalidTxError {
}
export declare class FunctionCallArgumentsLengthExceeded extends ActionsValidationError {
    length: any;
    limit: any;
}
export declare class FunctionCallMethodNameLengthExceeded extends ActionsValidationError {
    length: any;
    limit: any;
}
export declare class FunctionCallZeroAttachedGas extends ActionsValidationError {
}
export declare class InsufficientStake extends ActionError {
    account_id: any;
    minimum_stake: any;
    stake: any;
}
export declare class InvalidChain extends InvalidTxError {
}
export declare class ReceiptValidationError extends TypedError {
}
export declare class InvalidDataReceiverId extends ReceiptValidationError {
    account_id: any;
}
export declare class InvalidNonce extends InvalidTxError {
    ak_nonce: any;
    tx_nonce: any;
}
export declare class InvalidPredecessorId extends ReceiptValidationError {
    account_id: any;
}
export declare class InvalidReceiverId extends InvalidTxError {
    account_id: any;
}
export declare class InvalidSignature extends InvalidTxError {
}
export declare class InvalidSignerId extends InvalidTxError {
    account_id: any;
}
export declare class LackBalanceForState extends ActionError {
    account_id: any;
    amount: any;
}
export declare class MethodNameMismatch extends InvalidAccessKeyError {
    method_name: any;
}
export declare class NotEnoughAllowance extends InvalidAccessKeyError {
    account_id: any;
    allowance: any;
    cost: any;
    public_key: any;
}
export declare class NotEnoughBalance extends InvalidTxError {
    balance: any;
    cost: any;
    signer_id: any;
}
export declare class OnlyImplicitAccountCreationAllowed extends ActionError {
    account_id: any;
}
export declare class ReceiverMismatch extends InvalidAccessKeyError {
    ak_receiver: any;
    tx_receiver: any;
}
export declare class RequiresFullAccess extends InvalidAccessKeyError {
}
export declare class SignerDoesNotExist extends InvalidTxError {
    signer_id: any;
}
export declare class TotalNumberOfActionsExceeded extends ActionsValidationError {
    limit: any;
    total_number_of_actions: any;
}
export declare class TotalPrepaidGasExceeded extends ActionsValidationError {
    limit: any;
    total_prepaid_gas: any;
}
export declare class TriesToStake extends ActionError {
    account_id: any;
    balance: any;
    locked: any;
    stake: any;
}
export declare class TriesToUnstake extends ActionError {
    account_id: any;
}
export declare class UnsuitableStakingKey extends ActionsValidationError {
    public_key: any;
}
export declare class Closed extends ServerError {
}
export declare class InternalError extends ServerError {
}
export declare class Timeout extends ServerError {
}
