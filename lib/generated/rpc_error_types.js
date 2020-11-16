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
class FunctionCallError extends ActionError {
}
exports.FunctionCallError = FunctionCallError;
class HostError extends FunctionCallError {
}
exports.HostError = HostError;
class BadUTF16 extends HostError {
}
exports.BadUTF16 = BadUTF16;
class BadUTF8 extends HostError {
}
exports.BadUTF8 = BadUTF8;
class BalanceExceeded extends HostError {
}
exports.BalanceExceeded = BalanceExceeded;
class CannotAppendActionToJointPromise extends HostError {
}
exports.CannotAppendActionToJointPromise = CannotAppendActionToJointPromise;
class CannotReturnJointPromise extends HostError {
}
exports.CannotReturnJointPromise = CannotReturnJointPromise;
class CompilationError extends FunctionCallError {
}
exports.CompilationError = CompilationError;
class CodeDoesNotExist extends CompilationError {
}
exports.CodeDoesNotExist = CodeDoesNotExist;
class ContractSizeExceeded extends HostError {
}
exports.ContractSizeExceeded = ContractSizeExceeded;
class PrepareError extends CompilationError {
}
exports.PrepareError = PrepareError;
class Deserialization extends PrepareError {
}
exports.Deserialization = Deserialization;
class EmptyMethodName extends HostError {
}
exports.EmptyMethodName = EmptyMethodName;
class GasExceeded extends HostError {
}
exports.GasExceeded = GasExceeded;
class GasInstrumentation extends PrepareError {
}
exports.GasInstrumentation = GasInstrumentation;
class GasLimitExceeded extends HostError {
}
exports.GasLimitExceeded = GasLimitExceeded;
class GuestPanic extends HostError {
}
exports.GuestPanic = GuestPanic;
class Instantiate extends PrepareError {
}
exports.Instantiate = Instantiate;
class IntegerOverflow extends HostError {
}
exports.IntegerOverflow = IntegerOverflow;
class InternalMemoryDeclared extends PrepareError {
}
exports.InternalMemoryDeclared = InternalMemoryDeclared;
class InvalidAccountId extends HostError {
}
exports.InvalidAccountId = InvalidAccountId;
class InvalidIteratorIndex extends HostError {
}
exports.InvalidIteratorIndex = InvalidIteratorIndex;
class InvalidMethodName extends HostError {
}
exports.InvalidMethodName = InvalidMethodName;
class InvalidPromiseIndex extends HostError {
}
exports.InvalidPromiseIndex = InvalidPromiseIndex;
class InvalidPromiseResultIndex extends HostError {
}
exports.InvalidPromiseResultIndex = InvalidPromiseResultIndex;
class InvalidPublicKey extends HostError {
}
exports.InvalidPublicKey = InvalidPublicKey;
class InvalidReceiptIndex extends HostError {
}
exports.InvalidReceiptIndex = InvalidReceiptIndex;
class InvalidRegisterId extends HostError {
}
exports.InvalidRegisterId = InvalidRegisterId;
class IteratorWasInvalidated extends HostError {
}
exports.IteratorWasInvalidated = IteratorWasInvalidated;
class KeyLengthExceeded extends HostError {
}
exports.KeyLengthExceeded = KeyLengthExceeded;
class LinkError extends FunctionCallError {
}
exports.LinkError = LinkError;
class Memory extends PrepareError {
}
exports.Memory = Memory;
class MemoryAccessViolation extends HostError {
}
exports.MemoryAccessViolation = MemoryAccessViolation;
class MethodResolveError extends FunctionCallError {
}
exports.MethodResolveError = MethodResolveError;
class MethodEmptyName extends MethodResolveError {
}
exports.MethodEmptyName = MethodEmptyName;
class MethodInvalidSignature extends MethodResolveError {
}
exports.MethodInvalidSignature = MethodInvalidSignature;
class MethodNotFound extends MethodResolveError {
}
exports.MethodNotFound = MethodNotFound;
class MethodUTF8Error extends MethodResolveError {
}
exports.MethodUTF8Error = MethodUTF8Error;
class NumberInputDataDependenciesExceeded extends HostError {
}
exports.NumberInputDataDependenciesExceeded = NumberInputDataDependenciesExceeded;
class NumberOfLogsExceeded extends HostError {
}
exports.NumberOfLogsExceeded = NumberOfLogsExceeded;
class NumberPromisesExceeded extends HostError {
}
exports.NumberPromisesExceeded = NumberPromisesExceeded;
class ProhibitedInView extends HostError {
}
exports.ProhibitedInView = ProhibitedInView;
class ReturnedValueLengthExceeded extends HostError {
}
exports.ReturnedValueLengthExceeded = ReturnedValueLengthExceeded;
class Serialization extends PrepareError {
}
exports.Serialization = Serialization;
class StackHeightInstrumentation extends PrepareError {
}
exports.StackHeightInstrumentation = StackHeightInstrumentation;
class TotalLogLengthExceeded extends HostError {
}
exports.TotalLogLengthExceeded = TotalLogLengthExceeded;
class ValueLengthExceeded extends HostError {
}
exports.ValueLengthExceeded = ValueLengthExceeded;
class WasmTrap extends FunctionCallError {
}
exports.WasmTrap = WasmTrap;
class WasmerCompileError extends CompilationError {
}
exports.WasmerCompileError = WasmerCompileError;
class InvalidTxError extends TxExecutionError {
}
exports.InvalidTxError = InvalidTxError;
class InvalidAccessKeyError extends InvalidTxError {
}
exports.InvalidAccessKeyError = InvalidAccessKeyError;
class AccessKeyNotFound extends InvalidAccessKeyError {
}
exports.AccessKeyNotFound = AccessKeyNotFound;
class AccountAlreadyExists extends ActionError {
}
exports.AccountAlreadyExists = AccountAlreadyExists;
class AccountDoesNotExist extends ActionError {
}
exports.AccountDoesNotExist = AccountDoesNotExist;
class ActorNoPermission extends ActionError {
}
exports.ActorNoPermission = ActorNoPermission;
class AddKeyAlreadyExists extends ActionError {
}
exports.AddKeyAlreadyExists = AddKeyAlreadyExists;
class BalanceMismatchError extends errors_1.TypedError {
}
exports.BalanceMismatchError = BalanceMismatchError;
class CostOverflow extends InvalidTxError {
}
exports.CostOverflow = CostOverflow;
class CreateAccountNotAllowed extends ActionError {
}
exports.CreateAccountNotAllowed = CreateAccountNotAllowed;
class DeleteAccountHasRent extends errors_1.TypedError {
}
exports.DeleteAccountHasRent = DeleteAccountHasRent;
class DeleteAccountStaking extends ActionError {
}
exports.DeleteAccountStaking = DeleteAccountStaking;
class DeleteKeyDoesNotExist extends ActionError {
}
exports.DeleteKeyDoesNotExist = DeleteKeyDoesNotExist;
class DepositWithFunctionCall extends InvalidAccessKeyError {
}
exports.DepositWithFunctionCall = DepositWithFunctionCall;
class Expired extends InvalidTxError {
}
exports.Expired = Expired;
class InvalidChain extends InvalidTxError {
}
exports.InvalidChain = InvalidChain;
class InvalidNonce extends InvalidTxError {
}
exports.InvalidNonce = InvalidNonce;
class InvalidReceiverId extends InvalidTxError {
}
exports.InvalidReceiverId = InvalidReceiverId;
class InvalidSignature extends InvalidTxError {
}
exports.InvalidSignature = InvalidSignature;
class InvalidSignerId extends InvalidTxError {
}
exports.InvalidSignerId = InvalidSignerId;
class MethodNameMismatch extends InvalidAccessKeyError {
}
exports.MethodNameMismatch = MethodNameMismatch;
class NotEnoughAllowance extends InvalidAccessKeyError {
}
exports.NotEnoughAllowance = NotEnoughAllowance;
class NotEnoughBalance extends InvalidTxError {
}
exports.NotEnoughBalance = NotEnoughBalance;
class ReceiverMismatch extends InvalidAccessKeyError {
}
exports.ReceiverMismatch = ReceiverMismatch;
class RentUnpaid extends errors_1.TypedError {
}
exports.RentUnpaid = RentUnpaid;
class RequiresFullAccess extends InvalidAccessKeyError {
}
exports.RequiresFullAccess = RequiresFullAccess;
class SignerDoesNotExist extends InvalidTxError {
}
exports.SignerDoesNotExist = SignerDoesNotExist;
class TriesToStake extends ActionError {
}
exports.TriesToStake = TriesToStake;
class TriesToUnstake extends ActionError {
}
exports.TriesToUnstake = TriesToUnstake;
class Closed extends ServerError {
}
exports.Closed = Closed;
class Timeout extends ServerError {
}
exports.Timeout = Timeout;
class UnsuitableStakingKey extends ActionError {
}
exports.UnsuitableStakingKey = UnsuitableStakingKey;
class LackBalanceForState extends ActionError {
}
exports.LackBalanceForState = LackBalanceForState;
class DeleteAccountHasEnoughBalance extends ActionError {
}
exports.DeleteAccountHasEnoughBalance = DeleteAccountHasEnoughBalance;
class Deprecated extends HostError {
}
exports.Deprecated = Deprecated;
