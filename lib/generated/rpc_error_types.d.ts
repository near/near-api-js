export declare class ServerError {
}
export declare class TxExecutionError extends ServerError {
}
export declare class Action extends TxExecutionError {
    index: any;
}
export declare class FunctionCall extends Action {
}
export declare class FunctionExecError extends FunctionCall {
}
export declare class HostError extends FunctionExecError {
}
export declare class GasLimitExceeded extends HostError {
}
export declare class ResolveError extends FunctionExecError {
}
export declare class MethodEmptyName extends ResolveError {
}
export declare class CompilationError extends FunctionExecError {
}
export declare class WasmerCompileError extends CompilationError {
    msg: any;
}
export declare class GuestPanic extends HostError {
    panic_msg: any;
}
export declare class PrepareError extends CompilationError {
}
export declare class Memory extends PrepareError {
}
export declare class GasExceeded extends HostError {
}
export declare class MethodUTF8Error extends ResolveError {
}
export declare class BadUTF16 extends HostError {
}
export declare class WasmTrap extends FunctionExecError {
    msg: any;
}
export declare class GasInstrumentation extends PrepareError {
}
export declare class InvalidPromiseIndex extends HostError {
    promise_idx: any;
}
export declare class InvalidPromiseResultIndex extends HostError {
    result_idx: any;
}
export declare class Deserialization extends PrepareError {
}
export declare class MethodNotFound extends ResolveError {
}
export declare class InvalidRegisterId extends HostError {
    register_id: any;
}
export declare class InvalidReceiptIndex extends HostError {
    receipt_index: any;
}
export declare class EmptyMethodName extends HostError {
}
export declare class CannotReturnJointPromise extends HostError {
}
export declare class StackHeightInstrumentation extends PrepareError {
}
export declare class CodeDoesNotExist extends CompilationError {
    account_id: any;
}
export declare class MethodInvalidSignature extends ResolveError {
}
export declare class IntegerOverflow extends HostError {
}
export declare class MemoryAccessViolation extends HostError {
}
export declare class InvalidIteratorIndex extends HostError {
    iterator_index: any;
}
export declare class IteratorWasInvalidated extends HostError {
    iterator_index: any;
}
export declare class InvalidAccountId extends HostError {
}
export declare class Serialization extends PrepareError {
}
export declare class CannotAppendActionToJointPromise extends HostError {
}
export declare class InternalMemoryDeclared extends PrepareError {
}
export declare class Instantiate extends PrepareError {
}
export declare class ProhibitedInView extends HostError {
    method_name: any;
}
export declare class InvalidMethodName extends HostError {
}
export declare class BadUTF8 extends HostError {
}
export declare class BalanceExceeded extends HostError {
}
export declare class LinkError extends FunctionExecError {
    msg: any;
}
export declare class InvalidPublicKey extends HostError {
}
export declare class InvalidTx extends TxExecutionError {
}
export declare class ActorNoPermission extends Action {
    actor_id: any;
    account_id: any;
}
export declare class RentUnpaid extends InvalidTx {
    account_id: any;
    amount: any;
}
export declare class InvalidAccessKey extends InvalidTx {
}
export declare class ReceiverMismatch extends InvalidAccessKey {
    ak_receiver: any;
    tx_receiver: any;
}
export declare class CostOverflow extends InvalidTx {
}
export declare class InvalidSignature extends InvalidTx {
}
export declare class AccessKeyNotFound extends InvalidAccessKey {
    account_id: any;
    public_key: any;
}
export declare class NotEnoughBalance extends InvalidTx {
    balance: any;
    cost: any;
    signer_id: any;
}
export declare class NotEnoughAllowance extends InvalidAccessKey {
    account_id: any;
    allowance: any;
    cost: any;
    public_key: any;
}
export declare class Expired extends InvalidTx {
}
export declare class DeleteAccountStaking extends Action {
    account_id: any;
}
export declare class SignerDoesNotExist extends InvalidTx {
    signer_id: any;
}
export declare class TriesToStake extends Action {
    stake: any;
    locked: any;
    account_id: any;
    balance: any;
}
export declare class AddKeyAlreadyExists extends Action {
    account_id: any;
    public_key: any;
}
export declare class InvalidSigner extends InvalidTx {
    signer_id: any;
}
export declare class CreateAccountNotAllowed extends Action {
    account_id: any;
    predecessor_id: any;
}
export declare class ActionError extends InvalidAccessKey {
}
export declare class TriesToUnstake extends Action {
    account_id: any;
}
export declare class InvalidNonce extends InvalidTx {
    ak_nonce: any;
    tx_nonce: any;
}
export declare class AccountAlreadyExists extends Action {
    account_id: any;
}
export declare class InvalidChain extends InvalidTx {
}
export declare class AccountDoesNotExist extends Action {
    account_id: any;
}
export declare class MethodNameMismatch extends InvalidAccessKey {
    method_name: any;
}
export declare class DeleteAccountHasRent extends Action {
    account_id: any;
    balance: any;
}
export declare class InvalidReceiver extends InvalidTx {
    receiver_id: any;
}
export declare class DeleteKeyDoesNotExist extends Action {
    account_id: any;
    public_key: any;
}
export declare class Timeout extends ServerError {
}
export declare class Closed extends ServerError {
}
