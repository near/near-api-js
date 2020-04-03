---
id: "_signer_.inmemorysigner"
title: "InMemorySigner"
sidebar_label: "InMemorySigner"
---

Signs using in memory key store.

## Hierarchy

* [Signer](_signer_.signer.md)

  ↳ **InMemorySigner**

## Index

### Constructors

* [constructor](_signer_.inmemorysigner.md#constructor)

### Properties

* [keyStore](_signer_.inmemorysigner.md#keystore)

### Methods

* [createKey](_signer_.inmemorysigner.md#createkey)
* [getPublicKey](_signer_.inmemorysigner.md#getpublickey)
* [signMessage](_signer_.inmemorysigner.md#signmessage)

## Constructors

###  constructor

\+ **new InMemorySigner**(`keyStore`: [KeyStore](_key_stores_keystore_.keystore.md)): *[InMemorySigner](_signer_.inmemorysigner.md)*

**Parameters:**

Name | Type |
------ | ------ |
`keyStore` | [KeyStore](_key_stores_keystore_.keystore.md) |

**Returns:** *[InMemorySigner](_signer_.inmemorysigner.md)*

## Properties

###  keyStore

• **keyStore**: *[KeyStore](_key_stores_keystore_.keystore.md)*

## Methods

###  createKey

▸ **createKey**(`accountId`: string, `networkId`: string): *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

*Overrides [Signer](_signer_.signer.md).[createKey](_signer_.signer.md#abstract-createkey)*

Creates a public key for the account given

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`accountId` | string | The NEAR account to assign a public key to |
`networkId` | string | The targeted network. (ex. default, devnet, betanet, etc…) |

**Returns:** *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

___

###  getPublicKey

▸ **getPublicKey**(`accountId?`: string, `networkId?`: string): *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

*Overrides [Signer](_signer_.signer.md).[getPublicKey](_signer_.signer.md#abstract-getpublickey)*

Gets the existing public key for a given account

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`accountId?` | string | The NEAR account to assign a public key to |
`networkId?` | string | The targeted network. (ex. default, devnet, betanet, etc…) |

**Returns:** *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

Returns the public key or null if not found

___

###  signMessage

▸ **signMessage**(`message`: Uint8Array, `accountId?`: string, `networkId?`: string): *Promise‹[Signature](../interfaces/_utils_key_pair_.signature.md)›*

*Overrides [Signer](_signer_.signer.md).[signMessage](_signer_.signer.md#abstract-signmessage)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | Uint8Array | A message to be signed, typically a serialized transaction |
`accountId?` | string | the NEAR account signing the message |
`networkId?` | string | The targeted network. (ex. default, devnet, betanet, etc…) |

**Returns:** *Promise‹[Signature](../interfaces/_utils_key_pair_.signature.md)›*
