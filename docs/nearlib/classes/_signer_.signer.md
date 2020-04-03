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

Returns public key for given account / network.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`accountId?` | string | accountId to retrieve from. |
`networkId?` | string | The targeted network. (ex. default, devnet, betanet, etc…)  |

**Returns:** *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

___

### `Abstract` signMessage

▸ **signMessage**(`message`: Uint8Array, `accountId?`: string, `networkId?`: string): *Promise‹[Signature](../interfaces/_utils_key_pair_.signature.md)›*

Signs given message, by first hashing with sha256.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | Uint8Array | message to sign. |
`accountId?` | string | accountId to use for signing. |
`networkId?` | string | The targeted network. (ex. default, devnet, betanet, etc…)  |

**Returns:** *Promise‹[Signature](../interfaces/_utils_key_pair_.signature.md)›*
