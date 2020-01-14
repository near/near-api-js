---
id: "_generated_rpc_error_types_.actionerror"
title: "ActionError"
sidebar_label: "ActionError"
---

## Hierarchy

  ↳ [TxExecutionError](_generated_rpc_error_types_.txexecutionerror.md)

  ↳ **ActionError**

  ↳ [FunctionCall](_generated_rpc_error_types_.functioncall.md)

  ↳ [DeleteAccountStaking](_generated_rpc_error_types_.deleteaccountstaking.md)

  ↳ [TriesToStake](_generated_rpc_error_types_.triestostake.md)

  ↳ [ActorNoPermission](_generated_rpc_error_types_.actornopermission.md)

  ↳ [DeleteKeyDoesNotExist](_generated_rpc_error_types_.deletekeydoesnotexist.md)

  ↳ [AddKeyAlreadyExists](_generated_rpc_error_types_.addkeyalreadyexists.md)

  ↳ [DeleteAccountHasRent](_generated_rpc_error_types_.deleteaccounthasrent.md)

  ↳ [TriesToUnstake](_generated_rpc_error_types_.triestounstake.md)

  ↳ [AccountAlreadyExists](_generated_rpc_error_types_.accountalreadyexists.md)

  ↳ [AccountDoesNotExist](_generated_rpc_error_types_.accountdoesnotexist.md)

  ↳ [CreateAccountNotAllowed](_generated_rpc_error_types_.createaccountnotallowed.md)

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.actionerror.md#constructor)

### Properties

* [index](_generated_rpc_error_types_.actionerror.md#index)
* [message](_generated_rpc_error_types_.actionerror.md#message)
* [name](_generated_rpc_error_types_.actionerror.md#name)
* [stack](_generated_rpc_error_types_.actionerror.md#optional-stack)
* [type](_generated_rpc_error_types_.actionerror.md#type)

## Constructors

###  constructor

\+ **new ActionError**(`message?`: string, `type?`: string): *[ActionError](_generated_rpc_error_types_.actionerror.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/errors.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[ActionError](_generated_rpc_error_types_.actionerror.md)*

## Properties

###  index

• **index**: *any*

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
