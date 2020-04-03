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

**Returns:** *[InMemoryKeyStore](_key_stores_in_memory_key_store_.inmemorykeystore.md)*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[clear](_key_stores_keystore_.keystore.md#abstract-clear)*

**Returns:** *Promise‹void›*

___

###  getAccounts

▸ **getAccounts**(`networkId`: string): *Promise‹string[]›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getAccounts](_key_stores_keystore_.keystore.md#abstract-getaccounts)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |

**Returns:** *Promise‹string[]›*

___

###  getKey

▸ **getKey**(`networkId`: string, `accountId`: string): *Promise‹[KeyPair](_utils_key_pair_.keypair.md)›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getKey](_key_stores_keystore_.keystore.md#abstract-getkey)*

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

**Returns:** *Promise‹string[]›*

___

###  removeKey

▸ **removeKey**(`networkId`: string, `accountId`: string): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[removeKey](_key_stores_keystore_.keystore.md#abstract-removekey)*

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

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |
`keyPair` | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** *Promise‹void›*
