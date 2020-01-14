---
id: "_generated_rpc_error_types_.hosterror"
title: "HostError"
sidebar_label: "HostError"
---

## Hierarchy

  ↳ [FunctionExecError](_generated_rpc_error_types_.functionexecerror.md)

  ↳ **HostError**

  ↳ [InvalidIteratorIndex](_generated_rpc_error_types_.invaliditeratorindex.md)

  ↳ [InvalidPublicKey](_generated_rpc_error_types_.invalidpublickey.md)

  ↳ [CannotAppendActionToJointPromise](_generated_rpc_error_types_.cannotappendactiontojointpromise.md)

  ↳ [MemoryAccessViolation](_generated_rpc_error_types_.memoryaccessviolation.md)

  ↳ [BadUTF16](_generated_rpc_error_types_.badutf16.md)

  ↳ [InvalidAccountId](_generated_rpc_error_types_.invalidaccountid.md)

  ↳ [CannotReturnJointPromise](_generated_rpc_error_types_.cannotreturnjointpromise.md)

  ↳ [InvalidRegisterId](_generated_rpc_error_types_.invalidregisterid.md)

  ↳ [GasExceeded](_generated_rpc_error_types_.gasexceeded.md)

  ↳ [GasLimitExceeded](_generated_rpc_error_types_.gaslimitexceeded.md)

  ↳ [BalanceExceeded](_generated_rpc_error_types_.balanceexceeded.md)

  ↳ [ProhibitedInView](_generated_rpc_error_types_.prohibitedinview.md)

  ↳ [EmptyMethodName](_generated_rpc_error_types_.emptymethodname.md)

  ↳ [GuestPanic](_generated_rpc_error_types_.guestpanic.md)

  ↳ [InvalidMethodName](_generated_rpc_error_types_.invalidmethodname.md)

  ↳ [InvalidPromiseResultIndex](_generated_rpc_error_types_.invalidpromiseresultindex.md)

  ↳ [IteratorWasInvalidated](_generated_rpc_error_types_.iteratorwasinvalidated.md)

  ↳ [InvalidPromiseIndex](_generated_rpc_error_types_.invalidpromiseindex.md)

  ↳ [BadUTF8](_generated_rpc_error_types_.badutf8.md)

  ↳ [InvalidReceiptIndex](_generated_rpc_error_types_.invalidreceiptindex.md)

  ↳ [IntegerOverflow](_generated_rpc_error_types_.integeroverflow.md)

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.hosterror.md#constructor)

### Properties

* [index](_generated_rpc_error_types_.hosterror.md#index)
* [message](_generated_rpc_error_types_.hosterror.md#message)
* [name](_generated_rpc_error_types_.hosterror.md#name)
* [stack](_generated_rpc_error_types_.hosterror.md#optional-stack)
* [type](_generated_rpc_error_types_.hosterror.md#type)

## Constructors

###  constructor

\+ **new HostError**(`message?`: string, `type?`: string): *[HostError](_generated_rpc_error_types_.hosterror.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/errors.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[HostError](_generated_rpc_error_types_.hosterror.md)*

## Properties

###  index

• **index**: *any*

*Inherited from [ActionError](_generated_rpc_error_types_.actionerror.md).[index](_generated_rpc_error_types_.actionerror.md#index)*

*Defined in [src.ts/generated/rpc_error_types.ts:10](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/generated/rpc_error_types.ts#L10)*

___

###  message

• **message**: *string*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:974

___

###  name

• **name**: *string*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:973

___

### `Optional` stack

• **stack**? : *string*

*Inherited from void*

*Overrides void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:975

___

###  type

• **type**: *string*

*Inherited from [TypedError](_utils_errors_.typederror.md).[type](_utils_errors_.typederror.md#type)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/errors.ts#L14)*
