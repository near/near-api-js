---
id: "_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore"
title: "BrowserLocalStorageKeyStore"
sidebar_label: "BrowserLocalStorageKeyStore"
---

## Hierarchy

* [KeyStore](_key_stores_keystore_.keystore.md)

  ↳ **BrowserLocalStorageKeyStore**

## Index

### Constructors

* [constructor](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#constructor)

### Methods

* [clear](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#clear)
* [getAccounts](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#getaccounts)
* [getKey](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#getkey)
* [getNetworks](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#getnetworks)
* [removeKey](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#removekey)
* [setKey](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#setkey)

## Constructors

###  constructor

\+ **new BrowserLocalStorageKeyStore**(`localStorage`: any, `prefix`: string): *[BrowserLocalStorageKeyStore](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`localStorage` | any | window.localStorage |
`prefix` | string | LOCAL_STORAGE_KEY_PREFIX |

**Returns:** *[BrowserLocalStorageKeyStore](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md)*

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
