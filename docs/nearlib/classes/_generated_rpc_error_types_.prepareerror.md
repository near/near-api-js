---
id: "_generated_rpc_error_types_.prepareerror"
title: "PrepareError"
sidebar_label: "PrepareError"
---

## Hierarchy

  ↳ [CompilationError](_generated_rpc_error_types_.compilationerror.md)

  ↳ **PrepareError**

  ↳ [Instantiate](_generated_rpc_error_types_.instantiate.md)

  ↳ [StackHeightInstrumentation](_generated_rpc_error_types_.stackheightinstrumentation.md)

  ↳ [Memory](_generated_rpc_error_types_.memory.md)

  ↳ [InternalMemoryDeclared](_generated_rpc_error_types_.internalmemorydeclared.md)

  ↳ [GasInstrumentation](_generated_rpc_error_types_.gasinstrumentation.md)

  ↳ [Deserialization](_generated_rpc_error_types_.deserialization.md)

  ↳ [Serialization](_generated_rpc_error_types_.serialization.md)

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.prepareerror.md#constructor)

### Properties

* [index](_generated_rpc_error_types_.prepareerror.md#index)
* [message](_generated_rpc_error_types_.prepareerror.md#message)
* [name](_generated_rpc_error_types_.prepareerror.md#name)
* [stack](_generated_rpc_error_types_.prepareerror.md#optional-stack)
* [type](_generated_rpc_error_types_.prepareerror.md#type)

## Constructors

###  constructor

\+ **new PrepareError**(`message?`: string, `type?`: string): *[PrepareError](_generated_rpc_error_types_.prepareerror.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/errors.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[PrepareError](_generated_rpc_error_types_.prepareerror.md)*

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
