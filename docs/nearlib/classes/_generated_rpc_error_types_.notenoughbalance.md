---
id: "_generated_rpc_error_types_.notenoughbalance"
title: "NotEnoughBalance"
sidebar_label: "NotEnoughBalance"
---

## Hierarchy

  ↳ [InvalidTxError](_generated_rpc_error_types_.invalidtxerror.md)

  ↳ **NotEnoughBalance**

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.notenoughbalance.md#constructor)

### Properties

* [balance](_generated_rpc_error_types_.notenoughbalance.md#balance)
* [cost](_generated_rpc_error_types_.notenoughbalance.md#cost)
* [message](_generated_rpc_error_types_.notenoughbalance.md#message)
* [name](_generated_rpc_error_types_.notenoughbalance.md#name)
* [signer_id](_generated_rpc_error_types_.notenoughbalance.md#signer_id)
* [stack](_generated_rpc_error_types_.notenoughbalance.md#optional-stack)
* [type](_generated_rpc_error_types_.notenoughbalance.md#type)

## Constructors

###  constructor

\+ **new NotEnoughBalance**(`message?`: string, `type?`: string): *[NotEnoughBalance](_generated_rpc_error_types_.notenoughbalance.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/utils/errors.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[NotEnoughBalance](_generated_rpc_error_types_.notenoughbalance.md)*

## Properties

###  balance

• **balance**: *any*

*Defined in [src.ts/generated/rpc_error_types.ts:291](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/generated/rpc_error_types.ts#L291)*

___

###  cost

• **cost**: *any*

*Defined in [src.ts/generated/rpc_error_types.ts:292](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/generated/rpc_error_types.ts#L292)*

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

###  signer_id

• **signer_id**: *any*

*Defined in [src.ts/generated/rpc_error_types.ts:293](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/generated/rpc_error_types.ts#L293)*

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
