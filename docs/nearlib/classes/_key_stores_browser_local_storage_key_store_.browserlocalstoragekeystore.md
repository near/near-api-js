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

Removes all items from local storage

**Returns:** *Promise‹void›*

___

###  getAccounts

▸ **getAccounts**(`networkId`: string): *Promise‹string[]›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getAccounts](_key_stores_keystore_.keystore.md#abstract-getaccounts)*

Gets the account(s) from local storage

**`returns{promise&lt;string[]&gt;}`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`networkId` | string | The targeted network. (ex. default, devnet, betanet, etc…) |

**Returns:** *Promise‹string[]›*

___

###  getKey

▸ **getKey**(`networkId`: string, `accountId`: string): *Promise‹[KeyPair](_utils_key_pair_.keypair.md)›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getKey](_key_stores_keystore_.keystore.md#abstract-getkey)*

Gets a key from local storage

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`networkId` | string | The targeted network. (ex. default, devnet, betanet, etc…) |
`accountId` | string | The NEAR account tied to the key pair |

**Returns:** *Promise‹[KeyPair](_utils_key_pair_.keypair.md)›*

___

###  getNetworks

▸ **getNetworks**(): *Promise‹string[]›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getNetworks](_key_stores_keystore_.keystore.md#abstract-getnetworks)*

Get the network(s) from local storage

**Returns:** *Promise‹string[]›*

___

###  removeKey

▸ **removeKey**(`networkId`: string, `accountId`: string): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[removeKey](_key_stores_keystore_.keystore.md#abstract-removekey)*

Removes a key from local storage

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`networkId` | string | The targeted network. (ex. default, devnet, betanet, etc…) |
`accountId` | string | The NEAR account tied to the key pair  |

**Returns:** *Promise‹void›*

___

###  setKey

▸ **setKey**(`networkId`: string, `accountId`: string, `keyPair`: [KeyPair](_utils_key_pair_.keypair.md)): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[setKey](_key_stores_keystore_.keystore.md#abstract-setkey)*

Sets a local storage item

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`networkId` | string | The targeted network. (ex. default, devnet, betanet, etc…) |
`accountId` | string | The NEAR account tied to the key pair |
`keyPair` | [KeyPair](_utils_key_pair_.keypair.md) | The key pair to store in local storage  |

**Returns:** *Promise‹void›*
