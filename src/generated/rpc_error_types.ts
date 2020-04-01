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

export class PrepareError extends CompilationError {
}

export class Deserialization extends PrepareError {
}

export class EmptyMethodName extends HostError {
}

export class GasExceeded extends HostError {
}

export class GasInstrumentation extends PrepareError {
}

export class GasLimitExceeded extends HostError {
}

export class GuestPanic extends HostError {
    public panic_msg;
}

export class Instantiate extends PrepareError {
}

export class IntegerOverflow extends HostError {
}

export class InternalMemoryDeclared extends PrepareError {
}

export class InvalidAccountId extends HostError {
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

export class ReturnedValueLengthExceeded extends HostError {
    public length;
    public limit;
}

export class Serialization extends PrepareError {
}

export class StackHeightInstrumentation extends PrepareError {
}

export class TotalLogLengthExceeded extends HostError {
    public length;
    public limit;
}

export class ValueLengthExceeded extends HostError {
    public length;
    public limit;
}

export class WasmTrap extends FunctionCallError {
    public msg;
}

export class WasmerCompileError extends CompilationError {
    public msg;
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

export class ActorNoPermission extends ActionError {
    public account_id;
    public actor_id;
}

export class AddKeyAlreadyExists extends ActionError {
    public account_id;
    public public_key;
}

export class BalanceMismatchError extends TypedError {
    public final_accounts_balance;
    public final_postponed_receipts_balance;
    public incoming_receipts_balance;
    public incoming_validator_rewards;
    public initial_accounts_balance;
    public initial_postponed_receipts_balance;
    public new_delayed_receipts_balance;
    public outgoing_receipts_balance;
    public processed_delayed_receipts_balance;
    public total_balance_burnt;
    public total_balance_slashed;
    public total_rent_paid;
    public total_validator_reward;
}

export class CostOverflow extends InvalidTxError {
}

export class CreateAccountNotAllowed extends ActionError {
    public account_id;
    public predecessor_id;
}

export class DeleteAccountHasRent extends TypedError {
    public account_id;
    public balance;
}

export class DeleteAccountStaking extends ActionError {
    public account_id;
}

export class DeleteKeyDoesNotExist extends ActionError {
    public account_id;
    public public_key;
}

export class DepositWithFunctionCall extends InvalidAccessKeyError {
}

export class Expired extends InvalidTxError {
}

export class InvalidChain extends InvalidTxError {
}

export class InvalidNonce extends InvalidTxError {
    public ak_nonce;
    public tx_nonce;
}

export class InvalidReceiverId extends InvalidTxError {
    public receiver_id;
}

export class InvalidSignature extends InvalidTxError {
}

export class InvalidSignerId extends InvalidTxError {
    public signer_id;
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

export class ReceiverMismatch extends InvalidAccessKeyError {
    public ak_receiver;
    public tx_receiver;
}

export class RentUnpaid extends TypedError {
    public account_id;
    public amount;
}

export class RequiresFullAccess extends InvalidAccessKeyError {
}

export class SignerDoesNotExist extends InvalidTxError {
    public signer_id;
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

export class Closed extends ServerError {
}

export class Timeout extends ServerError {
}

export class UnsuitableStakingKey extends ActionError {
    public public_key;
}

export class LackBalanceForState extends ActionError {
    public amount;
    public signer_id;
    public account_id;
}

export class DeleteAccountHasEnoughBalance extends ActionError {
    public account_id;
    public balance;
}

export class Deprecated extends HostError {
    public method_name;
}
