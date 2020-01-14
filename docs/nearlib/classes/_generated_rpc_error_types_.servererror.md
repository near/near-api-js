---
id: "_generated_rpc_error_types_.servererror"
title: "ServerError"
sidebar_label: "ServerError"
---

## Hierarchy

  ↳ [TypedError](_utils_errors_.typederror.md)

  ↳ **ServerError**

  ↳ [TxExecutionError](_generated_rpc_error_types_.txexecutionerror.md)

  ↳ [Closed](_generated_rpc_error_types_.closed.md)

  ↳ [Timeout](_generated_rpc_error_types_.timeout.md)

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.servererror.md#constructor)

### Properties

* [message](_generated_rpc_error_types_.servererror.md#message)
* [name](_generated_rpc_error_types_.servererror.md#name)
* [stack](_generated_rpc_error_types_.servererror.md#optional-stack)
* [type](_generated_rpc_error_types_.servererror.md#type)

## Constructors

###  constructor

\+ **new ServerError**(`message?`: string, `type?`: string): *[ServerError](_generated_rpc_error_types_.servererror.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/errors.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[ServerError](_generated_rpc_error_types_.servererror.md)*

## Properties

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
