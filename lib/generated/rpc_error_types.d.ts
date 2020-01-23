import { TypedError } from "../utils/errors";
export declare class ServerError extends TypedError {
}
export declare class TxExecutionError extends ServerError {
}
export declare class ActionError extends TxExecutionError {
    index: any;
}
export declare class FunctionCall extends ActionError {
}
export declare class FunctionExecError extends FunctionCall {
}
export declare class HostError extends FunctionExecError {
}
export declare class InvalidIteratorIndex extends HostError {
    iterator_index: any;
}
export declare class InvalidPublicKey extends HostError {
}
export declare class CannotAppendActionToJointPromise extends HostError {
}
export declare class CompilationError extends FunctionExecError {
}
export declare class PrepareError extends CompilationError {
}
export declare class Instantiate extends PrepareError {
}
export declare class MemoryAccessViolation extends HostError {
}
export declare class BadUTF16 extends HostError {
}
export declare class LinkError extends FunctionExecError {
    msg: any;
}
export declare class StackHeightInstrumentation extends PrepareError {
}
export declare class WasmerCompileError extends CompilationError {
    msg: any;
}
export declare class Memory extends PrepareError {
}
export declare class InvalidAccountId extends HostError {
}
export declare class ResolveError extends FunctionExecError {
}
export declare class InternalMemoryDeclared extends PrepareError {
}
export declare class GasInstrumentation extends PrepareError {
}
export declare class MethodUTF8Error extends ResolveError {
}
export declare class CannotReturnJointPromise extends HostError {
}
export declare class MethodInvalidSignature extends ResolveError {
}
export declare class InvalidRegisterId extends HostError {
    register_id: any;
}
export declare class GasExceeded extends HostError {
}
export declare class Deserialization extends PrepareError {
}
export declare class GasLimitExceeded extends HostError {
}
export declare class BalanceExceeded extends HostError {
}
export declare class Serialization extends PrepareError {
}
export declare class WasmTrap extends FunctionExecError {
    msg: any;
}
export declare class ProhibitedInView extends HostError {
    method_name: any;
}
export declare class MethodEmptyName extends ResolveError {
}
export declare class EmptyMethodName extends HostError {
}
export declare class GuestPanic extends HostError {
    panic_msg: any;
}
export declare class InvalidMethodName extends HostError {
}
export declare class MethodNotFound extends ResolveError {
}
export declare class InvalidPromiseResultIndex extends HostError {
    result_idx: any;
}
export declare class IteratorWasInvalidated extends HostError {
    iterator_index: any;
}
export declare class InvalidPromiseIndex extends HostError {
    promise_idx: any;
}
export declare class BadUTF8 extends HostError {
}
export declare class InvalidReceiptIndex extends HostError {
    receipt_index: any;
}
export declare class CodeDoesNotExist extends CompilationError {
    account_id: any;
}
export declare class IntegerOverflow extends HostError {
}
export declare class InvalidTxError extends TxExecutionError {
}
export declare class InvalidAccessKey extends InvalidTxError {
}
export declare class NotEnoughAllowance extends InvalidAccessKey {
    public_key: any;
    allowance: any;
    account_id: any;
    cost: any;
}
export declare class ReceiverMismatch extends InvalidAccessKey {
    ak_receiver: any;
    tx_receiver: any;
}
export declare class DeleteAccountStaking extends ActionError {
    account_id: any;
}
export declare class TriesToStake extends ActionError {
    balance: any;
    account_id: any;
    locked: any;
    stake: any;
}
export declare class InvalidReceiverId extends InvalidTxError {
    receiver_id: any;
}
export declare class AccessKeyNotFound extends InvalidAccessKey {
    public_key: any;
    account_id: any;
}
export declare class RentUnpaid extends InvalidTxError {
    amount: any;
    account_id: any;
}
export declare class Expired extends InvalidTxError {
}
export declare class InvalidSignature extends InvalidTxError {
}
export declare class InvalidChain extends InvalidTxError {
}
export declare class MethodNameMismatch extends InvalidAccessKey {
    method_name: any;
}
export declare class InvalidSignerId extends InvalidTxError {
    signer_id: any;
}
export declare class CostOverflow extends InvalidTxError {
}
export declare class ActorNoPermission extends ActionError {
    account_id: any;
    actor_id: any;
}
export declare class DeleteKeyDoesNotExist extends ActionError {
    account_id: any;
    public_key: any;
}
export declare class AddKeyAlreadyExists extends ActionError {
    public_key: any;
    account_id: any;
}
export declare class DeleteAccountHasRent extends ActionError {
    balance: any;
    account_id: any;
}
export declare class TriesToUnstake extends ActionError {
    account_id: any;
}
export declare class AccountAlreadyExists extends ActionError {
    account_id: any;
}
export declare class NotEnoughBalance extends InvalidTxError {
    balance: any;
    signer_id: any;
    cost: any;
}
export declare class InvalidNonce extends InvalidTxError {
    ak_nonce: any;
    tx_nonce: any;
}
export declare class SignerDoesNotExist extends InvalidTxError {
    signer_id: any;
}
export declare class AccountDoesNotExist extends ActionError {
    account_id: any;
}
export declare class CreateAccountNotAllowed extends ActionError {
    predecessor_id: any;
    account_id: any;
}
export declare class Closed extends ServerError {
}
export declare class Timeout extends ServerError {
}
