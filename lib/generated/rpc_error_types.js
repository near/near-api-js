"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../utils/errors");
class ServerError extends errors_1.TypedError {
}
exports.ServerError = ServerError;
class TxExecutionError extends ServerError {
}
exports.TxExecutionError = TxExecutionError;
class ActionError extends TxExecutionError {
}
exports.ActionError = ActionError;
class FunctionCall extends ActionError {
}
exports.FunctionCall = FunctionCall;
class FunctionExecError extends FunctionCall {
}
exports.FunctionExecError = FunctionExecError;
class HostError extends FunctionExecError {
}
exports.HostError = HostError;
class InvalidIteratorIndex extends HostError {
}
exports.InvalidIteratorIndex = InvalidIteratorIndex;
class InvalidPublicKey extends HostError {
}
exports.InvalidPublicKey = InvalidPublicKey;
class CannotAppendActionToJointPromise extends HostError {
}
exports.CannotAppendActionToJointPromise = CannotAppendActionToJointPromise;
class CompilationError extends FunctionExecError {
}
exports.CompilationError = CompilationError;
class PrepareError extends CompilationError {
}
exports.PrepareError = PrepareError;
class Instantiate extends PrepareError {
}
exports.Instantiate = Instantiate;
class MemoryAccessViolation extends HostError {
}
exports.MemoryAccessViolation = MemoryAccessViolation;
class BadUTF16 extends HostError {
}
exports.BadUTF16 = BadUTF16;
class LinkError extends FunctionExecError {
}
exports.LinkError = LinkError;
class StackHeightInstrumentation extends PrepareError {
}
exports.StackHeightInstrumentation = StackHeightInstrumentation;
class WasmerCompileError extends CompilationError {
}
exports.WasmerCompileError = WasmerCompileError;
class Memory extends PrepareError {
}
exports.Memory = Memory;
class InvalidAccountId extends HostError {
}
exports.InvalidAccountId = InvalidAccountId;
class ResolveError extends FunctionExecError {
}
exports.ResolveError = ResolveError;
class InternalMemoryDeclared extends PrepareError {
}
exports.InternalMemoryDeclared = InternalMemoryDeclared;
class GasInstrumentation extends PrepareError {
}
exports.GasInstrumentation = GasInstrumentation;
class MethodUTF8Error extends ResolveError {
}
exports.MethodUTF8Error = MethodUTF8Error;
class CannotReturnJointPromise extends HostError {
}
exports.CannotReturnJointPromise = CannotReturnJointPromise;
class MethodInvalidSignature extends ResolveError {
}
exports.MethodInvalidSignature = MethodInvalidSignature;
class InvalidRegisterId extends HostError {
}
exports.InvalidRegisterId = InvalidRegisterId;
class GasExceeded extends HostError {
}
exports.GasExceeded = GasExceeded;
class Deserialization extends PrepareError {
}
exports.Deserialization = Deserialization;
class GasLimitExceeded extends HostError {
}
exports.GasLimitExceeded = GasLimitExceeded;
class BalanceExceeded extends HostError {
}
exports.BalanceExceeded = BalanceExceeded;
class Serialization extends PrepareError {
}
exports.Serialization = Serialization;
class WasmTrap extends FunctionExecError {
}
exports.WasmTrap = WasmTrap;
class ProhibitedInView extends HostError {
}
exports.ProhibitedInView = ProhibitedInView;
class MethodEmptyName extends ResolveError {
}
exports.MethodEmptyName = MethodEmptyName;
class EmptyMethodName extends HostError {
}
exports.EmptyMethodName = EmptyMethodName;
class GuestPanic extends HostError {
}
exports.GuestPanic = GuestPanic;
class InvalidMethodName extends HostError {
}
exports.InvalidMethodName = InvalidMethodName;
class MethodNotFound extends ResolveError {
}
exports.MethodNotFound = MethodNotFound;
class InvalidPromiseResultIndex extends HostError {
}
exports.InvalidPromiseResultIndex = InvalidPromiseResultIndex;
class IteratorWasInvalidated extends HostError {
}
exports.IteratorWasInvalidated = IteratorWasInvalidated;
class InvalidPromiseIndex extends HostError {
}
exports.InvalidPromiseIndex = InvalidPromiseIndex;
class BadUTF8 extends HostError {
}
exports.BadUTF8 = BadUTF8;
class InvalidReceiptIndex extends HostError {
}
exports.InvalidReceiptIndex = InvalidReceiptIndex;
class CodeDoesNotExist extends CompilationError {
}
exports.CodeDoesNotExist = CodeDoesNotExist;
class IntegerOverflow extends HostError {
}
exports.IntegerOverflow = IntegerOverflow;
class InvalidTxError extends TxExecutionError {
}
exports.InvalidTxError = InvalidTxError;
class InvalidAccessKey extends InvalidTxError {
}
exports.InvalidAccessKey = InvalidAccessKey;
class NotEnoughAllowance extends InvalidAccessKey {
}
exports.NotEnoughAllowance = NotEnoughAllowance;
class ReceiverMismatch extends InvalidAccessKey {
}
exports.ReceiverMismatch = ReceiverMismatch;
class DeleteAccountStaking extends ActionError {
}
exports.DeleteAccountStaking = DeleteAccountStaking;
class TriesToStake extends ActionError {
}
exports.TriesToStake = TriesToStake;
class InvalidReceiverId extends InvalidTxError {
}
exports.InvalidReceiverId = InvalidReceiverId;
class AccessKeyNotFound extends InvalidAccessKey {
}
exports.AccessKeyNotFound = AccessKeyNotFound;
class RentUnpaid extends InvalidTxError {
}
exports.RentUnpaid = RentUnpaid;
class Expired extends InvalidTxError {
}
exports.Expired = Expired;
class InvalidSignature extends InvalidTxError {
}
exports.InvalidSignature = InvalidSignature;
class InvalidChain extends InvalidTxError {
}
exports.InvalidChain = InvalidChain;
class MethodNameMismatch extends InvalidAccessKey {
}
exports.MethodNameMismatch = MethodNameMismatch;
class InvalidSignerId extends InvalidTxError {
}
exports.InvalidSignerId = InvalidSignerId;
class CostOverflow extends InvalidTxError {
}
exports.CostOverflow = CostOverflow;
class ActorNoPermission extends ActionError {
}
exports.ActorNoPermission = ActorNoPermission;
class DeleteKeyDoesNotExist extends ActionError {
}
exports.DeleteKeyDoesNotExist = DeleteKeyDoesNotExist;
class AddKeyAlreadyExists extends ActionError {
}
exports.AddKeyAlreadyExists = AddKeyAlreadyExists;
class DeleteAccountHasRent extends ActionError {
}
exports.DeleteAccountHasRent = DeleteAccountHasRent;
class TriesToUnstake extends ActionError {
}
exports.TriesToUnstake = TriesToUnstake;
class AccountAlreadyExists extends ActionError {
}
exports.AccountAlreadyExists = AccountAlreadyExists;
class NotEnoughBalance extends InvalidTxError {
}
exports.NotEnoughBalance = NotEnoughBalance;
class InvalidNonce extends InvalidTxError {
}
exports.InvalidNonce = InvalidNonce;
class SignerDoesNotExist extends InvalidTxError {
}
exports.SignerDoesNotExist = SignerDoesNotExist;
class AccountDoesNotExist extends ActionError {
}
exports.AccountDoesNotExist = AccountDoesNotExist;
class CreateAccountNotAllowed extends ActionError {
}
exports.CreateAccountNotAllowed = CreateAccountNotAllowed;
class Closed extends ServerError {
}
exports.Closed = Closed;
class Timeout extends ServerError {
}
exports.Timeout = Timeout;
