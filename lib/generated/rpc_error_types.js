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
class WasmTrap extends FunctionCallError {
}
exports.WasmTrap = WasmTrap;
class BreakpointTrap extends WasmTrap {
}
exports.BreakpointTrap = BreakpointTrap;
class CacheError extends errors_1.TypedError {
}
exports.CacheError = CacheError;
class CallIndirectOOB extends WasmTrap {
}
exports.CallIndirectOOB = CallIndirectOOB;
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
class Deprecated extends HostError {
}
exports.Deprecated = Deprecated;
class PrepareError extends CompilationError {
}
exports.PrepareError = PrepareError;
class Deserialization extends PrepareError {
}
exports.Deserialization = Deserialization;
class DeserializationError extends CacheError {
}
exports.DeserializationError = DeserializationError;
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
class GenericTrap extends WasmTrap {
}
exports.GenericTrap = GenericTrap;
class GuestPanic extends HostError {
}
exports.GuestPanic = GuestPanic;
class IllegalArithmetic extends WasmTrap {
}
exports.IllegalArithmetic = IllegalArithmetic;
class IncorrectCallIndirectSignature extends WasmTrap {
}
exports.IncorrectCallIndirectSignature = IncorrectCallIndirectSignature;
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
class MemoryOutOfBounds extends WasmTrap {
}
exports.MemoryOutOfBounds = MemoryOutOfBounds;
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
class MisalignedAtomicAccess extends WasmTrap {
}
exports.MisalignedAtomicAccess = MisalignedAtomicAccess;
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
class ReadError extends CacheError {
}
exports.ReadError = ReadError;
class ReturnedValueLengthExceeded extends HostError {
}
exports.ReturnedValueLengthExceeded = ReturnedValueLengthExceeded;
class Serialization extends PrepareError {
}
exports.Serialization = Serialization;
class SerializationError extends CacheError {
}
exports.SerializationError = SerializationError;
class StackHeightInstrumentation extends PrepareError {
}
exports.StackHeightInstrumentation = StackHeightInstrumentation;
class StackOverflow extends WasmTrap {
}
exports.StackOverflow = StackOverflow;
class TotalLogLengthExceeded extends HostError {
}
exports.TotalLogLengthExceeded = TotalLogLengthExceeded;
class Unreachable extends WasmTrap {
}
exports.Unreachable = Unreachable;
class ValueLengthExceeded extends HostError {
}
exports.ValueLengthExceeded = ValueLengthExceeded;
class WasmUnknownError extends FunctionCallError {
}
exports.WasmUnknownError = WasmUnknownError;
class WasmerCompileError extends CompilationError {
}
exports.WasmerCompileError = WasmerCompileError;
class WriteError extends CacheError {
}
exports.WriteError = WriteError;
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
class ActionsValidationError extends errors_1.TypedError {
}
exports.ActionsValidationError = ActionsValidationError;
class ActorNoPermission extends ActionError {
}
exports.ActorNoPermission = ActorNoPermission;
class AddKeyAlreadyExists extends ActionError {
}
exports.AddKeyAlreadyExists = AddKeyAlreadyExists;
class AddKeyMethodNameLengthExceeded extends ActionsValidationError {
}
exports.AddKeyMethodNameLengthExceeded = AddKeyMethodNameLengthExceeded;
class AddKeyMethodNamesNumberOfBytesExceeded extends ActionsValidationError {
}
exports.AddKeyMethodNamesNumberOfBytesExceeded = AddKeyMethodNamesNumberOfBytesExceeded;
class BalanceMismatchError extends errors_1.TypedError {
}
exports.BalanceMismatchError = BalanceMismatchError;
class CostOverflow extends InvalidTxError {
}
exports.CostOverflow = CostOverflow;
class CreateAccountNotAllowed extends ActionError {
}
exports.CreateAccountNotAllowed = CreateAccountNotAllowed;
class CreateAccountOnlyByRegistrar extends ActionError {
}
exports.CreateAccountOnlyByRegistrar = CreateAccountOnlyByRegistrar;
class DeleteAccountStaking extends ActionError {
}
exports.DeleteAccountStaking = DeleteAccountStaking;
class DeleteActionMustBeFinal extends ActionsValidationError {
}
exports.DeleteActionMustBeFinal = DeleteActionMustBeFinal;
class DeleteKeyDoesNotExist extends ActionError {
}
exports.DeleteKeyDoesNotExist = DeleteKeyDoesNotExist;
class DepositWithFunctionCall extends InvalidAccessKeyError {
}
exports.DepositWithFunctionCall = DepositWithFunctionCall;
class Expired extends InvalidTxError {
}
exports.Expired = Expired;
class FunctionCallArgumentsLengthExceeded extends ActionsValidationError {
}
exports.FunctionCallArgumentsLengthExceeded = FunctionCallArgumentsLengthExceeded;
class FunctionCallMethodNameLengthExceeded extends ActionsValidationError {
}
exports.FunctionCallMethodNameLengthExceeded = FunctionCallMethodNameLengthExceeded;
class FunctionCallZeroAttachedGas extends ActionsValidationError {
}
exports.FunctionCallZeroAttachedGas = FunctionCallZeroAttachedGas;
class InsufficientStake extends ActionError {
}
exports.InsufficientStake = InsufficientStake;
class InvalidChain extends InvalidTxError {
}
exports.InvalidChain = InvalidChain;
class ReceiptValidationError extends errors_1.TypedError {
}
exports.ReceiptValidationError = ReceiptValidationError;
class InvalidDataReceiverId extends ReceiptValidationError {
}
exports.InvalidDataReceiverId = InvalidDataReceiverId;
class InvalidNonce extends InvalidTxError {
}
exports.InvalidNonce = InvalidNonce;
class InvalidPredecessorId extends ReceiptValidationError {
}
exports.InvalidPredecessorId = InvalidPredecessorId;
class InvalidReceiverId extends InvalidTxError {
}
exports.InvalidReceiverId = InvalidReceiverId;
class InvalidSignature extends InvalidTxError {
}
exports.InvalidSignature = InvalidSignature;
class InvalidSignerId extends InvalidTxError {
}
exports.InvalidSignerId = InvalidSignerId;
class LackBalanceForState extends ActionError {
}
exports.LackBalanceForState = LackBalanceForState;
class MethodNameMismatch extends InvalidAccessKeyError {
}
exports.MethodNameMismatch = MethodNameMismatch;
class NotEnoughAllowance extends InvalidAccessKeyError {
}
exports.NotEnoughAllowance = NotEnoughAllowance;
class NotEnoughBalance extends InvalidTxError {
}
exports.NotEnoughBalance = NotEnoughBalance;
class OnlyImplicitAccountCreationAllowed extends ActionError {
}
exports.OnlyImplicitAccountCreationAllowed = OnlyImplicitAccountCreationAllowed;
class ReceiverMismatch extends InvalidAccessKeyError {
}
exports.ReceiverMismatch = ReceiverMismatch;
class RequiresFullAccess extends InvalidAccessKeyError {
}
exports.RequiresFullAccess = RequiresFullAccess;
class SignerDoesNotExist extends InvalidTxError {
}
exports.SignerDoesNotExist = SignerDoesNotExist;
class TotalNumberOfActionsExceeded extends ActionsValidationError {
}
exports.TotalNumberOfActionsExceeded = TotalNumberOfActionsExceeded;
class TotalPrepaidGasExceeded extends ActionsValidationError {
}
exports.TotalPrepaidGasExceeded = TotalPrepaidGasExceeded;
class TriesToStake extends ActionError {
}
exports.TriesToStake = TriesToStake;
class TriesToUnstake extends ActionError {
}
exports.TriesToUnstake = TriesToUnstake;
class UnsuitableStakingKey extends ActionsValidationError {
}
exports.UnsuitableStakingKey = UnsuitableStakingKey;
class Closed extends ServerError {
}
exports.Closed = Closed;
class InternalError extends ServerError {
}
exports.InternalError = InternalError;
class Timeout extends ServerError {
}
exports.Timeout = Timeout;
