---
id: "_utils_errors_.typederror"
title: "TypedError"
sidebar_label: "TypedError"
---

## Hierarchy

* [Error](_utils_serialize_.borsherror.md#static-error)

  ↳ **TypedError**

  ↳ [ServerError](_generated_rpc_error_types_.servererror.md)

  ↳ [BalanceMismatchError](_generated_rpc_error_types_.balancemismatcherror.md)

  ↳ [DeleteAccountHasRent](_generated_rpc_error_types_.deleteaccounthasrent.md)

  ↳ [RentUnpaid](_generated_rpc_error_types_.rentunpaid.md)

## Index

### Constructors

* [constructor](_utils_errors_.typederror.md#constructor)

### Properties

* [message](_utils_errors_.typederror.md#message)
* [name](_utils_errors_.typederror.md#name)
* [stack](_utils_errors_.typederror.md#optional-stack)
* [type](_utils_errors_.typederror.md#type)
* [Error](_utils_errors_.typederror.md#static-error)

## Constructors

###  constructor

\+ **new TypedError**(`message?`: string, `type?`: string): *[TypedError](_utils_errors_.typederror.md)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[TypedError](_utils_errors_.typederror.md)*

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

___

### `Static` Error

▪ **Error**: *ErrorConstructor*
