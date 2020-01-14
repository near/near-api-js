import { TypedError } from "../utils/errors";

export class ServerError extends TypedError {
}

export class TxExecutionError extends ServerError {
}

export class ActionError extends TxExecutionError {
    public index;
}

export class FunctionCall extends ActionError {
}

export class FunctionExecError extends FunctionCall {
}

export class HostError extends FunctionExecError {
}

export class InvalidIteratorIndex extends HostError {
    public iterator_index;
}

export class InvalidPublicKey extends HostError {
}

export class CannotAppendActionToJointPromise extends HostError {
}

export class CompilationError extends FunctionExecError {
}

export class PrepareError extends CompilationError {
}

export class Instantiate extends PrepareError {
}

export class MemoryAccessViolation extends HostError {
}

export class BadUTF16 extends HostError {
}

export class LinkError extends FunctionExecError {
    public msg;
}

export class StackHeightInstrumentation extends PrepareError {
}

export class WasmerCompileError extends CompilationError {
    public msg;
}

export class Memory extends PrepareError {
}

export class InvalidAccountId extends HostError {
}

export class ResolveError extends FunctionExecError {
}

export class InternalMemoryDeclared extends PrepareError {
}

export class GasInstrumentation extends PrepareError {
}

export class MethodUTF8Error extends ResolveError {
}

export class CannotReturnJointPromise extends HostError {
}

export class MethodInvalidSignature extends ResolveError {
}

export class InvalidRegisterId extends HostError {
    public register_id;
}

export class GasExceeded extends HostError {
}

export class Deserialization extends PrepareError {
}

export class GasLimitExceeded extends HostError {
}

export class BalanceExceeded extends HostError {
}

export class Serialization extends PrepareError {
}

export class WasmTrap extends FunctionExecError {
    public msg;
}

export class ProhibitedInView extends HostError {
    public method_name;
}

export class MethodEmptyName extends ResolveError {
}

export class EmptyMethodName extends HostError {
}

export class GuestPanic extends HostError {
    public panic_msg;
}

export class InvalidMethodName extends HostError {
}

export class MethodNotFound extends ResolveError {
}

export class InvalidPromiseResultIndex extends HostError {
    public result_idx;
}

export class IteratorWasInvalidated extends HostError {
    public iterator_index;
}

export class InvalidPromiseIndex extends HostError {
    public promise_idx;
}

export class BadUTF8 extends HostError {
}

export class InvalidReceiptIndex extends HostError {
    public receipt_index;
}

export class CodeDoesNotExist extends CompilationError {
    public account_id;
}

export class IntegerOverflow extends HostError {
}

export class InvalidTxError extends TxExecutionError {
}

export class InvalidAccessKey extends InvalidTxError {
}

export class NotEnoughAllowance extends InvalidAccessKey {
    public public_key;
    public allowance;
    public account_id;
    public cost;
}

export class ReceiverMismatch extends InvalidAccessKey {
    public ak_receiver;
    public tx_receiver;
}

export class DeleteAccountStaking extends ActionError {
    public account_id;
}

export class TriesToStake extends ActionError {
    public balance;
    public account_id;
    public locked;
    public stake;
}

export class InvalidReceiverId extends InvalidTxError {
    public receiver_id;
}

export class AccessKeyNotFound extends InvalidAccessKey {
    public public_key;
    public account_id;
}

export class RentUnpaid extends InvalidTxError {
    public amount;
    public account_id;
}

export class Expired extends InvalidTxError {
}

export class InvalidSignature extends InvalidTxError {
}

export class InvalidChain extends InvalidTxError {
}

export class MethodNameMismatch extends InvalidAccessKey {
    public method_name;
}

export class InvalidSignerId extends InvalidTxError {
    public signer_id;
}

export class CostOverflow extends InvalidTxError {
}

export class ActorNoPermission extends ActionError {
    public account_id;
    public actor_id;
}

export class DeleteKeyDoesNotExist extends ActionError {
    public account_id;
    public public_key;
}

export class AddKeyAlreadyExists extends ActionError {
    public public_key;
    public account_id;
}

export class DeleteAccountHasRent extends ActionError {
    public balance;
    public account_id;
}

export class TriesToUnstake extends ActionError {
    public account_id;
}

export class AccountAlreadyExists extends ActionError {
    public account_id;
}

export class NotEnoughBalance extends InvalidTxError {
    public balance;
    public signer_id;
    public cost;
}

export class InvalidNonce extends InvalidTxError {
    public ak_nonce;
    public tx_nonce;
}

export class SignerDoesNotExist extends InvalidTxError {
    public signer_id;
}

export class AccountDoesNotExist extends ActionError {
    public account_id;
}

export class CreateAccountNotAllowed extends ActionError {
    public predecessor_id;
    public account_id;
}

export class Closed extends ServerError {
}

export class Timeout extends ServerError {
}
