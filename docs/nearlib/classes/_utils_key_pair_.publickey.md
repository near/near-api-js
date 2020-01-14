---
id: "_utils_key_pair_.publickey"
title: "PublicKey"
sidebar_label: "PublicKey"
---

PublicKey representation that has type and bytes of the key.

## Hierarchy

* [Assignable](_utils_enums_.assignable.md)

  ↳ **PublicKey**

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

\+ **new PublicKey**(`properties`: any): *[PublicKey](_utils_key_pair_.publickey.md)*

*Inherited from [Assignable](_utils_enums_.assignable.md).[constructor](_utils_enums_.assignable.md#constructor)*

*Defined in [src.ts/utils/enums.ts:17](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/enums.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`properties` | any |

**Returns:** *[PublicKey](_utils_key_pair_.publickey.md)*

## Properties

###  data

• **data**: *Uint8Array*

*Defined in [src.ts/utils/key_pair.ts:38](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/key_pair.ts#L38)*

___

###  keyType

• **keyType**: *[KeyType](../enums/_utils_key_pair_.keytype.md)*

*Defined in [src.ts/utils/key_pair.ts:37](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/key_pair.ts#L37)*

## Methods

###  toString

▸ **toString**(): *string*

*Defined in [src.ts/utils/key_pair.ts:58](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/key_pair.ts#L58)*

**Returns:** *string*

___

### `Static` from

▸ **from**(`value`: string | [PublicKey](_utils_key_pair_.publickey.md)): *[PublicKey](_utils_key_pair_.publickey.md)*

*Defined in [src.ts/utils/key_pair.ts:40](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/key_pair.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** *[PublicKey](_utils_key_pair_.publickey.md)*

___

### `Static` fromString

▸ **fromString**(`encodedKey`: string): *[PublicKey](_utils_key_pair_.publickey.md)*

*Defined in [src.ts/utils/key_pair.ts:47](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/key_pair.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`encodedKey` | string |

**Returns:** *[PublicKey](_utils_key_pair_.publickey.md)*
