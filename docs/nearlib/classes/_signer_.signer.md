---
id: "_signer_.signer"
title: "Signer"
sidebar_label: "Signer"
---

General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.

## Hierarchy

* **Signer**

  ↳ [InMemorySigner](_signer_.inmemorysigner.md)

## Index

### Methods

* [createKey](_signer_.signer.md#abstract-createkey)
* [getPublicKey](_signer_.signer.md#abstract-getpublickey)
* [signMessage](_signer_.signer.md#abstract-signmessage)

## Methods

### `Abstract` createKey

▸ **createKey**(`accountId`: string, `networkId?`: string): *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

*Defined in [src.ts/signer.ts:15](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/signer.ts#L15)*

Creates new key and returns public key.

**Parameters:**

Name | Type |
------ | ------ |
`accountId` | string |
`networkId?` | string |

**Returns:** *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

___

### `Abstract` getPublicKey

▸ **getPublicKey**(`accountId?`: string, `networkId?`: string): *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

*Defined in [src.ts/signer.ts:22](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/signer.ts#L22)*

Returns public key for given account / network.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`accountId?` | string | accountId to retrieve from. |
`networkId?` | string | network for this accountId.  |

**Returns:** *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

___

### `Abstract` signMessage

▸ **signMessage**(`message`: Uint8Array, `accountId?`: string, `networkId?`: string): *Promise‹[Signature](../interfaces/_utils_key_pair_.signature.md)›*

*Defined in [src.ts/signer.ts:30](https://github.com/nearprotocol/nearlib/blob/de49029/src.ts/signer.ts#L30)*

Signs given message, by first hashing with sha256.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | Uint8Array | message to sign. |
`accountId?` | string | accountId to use for signing. |
`networkId?` | string | network for this accontId.  |

**Returns:** *Promise‹[Signature](../interfaces/_utils_key_pair_.signature.md)›*
