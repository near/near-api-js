---
id: "_generated_rpc_error_types_.functionexecerror"
title: "FunctionExecError"
sidebar_label: "FunctionExecError"
---

## Hierarchy

  ↳ [FunctionCall](_generated_rpc_error_types_.functioncall.md)

  ↳ **FunctionExecError**

  ↳ [HostError](_generated_rpc_error_types_.hosterror.md)

  ↳ [CompilationError](_generated_rpc_error_types_.compilationerror.md)

  ↳ [LinkError](_generated_rpc_error_types_.linkerror.md)

  ↳ [ResolveError](_generated_rpc_error_types_.resolveerror.md)

  ↳ [WasmTrap](_generated_rpc_error_types_.wasmtrap.md)

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.functionexecerror.md#constructor)

### Properties

* [index](_generated_rpc_error_types_.functionexecerror.md#index)
* [message](_generated_rpc_error_types_.functionexecerror.md#message)
* [name](_generated_rpc_error_types_.functionexecerror.md#name)
* [stack](_generated_rpc_error_types_.functionexecerror.md#optional-stack)
* [type](_generated_rpc_error_types_.functionexecerror.md#type)

## Constructors

###  constructor

\+ **new FunctionExecError**(`message?`: string, `type?`: string): *[FunctionExecError](_generated_rpc_error_types_.functionexecerror.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/errors.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[FunctionExecError](_generated_rpc_error_types_.functionexecerror.md)*

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
