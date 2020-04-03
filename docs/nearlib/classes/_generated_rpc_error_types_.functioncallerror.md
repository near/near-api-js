---
id: "_generated_rpc_error_types_.functioncallerror"
title: "FunctionCallError"
sidebar_label: "FunctionCallError"
---

## Hierarchy

  ↳ [ActionError](_generated_rpc_error_types_.actionerror.md)

  ↳ **FunctionCallError**

  ↳ [HostError](_generated_rpc_error_types_.hosterror.md)

  ↳ [CompilationError](_generated_rpc_error_types_.compilationerror.md)

  ↳ [LinkError](_generated_rpc_error_types_.linkerror.md)

  ↳ [MethodResolveError](_generated_rpc_error_types_.methodresolveerror.md)

  ↳ [WasmTrap](_generated_rpc_error_types_.wasmtrap.md)

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.functioncallerror.md#constructor)

### Properties

* [index](_generated_rpc_error_types_.functioncallerror.md#index)
* [message](_generated_rpc_error_types_.functioncallerror.md#message)
* [name](_generated_rpc_error_types_.functioncallerror.md#name)
* [stack](_generated_rpc_error_types_.functioncallerror.md#optional-stack)
* [type](_generated_rpc_error_types_.functioncallerror.md#type)

## Constructors

###  constructor

\+ **new FunctionCallError**(`message?`: string, `type?`: string): *[FunctionCallError](_generated_rpc_error_types_.functioncallerror.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[FunctionCallError](_generated_rpc_error_types_.functioncallerror.md)*

## Properties

###  index

• **index**: *any*

*Inherited from [ActionError](_generated_rpc_error_types_.actionerror.md).[index](_generated_rpc_error_types_.actionerror.md#index)*

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

###  type

• **type**: *string*

*Inherited from [TypedError](_utils_errors_.typederror.md).[type](_utils_errors_.typederror.md#type)*
