---
id: "_generated_rpc_error_types_.actionerror"
title: "ActionError"
sidebar_label: "ActionError"
---

## Hierarchy

  ↳ [TxExecutionError](_generated_rpc_error_types_.txexecutionerror.md)

  ↳ **ActionError**

  ↳ [FunctionCallError](_generated_rpc_error_types_.functioncallerror.md)

  ↳ [AccountAlreadyExists](_generated_rpc_error_types_.accountalreadyexists.md)

  ↳ [AccountDoesNotExist](_generated_rpc_error_types_.accountdoesnotexist.md)

  ↳ [ActorNoPermission](_generated_rpc_error_types_.actornopermission.md)

  ↳ [AddKeyAlreadyExists](_generated_rpc_error_types_.addkeyalreadyexists.md)

  ↳ [CreateAccountNotAllowed](_generated_rpc_error_types_.createaccountnotallowed.md)

  ↳ [DeleteAccountStaking](_generated_rpc_error_types_.deleteaccountstaking.md)

  ↳ [DeleteKeyDoesNotExist](_generated_rpc_error_types_.deletekeydoesnotexist.md)

  ↳ [TriesToStake](_generated_rpc_error_types_.triestostake.md)

  ↳ [TriesToUnstake](_generated_rpc_error_types_.triestounstake.md)

  ↳ [UnsuitableStakingKey](_generated_rpc_error_types_.unsuitablestakingkey.md)

  ↳ [LackBalanceForState](_generated_rpc_error_types_.lackbalanceforstate.md)

  ↳ [DeleteAccountHasEnoughBalance](_generated_rpc_error_types_.deleteaccounthasenoughbalance.md)

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

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[ActionError](_generated_rpc_error_types_.actionerror.md)*

## Properties

###  index

• **index**: *any*

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
