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

*Defined in [src.ts/signer.ts:37](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/signer.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`keyStore` | [KeyStore](_key_stores_keystore_.keystore.md) |

**Returns:** *[InMemorySigner](_signer_.inmemorysigner.md)*

## Properties

###  keyStore

• **keyStore**: *[KeyStore](_key_stores_keystore_.keystore.md)*

*Defined in [src.ts/signer.ts:37](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/signer.ts#L37)*

## Methods

###  createKey

▸ **createKey**(`accountId`: string, `networkId`: string): *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

*Overrides [Signer](_signer_.signer.md).[createKey](_signer_.signer.md#abstract-createkey)*

*Defined in [src.ts/signer.ts:44](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/signer.ts#L44)*

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

*Defined in [src.ts/signer.ts:50](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/signer.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`accountId?` | string |
`networkId?` | string |

**Returns:** *Promise‹[PublicKey](_utils_key_pair_.publickey.md)›*

___

###  signMessage

▸ **signMessage**(`message`: Uint8Array, `accountId?`: string, `networkId?`: string): *Promise‹[Signature](../interfaces/_utils_key_pair_.signature.md)›*

*Overrides [Signer](_signer_.signer.md).[signMessage](_signer_.signer.md#abstract-signmessage)*

*Defined in [src.ts/signer.ts:58](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/signer.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Uint8Array |
`accountId?` | string |
`networkId?` | string |

**Returns:** *Promise‹[Signature](../interfaces/_utils_key_pair_.signature.md)›*
