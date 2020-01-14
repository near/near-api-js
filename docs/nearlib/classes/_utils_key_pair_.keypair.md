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

*Defined in [src.ts/utils/key_pair.ts:67](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/key_pair.ts#L67)*

**Returns:** *[PublicKey](_utils_key_pair_.publickey.md)*

___

### `Abstract` sign

▸ **sign**(`message`: Uint8Array): *[Signature](../interfaces/_utils_key_pair_.signature.md)*

*Defined in [src.ts/utils/key_pair.ts:64](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/key_pair.ts#L64)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Uint8Array |

**Returns:** *[Signature](../interfaces/_utils_key_pair_.signature.md)*

___

### `Abstract` toString

▸ **toString**(): *string*

*Defined in [src.ts/utils/key_pair.ts:66](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/key_pair.ts#L66)*

**Returns:** *string*

___

### `Abstract` verify

▸ **verify**(`message`: Uint8Array, `signature`: Uint8Array): *boolean*

*Defined in [src.ts/utils/key_pair.ts:65](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/key_pair.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Uint8Array |
`signature` | Uint8Array |

**Returns:** *boolean*

___

### `Static` fromRandom

▸ **fromRandom**(`curve`: string): *[KeyPair](_utils_key_pair_.keypair.md)*

*Defined in [src.ts/utils/key_pair.ts:69](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/key_pair.ts#L69)*

**Parameters:**

Name | Type |
------ | ------ |
`curve` | string |

**Returns:** *[KeyPair](_utils_key_pair_.keypair.md)*

___

### `Static` fromString

▸ **fromString**(`encodedKey`: string): *[KeyPair](_utils_key_pair_.keypair.md)*

*Defined in [src.ts/utils/key_pair.ts:76](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/key_pair.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`encodedKey` | string |

**Returns:** *[KeyPair](_utils_key_pair_.keypair.md)*
