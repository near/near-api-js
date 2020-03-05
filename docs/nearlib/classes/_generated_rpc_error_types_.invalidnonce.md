---
id: "_generated_rpc_error_types_.invalidnonce"
title: "InvalidNonce"
sidebar_label: "InvalidNonce"
---

## Hierarchy

  ↳ [InvalidTxError](_generated_rpc_error_types_.invalidtxerror.md)

  ↳ **InvalidNonce**

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.invalidnonce.md#constructor)

### Properties

* [ak_nonce](_generated_rpc_error_types_.invalidnonce.md#ak_nonce)
* [message](_generated_rpc_error_types_.invalidnonce.md#message)
* [name](_generated_rpc_error_types_.invalidnonce.md#name)
* [stack](_generated_rpc_error_types_.invalidnonce.md#optional-stack)
* [tx_nonce](_generated_rpc_error_types_.invalidnonce.md#tx_nonce)
* [type](_generated_rpc_error_types_.invalidnonce.md#type)

## Constructors

###  constructor

\+ **new InvalidNonce**(`message?`: string, `type?`: string): *[InvalidNonce](_generated_rpc_error_types_.invalidnonce.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/utils/errors.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[InvalidNonce](_generated_rpc_error_types_.invalidnonce.md)*

## Properties

###  ak_nonce

• **ak_nonce**: *any*

*Defined in [src.ts/generated/rpc_error_types.ts:264](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/generated/rpc_error_types.ts#L264)*

___

###  message

• **message**: *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[message](_utils_serialize_.borsherror.md#message)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:974

___

###  name

• **name**: *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[name](_utils_serialize_.borsherror.md#name)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:973

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[stack](_utils_serialize_.borsherror.md#optional-stack)*

Defined in node_modules/typedoc/node_modules/typescript/lib/lib.es5.d.ts:975

___

###  tx_nonce

• **tx_nonce**: *any*

*Defined in [src.ts/generated/rpc_error_types.ts:265](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/generated/rpc_error_types.ts#L265)*

___

###  type

• **type**: *string*

*Inherited from [TypedError](_utils_errors_.typederror.md).[type](_utils_errors_.typederror.md#type)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/utils/errors.ts#L14)*
