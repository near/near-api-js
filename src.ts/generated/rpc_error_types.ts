export class ServerError {
}

export class TxExecutionError extends ServerError {
}

export class Action extends TxExecutionError {
    public index;
}

export class FunctionCall extends Action {
}

export class FunctionExecError extends FunctionCall {
}

export class HostError extends FunctionExecError {
}

export class GasLimitExceeded extends HostError {
}

export class ResolveError extends FunctionExecError {
}

export class MethodEmptyName extends ResolveError {
}

export class CompilationError extends FunctionExecError {
}

export class WasmerCompileError extends CompilationError {
    public msg;
}

export class GuestPanic extends HostError {
    public panic_msg;
}

export class PrepareError extends CompilationError {
}

export class Memory extends PrepareError {
}

export class GasExceeded extends HostError {
}

export class MethodUTF8Error extends ResolveError {
}

export class BadUTF16 extends HostError {
}

export class WasmTrap extends FunctionExecError {
    public msg;
}

export class GasInstrumentation extends PrepareError {
}

export class InvalidPromiseIndex extends HostError {
    public promise_idx;
}

export class InvalidPromiseResultIndex extends HostError {
    public result_idx;
}

export class Deserialization extends PrepareError {
}

export class MethodNotFound extends ResolveError {
}

export class InvalidRegisterId extends HostError {
    public register_id;
}

export class InvalidReceiptIndex extends HostError {
    public receipt_index;
}

export class EmptyMethodName extends HostError {
}

export class CannotReturnJointPromise extends HostError {
}

export class StackHeightInstrumentation extends PrepareError {
}

export class CodeDoesNotExist extends CompilationError {
    public account_id;
}

export class MethodInvalidSignature extends ResolveError {
}

export class IntegerOverflow extends HostError {
}

export class MemoryAccessViolation extends HostError {
}

export class InvalidIteratorIndex extends HostError {
    public iterator_index;
}

export class IteratorWasInvalidated extends HostError {
    public iterator_index;
}

export class InvalidAccountId extends HostError {
}

export class Serialization extends PrepareError {
}

export class CannotAppendActionToJointPromise extends HostError {
}

export class InternalMemoryDeclared extends PrepareError {
}

export class Instantiate extends PrepareError {
}

export class ProhibitedInView extends HostError {
    public method_name;
}

export class InvalidMethodName extends HostError {
}

export class BadUTF8 extends HostError {
}

export class BalanceExceeded extends HostError {
}

export class LinkError extends FunctionExecError {
    public msg;
}

export class InvalidPublicKey extends HostError {
}

export class InvalidTx extends TxExecutionError {
}

export class ActorNoPermission extends Action {
    public actor_id;
    public account_id;
}

export class RentUnpaid extends InvalidTx {
    public account_id;
    public amount;
}

export class InvalidAccessKey extends InvalidTx {
}

export class ReceiverMismatch extends InvalidAccessKey {
    public ak_receiver;
    public tx_receiver;
}

export class CostOverflow extends InvalidTx {
}

export class InvalidSignature extends InvalidTx {
}

export class AccessKeyNotFound extends InvalidAccessKey {
    public account_id;
    public public_key;
}

export class NotEnoughBalance extends InvalidTx {
    public balance;
    public cost;
    public signer_id;
}

export class NotEnoughAllowance extends InvalidAccessKey {
    public account_id;
    public allowance;
    public cost;
    public public_key;
}

export class Expired extends InvalidTx {
}

export class DeleteAccountStaking extends Action {
    public account_id;
}

export class SignerDoesNotExist extends InvalidTx {
    public signer_id;
}

export class TriesToStake extends Action {
    public stake;
    public locked;
    public account_id;
    public balance;
}

export class AddKeyAlreadyExists extends Action {
    public account_id;
    public public_key;
}

export class InvalidSigner extends InvalidTx {
    public signer_id;
}

export class CreateAccountNotAllowed extends Action {
    public account_id;
    public predecessor_id;
}

export class ActionError extends InvalidAccessKey {
}

export class TriesToUnstake extends Action {
    public account_id;
}

export class InvalidNonce extends InvalidTx {
    public ak_nonce;
    public tx_nonce;
}

export class AccountAlreadyExists extends Action {
    public account_id;
}

export class InvalidChain extends InvalidTx {
}

export class AccountDoesNotExist extends Action {
    public account_id;
}

export class MethodNameMismatch extends InvalidAccessKey {
    public method_name;
}

export class DeleteAccountHasRent extends Action {
    public account_id;
    public balance;
}

export class InvalidReceiver extends InvalidTx {
    public receiver_id;
}

export class DeleteKeyDoesNotExist extends Action {
    public account_id;
    public public_key;
}

export class Timeout extends ServerError {
}

export class Closed extends ServerError {
}
