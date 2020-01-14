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

### Properties

* [localStorage](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#private-localstorage)
* [prefix](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#private-prefix)

### Methods

* [clear](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#clear)
* [getAccounts](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#getaccounts)
* [getKey](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#getkey)
* [getNetworks](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#getnetworks)
* [removeKey](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#removekey)
* [setKey](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#setkey)
* [storageKeyForSecretKey](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#private-storagekeyforsecretkey)
* [storageKeys](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md#private-storagekeys)

## Constructors

###  constructor

\+ **new BrowserLocalStorageKeyStore**(`localStorage`: any, `prefix`: string): *[BrowserLocalStorageKeyStore](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md)*

*Defined in [src.ts/key_stores/browser_local_storage_key_store.ts:10](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/browser_local_storage_key_store.ts#L10)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`localStorage` | any |  window.localStorage |
`prefix` | string |  LOCAL_STORAGE_KEY_PREFIX |

**Returns:** *[BrowserLocalStorageKeyStore](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md)*

## Properties

### `Private` localStorage

• **localStorage**: *any*

*Defined in [src.ts/key_stores/browser_local_storage_key_store.ts:9](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/browser_local_storage_key_store.ts#L9)*

___

### `Private` prefix

• **prefix**: *string*

*Defined in [src.ts/key_stores/browser_local_storage_key_store.ts:10](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/browser_local_storage_key_store.ts#L10)*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[clear](_key_stores_keystore_.keystore.md#abstract-clear)*

*Defined in [src.ts/key_stores/browser_local_storage_key_store.ts:34](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/browser_local_storage_key_store.ts#L34)*

**Returns:** *Promise‹void›*

___

###  getAccounts

▸ **getAccounts**(`networkId`: string): *Promise‹string[]›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getAccounts](_key_stores_keystore_.keystore.md#abstract-getaccounts)*

*Defined in [src.ts/key_stores/browser_local_storage_key_store.ts:53](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/browser_local_storage_key_store.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |

**Returns:** *Promise‹string[]›*

___

###  getKey

▸ **getKey**(`networkId`: string, `accountId`: string): *Promise‹[KeyPair](_utils_key_pair_.keypair.md)›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getKey](_key_stores_keystore_.keystore.md#abstract-getkey)*

*Defined in [src.ts/key_stores/browser_local_storage_key_store.ts:22](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/browser_local_storage_key_store.ts#L22)*

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

*Defined in [src.ts/key_stores/browser_local_storage_key_store.ts:42](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/browser_local_storage_key_store.ts#L42)*

**Returns:** *Promise‹string[]›*

___

###  removeKey

▸ **removeKey**(`networkId`: string, `accountId`: string): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[removeKey](_key_stores_keystore_.keystore.md#abstract-removekey)*

*Defined in [src.ts/key_stores/browser_local_storage_key_store.ts:30](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/browser_local_storage_key_store.ts#L30)*

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

*Defined in [src.ts/key_stores/browser_local_storage_key_store.ts:18](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/browser_local_storage_key_store.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |
`keyPair` | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** *Promise‹void›*

___

### `Private` storageKeyForSecretKey

▸ **storageKeyForSecretKey**(`networkId`: string, `accountId`: string): *string*

*Defined in [src.ts/key_stores/browser_local_storage_key_store.ts:66](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/browser_local_storage_key_store.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |

**Returns:** *string*

___

### `Private` storageKeys

▸ **storageKeys**(): *IterableIterator‹string›*

*Defined in [src.ts/key_stores/browser_local_storage_key_store.ts:70](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/browser_local_storage_key_store.ts#L70)*

**Returns:** *IterableIterator‹string›*
