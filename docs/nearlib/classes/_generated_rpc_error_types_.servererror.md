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

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[ServerError](_generated_rpc_error_types_.servererror.md)*

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
