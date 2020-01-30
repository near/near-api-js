---
id: "_generated_rpc_error_types_.actornopermission"
title: "ActorNoPermission"
sidebar_label: "ActorNoPermission"
---

## Hierarchy

  ↳ [ActionError](_generated_rpc_error_types_.actionerror.md)

  ↳ **ActorNoPermission**

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.actornopermission.md#constructor)

### Properties

* [account_id](_generated_rpc_error_types_.actornopermission.md#account_id)
* [actor_id](_generated_rpc_error_types_.actornopermission.md#actor_id)
* [index](_generated_rpc_error_types_.actornopermission.md#index)
* [message](_generated_rpc_error_types_.actornopermission.md#message)
* [name](_generated_rpc_error_types_.actornopermission.md#name)
* [stack](_generated_rpc_error_types_.actornopermission.md#optional-stack)
* [type](_generated_rpc_error_types_.actornopermission.md#type)

## Constructors

###  constructor

\+ **new ActorNoPermission**(`message?`: string, `type?`: string): *[ActorNoPermission](_generated_rpc_error_types_.actornopermission.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/utils/errors.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[ActorNoPermission](_generated_rpc_error_types_.actornopermission.md)*

## Properties

###  account_id

• **account_id**: *any*

*Defined in [src.ts/generated/rpc_error_types.ts:207](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/generated/rpc_error_types.ts#L207)*

___

###  actor_id

• **actor_id**: *any*

*Defined in [src.ts/generated/rpc_error_types.ts:208](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/generated/rpc_error_types.ts#L208)*

___

###  index

• **index**: *any*

*Inherited from [ActionError](_generated_rpc_error_types_.actionerror.md).[index](_generated_rpc_error_types_.actionerror.md#index)*

*Defined in [src.ts/generated/rpc_error_types.ts:10](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/generated/rpc_error_types.ts#L10)*

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

### `Optional` stack

• **stack**? : *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[stack](_utils_serialize_.borsherror.md#optional-stack)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:975

___

###  type

• **type**: *string*

*Inherited from [TypedError](_utils_errors_.typederror.md).[type](_utils_errors_.typederror.md#type)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/utils/errors.ts#L14)*
