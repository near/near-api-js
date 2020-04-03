---
id: "_utils_key_pair_.keypair"
title: "KeyPair"
sidebar_label: "KeyPair"
---

## Hierarchy

* **KeyPair**

  ↳ [KeyPairEd25519](_utils_key_pair_.keypaired25519.md)

## Index

### Methods

* [getPublicKey](_utils_key_pair_.keypair.md#abstract-getpublickey)
* [sign](_utils_key_pair_.keypair.md#abstract-sign)
* [toString](_utils_key_pair_.keypair.md#abstract-tostring)
* [verify](_utils_key_pair_.keypair.md#abstract-verify)
* [fromRandom](_utils_key_pair_.keypair.md#static-fromrandom)
* [fromString](_utils_key_pair_.keypair.md#static-fromstring)

## Methods

### `Abstract` getPublicKey

▸ **getPublicKey**(): *[PublicKey](_utils_key_pair_.publickey.md)*

**Returns:** *[PublicKey](_utils_key_pair_.publickey.md)*

___

### `Abstract` sign

▸ **sign**(`message`: Uint8Array): *[Signature](../interfaces/_utils_key_pair_.signature.md)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Uint8Array |

**Returns:** *[Signature](../interfaces/_utils_key_pair_.signature.md)*

___

### `Abstract` toString

▸ **toString**(): *string*

**Returns:** *string*

___

### `Abstract` verify

▸ **verify**(`message`: Uint8Array, `signature`: Uint8Array): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Uint8Array |
`signature` | Uint8Array |

**Returns:** *boolean*

___

### `Static` fromRandom

▸ **fromRandom**(`curve`: string): *[KeyPair](_utils_key_pair_.keypair.md)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`curve` | string | Name of elliptical curve, case-insensitive |

**Returns:** *[KeyPair](_utils_key_pair_.keypair.md)*

Random KeyPair based on the curve

___

### `Static` fromString

▸ **fromString**(`encodedKey`: string): *[KeyPair](_utils_key_pair_.keypair.md)*

**Parameters:**

Name | Type |
------ | ------ |
`encodedKey` | string |

**Returns:** *[KeyPair](_utils_key_pair_.keypair.md)*
