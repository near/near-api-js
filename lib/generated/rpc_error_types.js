"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerError {
}
exports.ServerError = ServerError;
class TxExecutionError extends ServerError {
}
exports.TxExecutionError = TxExecutionError;
class Action extends TxExecutionError {
}
exports.Action = Action;
class FunctionCall extends Action {
}
exports.FunctionCall = FunctionCall;
class FunctionExecError extends FunctionCall {
}
exports.FunctionExecError = FunctionExecError;
class HostError extends FunctionExecError {
}
exports.HostError = HostError;
class GasLimitExceeded extends HostError {
}
exports.GasLimitExceeded = GasLimitExceeded;
class ResolveError extends FunctionExecError {
}
exports.ResolveError = ResolveError;
class MethodEmptyName extends ResolveError {
}
exports.MethodEmptyName = MethodEmptyName;
class CompilationError extends FunctionExecError {
}
exports.CompilationError = CompilationError;
class WasmerCompileError extends CompilationError {
}
exports.WasmerCompileError = WasmerCompileError;
class GuestPanic extends HostError {
}
exports.GuestPanic = GuestPanic;
class PrepareError extends CompilationError {
}
exports.PrepareError = PrepareError;
class Memory extends PrepareError {
}
exports.Memory = Memory;
class GasExceeded extends HostError {
}
exports.GasExceeded = GasExceeded;
class MethodUTF8Error extends ResolveError {
}
exports.MethodUTF8Error = MethodUTF8Error;
class BadUTF16 extends HostError {
}
exports.BadUTF16 = BadUTF16;
class WasmTrap extends FunctionExecError {
}
exports.WasmTrap = WasmTrap;
class GasInstrumentation extends PrepareError {
}
exports.GasInstrumentation = GasInstrumentation;
class InvalidPromiseIndex extends HostError {
}
exports.InvalidPromiseIndex = InvalidPromiseIndex;
class InvalidPromiseResultIndex extends HostError {
}
exports.InvalidPromiseResultIndex = InvalidPromiseResultIndex;
class Deserialization extends PrepareError {
}
exports.Deserialization = Deserialization;
class MethodNotFound extends ResolveError {
}
exports.MethodNotFound = MethodNotFound;
class InvalidRegisterId extends HostError {
}
exports.InvalidRegisterId = InvalidRegisterId;
class InvalidReceiptIndex extends HostError {
}
exports.InvalidReceiptIndex = InvalidReceiptIndex;
class EmptyMethodName extends HostError {
}
exports.EmptyMethodName = EmptyMethodName;
class CannotReturnJointPromise extends HostError {
}
exports.CannotReturnJointPromise = CannotReturnJointPromise;
class StackHeightInstrumentation extends PrepareError {
}
exports.StackHeightInstrumentation = StackHeightInstrumentation;
class CodeDoesNotExist extends CompilationError {
}
exports.CodeDoesNotExist = CodeDoesNotExist;
class MethodInvalidSignature extends ResolveError {
}
exports.MethodInvalidSignature = MethodInvalidSignature;
class IntegerOverflow extends HostError {
}
exports.IntegerOverflow = IntegerOverflow;
class MemoryAccessViolation extends HostError {
}
exports.MemoryAccessViolation = MemoryAccessViolation;
class InvalidIteratorIndex extends HostError {
}
exports.InvalidIteratorIndex = InvalidIteratorIndex;
class IteratorWasInvalidated extends HostError {
}
exports.IteratorWasInvalidated = IteratorWasInvalidated;
class InvalidAccountId extends HostError {
}
exports.InvalidAccountId = InvalidAccountId;
class Serialization extends PrepareError {
}
exports.Serialization = Serialization;
class CannotAppendActionToJointPromise extends HostError {
}
exports.CannotAppendActionToJointPromise = CannotAppendActionToJointPromise;
class InternalMemoryDeclared extends PrepareError {
}
exports.InternalMemoryDeclared = InternalMemoryDeclared;
class Instantiate extends PrepareError {
}
exports.Instantiate = Instantiate;
class ProhibitedInView extends HostError {
}
exports.ProhibitedInView = ProhibitedInView;
class InvalidMethodName extends HostError {
}
exports.InvalidMethodName = InvalidMethodName;
class BadUTF8 extends HostError {
}
exports.BadUTF8 = BadUTF8;
class BalanceExceeded extends HostError {
}
exports.BalanceExceeded = BalanceExceeded;
class LinkError extends FunctionExecError {
}
exports.LinkError = LinkError;
class InvalidPublicKey extends HostError {
}
exports.InvalidPublicKey = InvalidPublicKey;
class InvalidTx extends TxExecutionError {
}
exports.InvalidTx = InvalidTx;
class ActorNoPermission extends Action {
}
exports.ActorNoPermission = ActorNoPermission;
class RentUnpaid extends InvalidTx {
}
exports.RentUnpaid = RentUnpaid;
class InvalidAccessKey extends InvalidTx {
}
exports.InvalidAccessKey = InvalidAccessKey;
class ReceiverMismatch extends InvalidAccessKey {
}
exports.ReceiverMismatch = ReceiverMismatch;
class CostOverflow extends InvalidTx {
}
exports.CostOverflow = CostOverflow;
class InvalidSignature extends InvalidTx {
}
exports.InvalidSignature = InvalidSignature;
class AccessKeyNotFound extends InvalidAccessKey {
}
exports.AccessKeyNotFound = AccessKeyNotFound;
class NotEnoughBalance extends InvalidTx {
}
exports.NotEnoughBalance = NotEnoughBalance;
class NotEnoughAllowance extends InvalidAccessKey {
}
exports.NotEnoughAllowance = NotEnoughAllowance;
class Expired extends InvalidTx {
}
exports.Expired = Expired;
class DeleteAccountStaking extends Action {
}
exports.DeleteAccountStaking = DeleteAccountStaking;
class SignerDoesNotExist extends InvalidTx {
}
exports.SignerDoesNotExist = SignerDoesNotExist;
class TriesToStake extends Action {
}
exports.TriesToStake = TriesToStake;
class AddKeyAlreadyExists extends Action {
}
exports.AddKeyAlreadyExists = AddKeyAlreadyExists;
class InvalidSigner extends InvalidTx {
}
exports.InvalidSigner = InvalidSigner;
class CreateAccountNotAllowed extends Action {
}
exports.CreateAccountNotAllowed = CreateAccountNotAllowed;
class ActionError extends InvalidAccessKey {
}
exports.ActionError = ActionError;
class TriesToUnstake extends Action {
}
exports.TriesToUnstake = TriesToUnstake;
class InvalidNonce extends InvalidTx {
}
exports.InvalidNonce = InvalidNonce;
class AccountAlreadyExists extends Action {
}
exports.AccountAlreadyExists = AccountAlreadyExists;
class InvalidChain extends InvalidTx {
}
exports.InvalidChain = InvalidChain;
class AccountDoesNotExist extends Action {
}
exports.AccountDoesNotExist = AccountDoesNotExist;
class MethodNameMismatch extends InvalidAccessKey {
}
exports.MethodNameMismatch = MethodNameMismatch;
class DeleteAccountHasRent extends Action {
}
exports.DeleteAccountHasRent = DeleteAccountHasRent;
class InvalidReceiver extends InvalidTx {
}
exports.InvalidReceiver = InvalidReceiver;
class DeleteKeyDoesNotExist extends Action {
}
exports.DeleteKeyDoesNotExist = DeleteKeyDoesNotExist;
class Timeout extends ServerError {
}
exports.Timeout = Timeout;
class Closed extends ServerError {
}
exports.Closed = Closed;
