---
id: "_key_stores_in_memory_key_store_.inmemorykeystore"
title: "InMemoryKeyStore"
sidebar_label: "InMemoryKeyStore"
---

Simple in-memory keystore for testing purposes.

## Hierarchy

* [KeyStore](_key_stores_keystore_.keystore.md)

  ↳ **InMemoryKeyStore**

## Index

### Constructors

* [constructor](_key_stores_in_memory_key_store_.inmemorykeystore.md#constructor)

### Properties

* [keys](_key_stores_in_memory_key_store_.inmemorykeystore.md#private-keys)

### Methods

* [clear](_key_stores_in_memory_key_store_.inmemorykeystore.md#clear)
* [getAccounts](_key_stores_in_memory_key_store_.inmemorykeystore.md#getaccounts)
* [getKey](_key_stores_in_memory_key_store_.inmemorykeystore.md#getkey)
* [getNetworks](_key_stores_in_memory_key_store_.inmemorykeystore.md#getnetworks)
* [removeKey](_key_stores_in_memory_key_store_.inmemorykeystore.md#removekey)
* [setKey](_key_stores_in_memory_key_store_.inmemorykeystore.md#setkey)

## Constructors

###  constructor

\+ **new InMemoryKeyStore**(): *[InMemoryKeyStore](_key_stores_in_memory_key_store_.inmemorykeystore.md)*

*Defined in [src.ts/key_stores/in_memory_key_store.ts:10](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/in_memory_key_store.ts#L10)*

**Returns:** *[InMemoryKeyStore](_key_stores_in_memory_key_store_.inmemorykeystore.md)*

## Properties

### `Private` keys

• **keys**: *object*

*Defined in [src.ts/key_stores/in_memory_key_store.ts:10](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/in_memory_key_store.ts#L10)*

#### Type declaration:

* \[ **key**: *string*\]: string

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[clear](_key_stores_keystore_.keystore.md#abstract-clear)*

*Defined in [src.ts/key_stores/in_memory_key_store.ts:33](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/in_memory_key_store.ts#L33)*

**Returns:** *Promise‹void›*

___

###  getAccounts

▸ **getAccounts**(`networkId`: string): *Promise‹string[]›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getAccounts](_key_stores_keystore_.keystore.md#abstract-getaccounts)*

*Defined in [src.ts/key_stores/in_memory_key_store.ts:46](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/in_memory_key_store.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |

**Returns:** *Promise‹string[]›*

___

###  getKey

▸ **getKey**(`networkId`: string, `accountId`: string): *Promise‹[KeyPair](_utils_key_pair_.keypair.md)›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getKey](_key_stores_keystore_.keystore.md#abstract-getkey)*

*Defined in [src.ts/key_stores/in_memory_key_store.ts:21](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/in_memory_key_store.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |

**Returns:** *Promise‹[KeyPair](_utils_key_pair_.keypair.md)›*

___

###  getNetworks

▸ **getNetworks**(): *Promise‹string[]›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getNetworks](_key_stores_keystore_.keystore.md#abstract-getnetworks)*

*Defined in [src.ts/key_stores/in_memory_key_store.ts:37](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/in_memory_key_store.ts#L37)*

**Returns:** *Promise‹string[]›*

___

###  removeKey

▸ **removeKey**(`networkId`: string, `accountId`: string): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[removeKey](_key_stores_keystore_.keystore.md#abstract-removekey)*

*Defined in [src.ts/key_stores/in_memory_key_store.ts:29](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/in_memory_key_store.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |

**Returns:** *Promise‹void›*

___

###  setKey

▸ **setKey**(`networkId`: string, `accountId`: string, `keyPair`: [KeyPair](_utils_key_pair_.keypair.md)): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[setKey](_key_stores_keystore_.keystore.md#abstract-setkey)*

*Defined in [src.ts/key_stores/in_memory_key_store.ts:17](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/in_memory_key_store.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |
`keyPair` | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** *Promise‹void›*
