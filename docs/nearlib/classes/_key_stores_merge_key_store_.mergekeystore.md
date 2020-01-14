---
id: "_key_stores_merge_key_store_.mergekeystore"
title: "MergeKeyStore"
sidebar_label: "MergeKeyStore"
---

Keystore which can be used to merge multiple key stores into one virtual key store.

## Hierarchy

* [KeyStore](_key_stores_keystore_.keystore.md)

  ↳ **MergeKeyStore**

## Index

### Constructors

* [constructor](_key_stores_merge_key_store_.mergekeystore.md#constructor)

### Properties

* [keyStores](_key_stores_merge_key_store_.mergekeystore.md#keystores)

### Methods

* [clear](_key_stores_merge_key_store_.mergekeystore.md#clear)
* [getAccounts](_key_stores_merge_key_store_.mergekeystore.md#getaccounts)
* [getKey](_key_stores_merge_key_store_.mergekeystore.md#getkey)
* [getNetworks](_key_stores_merge_key_store_.mergekeystore.md#getnetworks)
* [removeKey](_key_stores_merge_key_store_.mergekeystore.md#removekey)
* [setKey](_key_stores_merge_key_store_.mergekeystore.md#setkey)

## Constructors

###  constructor

\+ **new MergeKeyStore**(`keyStores`: [KeyStore](_key_stores_keystore_.keystore.md)[]): *[MergeKeyStore](_key_stores_merge_key_store_.mergekeystore.md)*

*Defined in [src.ts/key_stores/merge_key_store.ts:10](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/merge_key_store.ts#L10)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keyStores` | [KeyStore](_key_stores_keystore_.keystore.md)[] | first keystore gets all write calls, read calls are attempted from start to end of array  |

**Returns:** *[MergeKeyStore](_key_stores_merge_key_store_.mergekeystore.md)*

## Properties

###  keyStores

• **keyStores**: *[KeyStore](_key_stores_keystore_.keystore.md)[]*

*Defined in [src.ts/key_stores/merge_key_store.ts:10](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/merge_key_store.ts#L10)*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[clear](_key_stores_keystore_.keystore.md#abstract-clear)*

*Defined in [src.ts/key_stores/merge_key_store.ts:40](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/merge_key_store.ts#L40)*

**Returns:** *Promise‹void›*

___

###  getAccounts

▸ **getAccounts**(`networkId`: string): *Promise‹string[]›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getAccounts](_key_stores_keystore_.keystore.md#abstract-getaccounts)*

*Defined in [src.ts/key_stores/merge_key_store.ts:56](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/merge_key_store.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |

**Returns:** *Promise‹string[]›*

___

###  getKey

▸ **getKey**(`networkId`: string, `accountId`: string): *Promise‹[KeyPair](_utils_key_pair_.keypair.md)›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getKey](_key_stores_keystore_.keystore.md#abstract-getkey)*

*Defined in [src.ts/key_stores/merge_key_store.ts:24](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/merge_key_store.ts#L24)*

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

*Defined in [src.ts/key_stores/merge_key_store.ts:46](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/merge_key_store.ts#L46)*

**Returns:** *Promise‹string[]›*

___

###  removeKey

▸ **removeKey**(`networkId`: string, `accountId`: string): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[removeKey](_key_stores_keystore_.keystore.md#abstract-removekey)*

*Defined in [src.ts/key_stores/merge_key_store.ts:34](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/merge_key_store.ts#L34)*

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

*Defined in [src.ts/key_stores/merge_key_store.ts:20](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/merge_key_store.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |
`keyPair` | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** *Promise‹void›*
