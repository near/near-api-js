---
id: "_generated_rpc_error_types_.receivermismatch"
title: "ReceiverMismatch"
sidebar_label: "ReceiverMismatch"
---

## Hierarchy

  ↳ [InvalidAccessKeyError](_generated_rpc_error_types_.invalidaccesskeyerror.md)

  ↳ **ReceiverMismatch**

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.receivermismatch.md#constructor)

### Properties

* [ak_receiver](_generated_rpc_error_types_.receivermismatch.md#ak_receiver)
* [message](_generated_rpc_error_types_.receivermismatch.md#message)
* [name](_generated_rpc_error_types_.receivermismatch.md#name)
* [stack](_generated_rpc_error_types_.receivermismatch.md#optional-stack)
* [tx_receiver](_generated_rpc_error_types_.receivermismatch.md#tx_receiver)
* [type](_generated_rpc_error_types_.receivermismatch.md#type)

## Constructors

###  constructor

\+ **new ReceiverMismatch**(`message?`: string, `type?`: string): *[ReceiverMismatch](_generated_rpc_error_types_.receivermismatch.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[ReceiverMismatch](_generated_rpc_error_types_.receivermismatch.md)*

## Properties

###  ak_receiver

• **ak_receiver**: *any*

___

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

###  tx_receiver

• **tx_receiver**: *any*

___

###  type

• **type**: *string*

*Inherited from [TypedError](_utils_errors_.typederror.md).[type](_utils_errors_.typederror.md#type)*
