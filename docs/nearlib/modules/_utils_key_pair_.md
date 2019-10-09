---
id: "_utils_key_pair_"
title: "utils/key_pair"
sidebar_label: "utils/key_pair"
---

## Index

### Enumerations

* [KeyType](../enums/_utils_key_pair_.keytype.md)

### Classes

* [KeyPair](../classes/_utils_key_pair_.keypair.md)
* [KeyPairEd25519](../classes/_utils_key_pair_.keypaired25519.md)
* [PublicKey](../classes/_utils_key_pair_.publickey.md)

### Interfaces

* [Signature](../interfaces/_utils_key_pair_.signature.md)

### Type aliases

* [Arrayish](_utils_key_pair_.md#arrayish)

### Functions

* [key_type_to_str](_utils_key_pair_.md#key_type_to_str)
* [str_to_key_type](_utils_key_pair_.md#str_to_key_type)

## Type aliases

###  Arrayish

Ƭ **Arrayish**: *string | ArrayLike‹number›*

*Defined in [utils/key_pair.ts:6](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/key_pair.ts#L6)*

## Functions

###  key_type_to_str

▸ **key_type_to_str**(`keyType`: [KeyType](../enums/_utils_key_pair_.keytype.md)): *String*

*Defined in [utils/key_pair.ts:18](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/key_pair.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`keyType` | [KeyType](../enums/_utils_key_pair_.keytype.md) |

**Returns:** *String*

___

###  str_to_key_type

▸ **str_to_key_type**(`keyType`: string): *[KeyType](../enums/_utils_key_pair_.keytype.md)*

*Defined in [utils/key_pair.ts:25](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/key_pair.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`keyType` | string |

**Returns:** *[KeyType](../enums/_utils_key_pair_.keytype.md)*
