---
id: "_generated_rpc_error_types_.invalidaccesskeyerror"
title: "InvalidAccessKeyError"
sidebar_label: "InvalidAccessKeyError"
---

## Hierarchy

  ↳ [InvalidTxError](_generated_rpc_error_types_.invalidtxerror.md)

  ↳ **InvalidAccessKeyError**

  ↳ [AccessKeyNotFound](_generated_rpc_error_types_.accesskeynotfound.md)

  ↳ [DepositWithFunctionCall](_generated_rpc_error_types_.depositwithfunctioncall.md)

  ↳ [MethodNameMismatch](_generated_rpc_error_types_.methodnamemismatch.md)

  ↳ [NotEnoughAllowance](_generated_rpc_error_types_.notenoughallowance.md)

  ↳ [ReceiverMismatch](_generated_rpc_error_types_.receivermismatch.md)

  ↳ [RequiresFullAccess](_generated_rpc_error_types_.requiresfullaccess.md)

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.invalidaccesskeyerror.md#constructor)

### Properties

* [message](_generated_rpc_error_types_.invalidaccesskeyerror.md#message)
* [name](_generated_rpc_error_types_.invalidaccesskeyerror.md#name)
* [stack](_generated_rpc_error_types_.invalidaccesskeyerror.md#optional-stack)
* [type](_generated_rpc_error_types_.invalidaccesskeyerror.md#type)

## Constructors

###  constructor

\+ **new InvalidAccessKeyError**(`message?`: string, `type?`: string): *[InvalidAccessKeyError](_generated_rpc_error_types_.invalidaccesskeyerror.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/utils/errors.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[InvalidAccessKeyError](_generated_rpc_error_types_.invalidaccesskeyerror.md)*

## Properties

###  message

• **message**: *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[message](_utils_serialize_.borsherror.md#message)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:974

___

###  name

• **name**: *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[name](_utils_serialize_.borsherror.md#name)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:973

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[stack](_utils_serialize_.borsherror.md#optional-stack)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:975

___

###  type

• **type**: *string*

*Inherited from [TypedError](_utils_errors_.typederror.md).[type](_utils_errors_.typederror.md#type)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/utils/errors.ts#L14)*
