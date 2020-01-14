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
* [signHash](_signer_.inmemorysigner.md#signhash)
* [signMessage](_signer_.inmemorysigner.md#signmessage)

## Constructors

###  constructor

\+ **new InMemorySigner**(`keyStore`: [KeyStore](_key_stores_keystore_.keystore.md)): *[InMemorySigner](_signer_.inmemorysigner.md)*

*Defined in [src.ts/signer.ts:47](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/signer.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`keyStore` | [KeyStore](_key_stores_keystore_.keystore.md) |

**Returns:** *[InMemorySigner](_signer_.inmemorysigner.md)*

## Properties

###  keyStore

• **keyStore**: *[KeyStore](_key_stores_keystore_.keystore.md)*

*Defined in [src.ts/signer.ts:47](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/signer.ts#L47)*

## Methods

###  createKey

▸ **createKey**(`accountId`: string, `networkId`: string): *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

*Overrides [Signer](_signer_.signer.md).[createKey](_signer_.signer.md#abstract-createkey)*

*Defined in [src.ts/signer.ts:54](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/signer.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`accountId` | string |
`networkId` | string |

**Returns:** *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

___

###  getPublicKey

▸ **getPublicKey**(`accountId?`: string, `networkId?`: string): *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

*Overrides [Signer](_signer_.signer.md).[getPublicKey](_signer_.signer.md#abstract-getpublickey)*

*Defined in [src.ts/signer.ts:60](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/signer.ts#L60)*

**Parameters:**

Name | Type |
------ | ------ |
`accountId?` | string |
`networkId?` | string |

**Returns:** *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

___

###  signHash

▸ **signHash**(`hash`: Uint8Array, `accountId?`: string, `networkId?`: string): *Promise‹[Signature](../interfaces/_utils_key_pair_.signature.md)›*

*Overrides [Signer](_signer_.signer.md).[signHash](_signer_.signer.md#abstract-signhash)*

*Defined in [src.ts/signer.ts:68](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/signer.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | Uint8Array |
`accountId?` | string |
`networkId?` | string |

**Returns:** *Promise‹[Signature](../interfaces/_utils_key_pair_.signature.md)›*

___

###  signMessage

▸ **signMessage**(`message`: Uint8Array, `accountId?`: string, `networkId?`: string): *Promise‹[Signature](../interfaces/_utils_key_pair_.signature.md)›*

*Inherited from [Signer](_signer_.signer.md).[signMessage](_signer_.signer.md#signmessage)*

*Defined in [src.ts/signer.ts:38](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/signer.ts#L38)*

Signs given message, by first hashing with sha256.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | Uint8Array | message to sign. |
`accountId?` | string | accountId to use for signing. |
`networkId?` | string | network for this accontId.  |

**Returns:** *Promise‹[Signature](../interfaces/_utils_key_pair_.signature.md)›*
