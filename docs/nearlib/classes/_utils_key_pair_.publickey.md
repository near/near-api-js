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

**Parameters:**

Name | Type |
------ | ------ |
`properties` | any |

**Returns:** *[PublicKey](_utils_key_pair_.publickey.md)*

## Properties

###  data

• **data**: *Uint8Array*

___

###  keyType

• **keyType**: *[KeyType](../enums/_utils_key_pair_.keytype.md)*

## Methods

###  toString

▸ **toString**(): *string*

**Returns:** *string*

___

### `Static` from

▸ **from**(`value`: string | [PublicKey](_utils_key_pair_.publickey.md)): *[PublicKey](_utils_key_pair_.publickey.md)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** *[PublicKey](_utils_key_pair_.publickey.md)*

___

### `Static` fromString

▸ **fromString**(`encodedKey`: string): *[PublicKey](_utils_key_pair_.publickey.md)*

**Parameters:**

Name | Type |
------ | ------ |
`encodedKey` | string |

**Returns:** *[PublicKey](_utils_key_pair_.publickey.md)*
