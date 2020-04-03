---
id: "_generated_rpc_error_types_.txexecutionerror"
title: "TxExecutionError"
sidebar_label: "TxExecutionError"
---

## Hierarchy

  ↳ [ServerError](_generated_rpc_error_types_.servererror.md)

  ↳ **TxExecutionError**

  ↳ [ActionError](_generated_rpc_error_types_.actionerror.md)

  ↳ [InvalidTxError](_generated_rpc_error_types_.invalidtxerror.md)

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.txexecutionerror.md#constructor)

### Properties

* [message](_generated_rpc_error_types_.txexecutionerror.md#message)
* [name](_generated_rpc_error_types_.txexecutionerror.md#name)
* [stack](_generated_rpc_error_types_.txexecutionerror.md#optional-stack)
* [type](_generated_rpc_error_types_.txexecutionerror.md#type)

## Constructors

###  constructor

\+ **new TxExecutionError**(`message?`: string, `type?`: string): *[TxExecutionError](_generated_rpc_error_types_.txexecutionerror.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[TxExecutionError](_generated_rpc_error_types_.txexecutionerror.md)*

## Properties

###  message

• **message**: *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[message](_utils_serialize_.borsherror.md#message)*

___

###  name

• **name**: *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[name](_utils_serialize_.borsherror.md#name)*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[stack](_utils_serialize_.borsherror.md#optional-stack)*

___

###  type

• **type**: *string*

*Inherited from [TypedError](_utils_errors_.typederror.md).[type](_utils_errors_.typederror.md#type)*
