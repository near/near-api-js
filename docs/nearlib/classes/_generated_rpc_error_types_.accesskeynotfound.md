---
id: "_generated_rpc_error_types_.accesskeynotfound"
title: "AccessKeyNotFound"
sidebar_label: "AccessKeyNotFound"
---

## Hierarchy

  ↳ [InvalidAccessKeyError](_generated_rpc_error_types_.invalidaccesskeyerror.md)

  ↳ **AccessKeyNotFound**

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.accesskeynotfound.md#constructor)

### Properties

* [account_id](_generated_rpc_error_types_.accesskeynotfound.md#account_id)
* [message](_generated_rpc_error_types_.accesskeynotfound.md#message)
* [name](_generated_rpc_error_types_.accesskeynotfound.md#name)
* [public_key](_generated_rpc_error_types_.accesskeynotfound.md#public_key)
* [stack](_generated_rpc_error_types_.accesskeynotfound.md#optional-stack)
* [type](_generated_rpc_error_types_.accesskeynotfound.md#type)

## Constructors

###  constructor

\+ **new AccessKeyNotFound**(`message?`: string, `type?`: string): *[AccessKeyNotFound](_generated_rpc_error_types_.accesskeynotfound.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/utils/errors.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[AccessKeyNotFound](_generated_rpc_error_types_.accesskeynotfound.md)*

## Properties

###  account_id

• **account_id**: *any*

*Defined in [src.ts/generated/rpc_error_types.ts:194](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/generated/rpc_error_types.ts#L194)*

___

###  message

• **message**: *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[message](_utils_serialize_.borsherror.md#message)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:974

___

###  name

• **name**: *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[name](_utils_serialize_.borsherror.md#name)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:973

___

###  public_key

• **public_key**: *any*

*Defined in [src.ts/generated/rpc_error_types.ts:195](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/generated/rpc_error_types.ts#L195)*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[stack](_utils_serialize_.borsherror.md#optional-stack)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:975

___

###  type

• **type**: *string*

*Inherited from [TypedError](_utils_errors_.typederror.md).[type](_utils_errors_.typederror.md#type)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/utils/errors.ts#L14)*
