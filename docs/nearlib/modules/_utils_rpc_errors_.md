---
id: "_utils_rpc_errors_"
title: "utils/rpc_errors"
sidebar_label: "utils/rpc_errors"
---

## Index

### References

* [AccessKeyNotFound](_utils_rpc_errors_.md#accesskeynotfound)
* [AccountAlreadyExists](_utils_rpc_errors_.md#accountalreadyexists)
* [AccountDoesNotExist](_utils_rpc_errors_.md#accountdoesnotexist)
* [ActionError](_utils_rpc_errors_.md#actionerror)
* [ActorNoPermission](_utils_rpc_errors_.md#actornopermission)
* [AddKeyAlreadyExists](_utils_rpc_errors_.md#addkeyalreadyexists)
* [BadUTF16](_utils_rpc_errors_.md#badutf16)
* [BadUTF8](_utils_rpc_errors_.md#badutf8)
* [BalanceExceeded](_utils_rpc_errors_.md#balanceexceeded)
* [BalanceMismatchError](_utils_rpc_errors_.md#balancemismatcherror)
* [CannotAppendActionToJointPromise](_utils_rpc_errors_.md#cannotappendactiontojointpromise)
* [CannotReturnJointPromise](_utils_rpc_errors_.md#cannotreturnjointpromise)
* [Closed](_utils_rpc_errors_.md#closed)
* [CodeDoesNotExist](_utils_rpc_errors_.md#codedoesnotexist)
* [CompilationError](_utils_rpc_errors_.md#compilationerror)
* [ContractSizeExceeded](_utils_rpc_errors_.md#contractsizeexceeded)
* [CostOverflow](_utils_rpc_errors_.md#costoverflow)
* [CreateAccountNotAllowed](_utils_rpc_errors_.md#createaccountnotallowed)
* [DeleteAccountHasRent](_utils_rpc_errors_.md#deleteaccounthasrent)
* [DeleteAccountStaking](_utils_rpc_errors_.md#deleteaccountstaking)
* [DeleteKeyDoesNotExist](_utils_rpc_errors_.md#deletekeydoesnotexist)
* [DepositWithFunctionCall](_utils_rpc_errors_.md#depositwithfunctioncall)
* [Deserialization](_utils_rpc_errors_.md#deserialization)
* [EmptyMethodName](_utils_rpc_errors_.md#emptymethodname)
* [Expired](_utils_rpc_errors_.md#expired)
* [FunctionCallError](_utils_rpc_errors_.md#functioncallerror)
* [GasExceeded](_utils_rpc_errors_.md#gasexceeded)
* [GasInstrumentation](_utils_rpc_errors_.md#gasinstrumentation)
* [GasLimitExceeded](_utils_rpc_errors_.md#gaslimitexceeded)
* [GuestPanic](_utils_rpc_errors_.md#guestpanic)
* [HostError](_utils_rpc_errors_.md#hosterror)
* [Instantiate](_utils_rpc_errors_.md#instantiate)
* [IntegerOverflow](_utils_rpc_errors_.md#integeroverflow)
* [InternalMemoryDeclared](_utils_rpc_errors_.md#internalmemorydeclared)
* [InvalidAccessKeyError](_utils_rpc_errors_.md#invalidaccesskeyerror)
* [InvalidAccountId](_utils_rpc_errors_.md#invalidaccountid)
* [InvalidChain](_utils_rpc_errors_.md#invalidchain)
* [InvalidIteratorIndex](_utils_rpc_errors_.md#invaliditeratorindex)
* [InvalidMethodName](_utils_rpc_errors_.md#invalidmethodname)
* [InvalidNonce](_utils_rpc_errors_.md#invalidnonce)
* [InvalidPromiseIndex](_utils_rpc_errors_.md#invalidpromiseindex)
* [InvalidPromiseResultIndex](_utils_rpc_errors_.md#invalidpromiseresultindex)
* [InvalidPublicKey](_utils_rpc_errors_.md#invalidpublickey)
* [InvalidReceiptIndex](_utils_rpc_errors_.md#invalidreceiptindex)
* [InvalidReceiverId](_utils_rpc_errors_.md#invalidreceiverid)
* [InvalidRegisterId](_utils_rpc_errors_.md#invalidregisterid)
* [InvalidSignature](_utils_rpc_errors_.md#invalidsignature)
* [InvalidSignerId](_utils_rpc_errors_.md#invalidsignerid)
* [InvalidTxError](_utils_rpc_errors_.md#invalidtxerror)
* [IteratorWasInvalidated](_utils_rpc_errors_.md#iteratorwasinvalidated)
* [KeyLengthExceeded](_utils_rpc_errors_.md#keylengthexceeded)
* [LinkError](_utils_rpc_errors_.md#linkerror)
* [Memory](_utils_rpc_errors_.md#memory)
* [MemoryAccessViolation](_utils_rpc_errors_.md#memoryaccessviolation)
* [MethodEmptyName](_utils_rpc_errors_.md#methodemptyname)
* [MethodInvalidSignature](_utils_rpc_errors_.md#methodinvalidsignature)
* [MethodNameMismatch](_utils_rpc_errors_.md#methodnamemismatch)
* [MethodNotFound](_utils_rpc_errors_.md#methodnotfound)
* [MethodResolveError](_utils_rpc_errors_.md#methodresolveerror)
* [MethodUTF8Error](_utils_rpc_errors_.md#methodutf8error)
* [NotEnoughAllowance](_utils_rpc_errors_.md#notenoughallowance)
* [NotEnoughBalance](_utils_rpc_errors_.md#notenoughbalance)
* [NumberInputDataDependenciesExceeded](_utils_rpc_errors_.md#numberinputdatadependenciesexceeded)
* [NumberOfLogsExceeded](_utils_rpc_errors_.md#numberoflogsexceeded)
* [NumberPromisesExceeded](_utils_rpc_errors_.md#numberpromisesexceeded)
* [PrepareError](_utils_rpc_errors_.md#prepareerror)
* [ProhibitedInView](_utils_rpc_errors_.md#prohibitedinview)
* [ReceiverMismatch](_utils_rpc_errors_.md#receivermismatch)
* [RentUnpaid](_utils_rpc_errors_.md#rentunpaid)
* [RequiresFullAccess](_utils_rpc_errors_.md#requiresfullaccess)
* [ReturnedValueLengthExceeded](_utils_rpc_errors_.md#returnedvaluelengthexceeded)
* [Serialization](_utils_rpc_errors_.md#serialization)
* [ServerError](_utils_rpc_errors_.md#servererror)
* [SignerDoesNotExist](_utils_rpc_errors_.md#signerdoesnotexist)
* [StackHeightInstrumentation](_utils_rpc_errors_.md#stackheightinstrumentation)
* [Timeout](_utils_rpc_errors_.md#timeout)
* [TotalLogLengthExceeded](_utils_rpc_errors_.md#totalloglengthexceeded)
* [TriesToStake](_utils_rpc_errors_.md#triestostake)
* [TriesToUnstake](_utils_rpc_errors_.md#triestounstake)
* [TxExecutionError](_utils_rpc_errors_.md#txexecutionerror)
* [ValueLengthExceeded](_utils_rpc_errors_.md#valuelengthexceeded)
* [WasmTrap](_utils_rpc_errors_.md#wasmtrap)
* [WasmerCompileError](_utils_rpc_errors_.md#wasmercompileerror)

### Functions

* [formatError](_utils_rpc_errors_.md#formaterror)
* [isObject](_utils_rpc_errors_.md#isobject)
* [isString](_utils_rpc_errors_.md#isstring)
* [parseRpcError](_utils_rpc_errors_.md#parserpcerror)
* [walkSubtype](_utils_rpc_errors_.md#walksubtype)

## References

###  AccessKeyNotFound

• **AccessKeyNotFound**:

___

###  AccountAlreadyExists

• **AccountAlreadyExists**:

___

###  AccountDoesNotExist

• **AccountDoesNotExist**:

___

###  ActionError

• **ActionError**:

___

###  ActorNoPermission

• **ActorNoPermission**:

___

###  AddKeyAlreadyExists

• **AddKeyAlreadyExists**:

___

###  BadUTF16

• **BadUTF16**:

___

###  BadUTF8

• **BadUTF8**:

___

###  BalanceExceeded

• **BalanceExceeded**:

___

###  BalanceMismatchError

• **BalanceMismatchError**:

___

###  CannotAppendActionToJointPromise

• **CannotAppendActionToJointPromise**:

___

###  CannotReturnJointPromise

• **CannotReturnJointPromise**:

___

###  Closed

• **Closed**:

___

###  CodeDoesNotExist

• **CodeDoesNotExist**:

___

###  CompilationError

• **CompilationError**:

___

###  ContractSizeExceeded

• **ContractSizeExceeded**:

___

###  CostOverflow

• **CostOverflow**:

___

###  CreateAccountNotAllowed

• **CreateAccountNotAllowed**:

___

###  DeleteAccountHasRent

• **DeleteAccountHasRent**:

___

###  DeleteAccountStaking

• **DeleteAccountStaking**:

___

###  DeleteKeyDoesNotExist

• **DeleteKeyDoesNotExist**:

___

###  DepositWithFunctionCall

• **DepositWithFunctionCall**:

___

###  Deserialization

• **Deserialization**:

___

###  EmptyMethodName

• **EmptyMethodName**:

___

###  Expired

• **Expired**:

___

###  FunctionCallError

• **FunctionCallError**:

___

###  GasExceeded

• **GasExceeded**:

___

###  GasInstrumentation

• **GasInstrumentation**:

___

###  GasLimitExceeded

• **GasLimitExceeded**:

___

###  GuestPanic

• **GuestPanic**:

___

###  HostError

• **HostError**:

___

###  Instantiate

• **Instantiate**:

___

###  IntegerOverflow

• **IntegerOverflow**:

___

###  InternalMemoryDeclared

• **InternalMemoryDeclared**:

___

###  InvalidAccessKeyError

• **InvalidAccessKeyError**:

___

###  InvalidAccountId

• **InvalidAccountId**:

___

###  InvalidChain

• **InvalidChain**:

___

###  InvalidIteratorIndex

• **InvalidIteratorIndex**:

___

###  InvalidMethodName

• **InvalidMethodName**:

___

###  InvalidNonce

• **InvalidNonce**:

___

###  InvalidPromiseIndex

• **InvalidPromiseIndex**:

___

###  InvalidPromiseResultIndex

• **InvalidPromiseResultIndex**:

___

###  InvalidPublicKey

• **InvalidPublicKey**:

___

###  InvalidReceiptIndex

• **InvalidReceiptIndex**:

___

###  InvalidReceiverId

• **InvalidReceiverId**:

___

###  InvalidRegisterId

• **InvalidRegisterId**:

___

###  InvalidSignature

• **InvalidSignature**:

___

###  InvalidSignerId

• **InvalidSignerId**:

___

###  InvalidTxError

• **InvalidTxError**:

___

###  IteratorWasInvalidated

• **IteratorWasInvalidated**:

___

###  KeyLengthExceeded

• **KeyLengthExceeded**:

___

###  LinkError

• **LinkError**:

___

###  Memory

• **Memory**:

___

###  MemoryAccessViolation

• **MemoryAccessViolation**:

___

###  MethodEmptyName

• **MethodEmptyName**:

___

###  MethodInvalidSignature

• **MethodInvalidSignature**:

___

###  MethodNameMismatch

• **MethodNameMismatch**:

___

###  MethodNotFound

• **MethodNotFound**:

___

###  MethodResolveError

• **MethodResolveError**:

___

###  MethodUTF8Error

• **MethodUTF8Error**:

___

###  NotEnoughAllowance

• **NotEnoughAllowance**:

___

###  NotEnoughBalance

• **NotEnoughBalance**:

___

###  NumberInputDataDependenciesExceeded

• **NumberInputDataDependenciesExceeded**:

___

###  NumberOfLogsExceeded

• **NumberOfLogsExceeded**:

___

###  NumberPromisesExceeded

• **NumberPromisesExceeded**:

___

###  PrepareError

• **PrepareError**:

___

###  ProhibitedInView

• **ProhibitedInView**:

___

###  ReceiverMismatch

• **ReceiverMismatch**:

___

###  RentUnpaid

• **RentUnpaid**:

___

###  RequiresFullAccess

• **RequiresFullAccess**:

___

###  ReturnedValueLengthExceeded

• **ReturnedValueLengthExceeded**:

___

###  Serialization

• **Serialization**:

___

###  ServerError

• **ServerError**:

___

###  SignerDoesNotExist

• **SignerDoesNotExist**:

___

###  StackHeightInstrumentation

• **StackHeightInstrumentation**:

___

###  Timeout

• **Timeout**:

___

###  TotalLogLengthExceeded

• **TotalLogLengthExceeded**:

___

###  TriesToStake

• **TriesToStake**:

___

###  TriesToUnstake

• **TriesToUnstake**:

___

###  TxExecutionError

• **TxExecutionError**:

___

###  ValueLengthExceeded

• **ValueLengthExceeded**:

___

###  WasmTrap

• **WasmTrap**:

___

###  WasmerCompileError

• **WasmerCompileError**:

## Functions

###  formatError

▸ **formatError**(`errorClassName`: string, `errorData`: any): *string*

*Defined in [src.ts/utils/rpc_errors.ts:19](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/utils/rpc_errors.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`errorClassName` | string |
`errorData` | any |

**Returns:** *string*

___

###  isObject

▸ **isObject**(`n`: any): *boolean*

*Defined in [src.ts/utils/rpc_errors.ts:57](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/utils/rpc_errors.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`n` | any |

**Returns:** *boolean*

___

###  isString

▸ **isString**(`n`: any): *boolean*

*Defined in [src.ts/utils/rpc_errors.ts:61](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/utils/rpc_errors.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`n` | any |

**Returns:** *boolean*

___

###  parseRpcError

▸ **parseRpcError**(`errorObj`: Record‹string, any›): *[ServerError](../classes/_generated_rpc_error_types_.servererror.md)*

*Defined in [src.ts/utils/rpc_errors.ts:10](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/utils/rpc_errors.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`errorObj` | Record‹string, any› |

**Returns:** *[ServerError](../classes/_generated_rpc_error_types_.servererror.md)*

___

###  walkSubtype

▸ **walkSubtype**(`errorObj`: any, `schema`: any, `result`: any, `typeName`: any): *any*

*Defined in [src.ts/utils/rpc_errors.ts:26](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/utils/rpc_errors.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`errorObj` | any |
`schema` | any |
`result` | any |
`typeName` | any |

**Returns:** *any*
