---
id: "_utils_key_pair_.publickey"
title: "PublicKey"
sidebar_label: "PublicKey"
---

PublicKey representation that has type and bytes of the key.

## Hierarchy

* **PublicKey**

## Index

### Constructors

* [constructor](_utils_key_pair_.publickey.md#constructor)

### Properties

* [data](_utils_key_pair_.publickey.md#data)
* [keyType](_utils_key_pair_.publickey.md#keytype)

### Methods

* [toString](_utils_key_pair_.publickey.md#tostring)
* [from](_utils_key_pair_.publickey.md#static-from)
* [fromString](_utils_key_pair_.publickey.md#static-fromstring)

## Constructors

###  constructor

\+ **new PublicKey**(`keyType`: [KeyType](../enums/_utils_key_pair_.keytype.md), `data`: Uint8Array): *[PublicKey](_utils_key_pair_.publickey.md)*

*Defined in [utils/key_pair.ts:37](https://github.com/nearprotocol/nearlib/blob/8f79950/src.ts/utils/key_pair.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`keyType` | [KeyType](../enums/_utils_key_pair_.keytype.md) |
`data` | Uint8Array |

**Returns:** *[PublicKey](_utils_key_pair_.publickey.md)*

## Properties

###  data

• **data**: *Uint8Array*

*Defined in [utils/key_pair.ts:37](https://github.com/nearprotocol/nearlib/blob/8f79950/src.ts/utils/key_pair.ts#L37)*

___

###  keyType

• **keyType**: *[KeyType](../enums/_utils_key_pair_.keytype.md)*

*Defined in [utils/key_pair.ts:36](https://github.com/nearprotocol/nearlib/blob/8f79950/src.ts/utils/key_pair.ts#L36)*

## Methods

###  toString

▸ **toString**(): *string*

*Defined in [utils/key_pair.ts:62](https://github.com/nearprotocol/nearlib/blob/8f79950/src.ts/utils/key_pair.ts#L62)*

**Returns:** *string*

___

### `Static` from

▸ **from**(`value`: string | [PublicKey](_utils_key_pair_.publickey.md)): *[PublicKey](_utils_key_pair_.publickey.md)*

*Defined in [utils/key_pair.ts:44](https://github.com/nearprotocol/nearlib/blob/8f79950/src.ts/utils/key_pair.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** *[PublicKey](_utils_key_pair_.publickey.md)*

___

### `Static` fromString

▸ **fromString**(`encodedKey`: string): *[PublicKey](_utils_key_pair_.publickey.md)*

*Defined in [utils/key_pair.ts:51](https://github.com/nearprotocol/nearlib/blob/8f79950/src.ts/utils/key_pair.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`encodedKey` | string |

**Returns:** *[PublicKey](_utils_key_pair_.publickey.md)*
