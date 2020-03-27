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
export declare class PrepareError extends CompilationError {
}
export declare class Deserialization extends PrepareError {
}
export declare class EmptyMethodName extends HostError {
}
export declare class GasExceeded extends HostError {
}
export declare class GasInstrumentation extends PrepareError {
}
export declare class GasLimitExceeded extends HostError {
}
export declare class GuestPanic extends HostError {
    panic_msg: any;
}
export declare class Instantiate extends PrepareError {
}
export declare class IntegerOverflow extends HostError {
}
export declare class InternalMemoryDeclared extends PrepareError {
}
export declare class InvalidAccountId extends HostError {
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
export declare class ReturnedValueLengthExceeded extends HostError {
    length: any;
    limit: any;
}
export declare class Serialization extends PrepareError {
}
export declare class StackHeightInstrumentation extends PrepareError {
}
export declare class TotalLogLengthExceeded extends HostError {
    length: any;
    limit: any;
}
export declare class ValueLengthExceeded extends HostError {
    length: any;
    limit: any;
}
export declare class WasmTrap extends FunctionCallError {
    msg: any;
}
export declare class WasmerCompileError extends CompilationError {
    msg: any;
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
export declare class ActorNoPermission extends ActionError {
    account_id: any;
    actor_id: any;
}
export declare class AddKeyAlreadyExists extends ActionError {
    account_id: any;
    public_key: any;
}
export declare class BalanceMismatchError extends TypedError {
    final_accounts_balance: any;
    final_postponed_receipts_balance: any;
    incoming_receipts_balance: any;
    incoming_validator_rewards: any;
    initial_accounts_balance: any;
    initial_postponed_receipts_balance: any;
    new_delayed_receipts_balance: any;
    outgoing_receipts_balance: any;
    processed_delayed_receipts_balance: any;
    total_balance_burnt: any;
    total_balance_slashed: any;
    total_rent_paid: any;
    total_validator_reward: any;
}
export declare class CostOverflow extends InvalidTxError {
}
export declare class CreateAccountNotAllowed extends ActionError {
    account_id: any;
    predecessor_id: any;
}
export declare class DeleteAccountHasRent extends TypedError {
    account_id: any;
    balance: any;
}
export declare class DeleteAccountStaking extends ActionError {
    account_id: any;
}
export declare class DeleteKeyDoesNotExist extends ActionError {
    account_id: any;
    public_key: any;
}
export declare class DepositWithFunctionCall extends InvalidAccessKeyError {
}
export declare class Expired extends InvalidTxError {
}
export declare class InvalidChain extends InvalidTxError {
}
export declare class InvalidNonce extends InvalidTxError {
    ak_nonce: any;
    tx_nonce: any;
}
export declare class InvalidReceiverId extends InvalidTxError {
    receiver_id: any;
}
export declare class InvalidSignature extends InvalidTxError {
}
export declare class InvalidSignerId extends InvalidTxError {
    signer_id: any;
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
export declare class ReceiverMismatch extends InvalidAccessKeyError {
    ak_receiver: any;
    tx_receiver: any;
}
export declare class RentUnpaid extends TypedError {
    account_id: any;
    amount: any;
}
export declare class RequiresFullAccess extends InvalidAccessKeyError {
}
export declare class SignerDoesNotExist extends InvalidTxError {
    signer_id: any;
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
export declare class Closed extends ServerError {
}
export declare class Timeout extends ServerError {
}
export declare class UnsuitableStakingKey extends ActionError {
    public_key: any;
}
export declare class LackBalanceForState extends ActionError {
    amount: any;
    signer_id: any;
    account_id: any;
}
export declare class DeleteAccountHasEnoughBalance extends ActionError {
    account_id: any;
    balance: any;
}
export declare class Deprecated extends HostError {
    method_name: any;
}
