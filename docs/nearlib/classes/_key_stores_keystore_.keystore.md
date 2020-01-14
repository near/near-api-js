---
id: "_key_stores_keystore_.keystore"
title: "KeyStore"
sidebar_label: "KeyStore"
---

Key store interface for `InMemorySigner`.

## Hierarchy

* **KeyStore**

  ↳ [InMemoryKeyStore](_key_stores_in_memory_key_store_.inmemorykeystore.md)

  ↳ [BrowserLocalStorageKeyStore](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md)

  ↳ [UnencryptedFileSystemKeyStore](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md)

  ↳ [MergeKeyStore](_key_stores_merge_key_store_.mergekeystore.md)

## Index

### Methods

* [clear](_key_stores_keystore_.keystore.md#abstract-clear)
* [getAccounts](_key_stores_keystore_.keystore.md#abstract-getaccounts)
* [getKey](_key_stores_keystore_.keystore.md#abstract-getkey)
* [getNetworks](_key_stores_keystore_.keystore.md#abstract-getnetworks)
* [removeKey](_key_stores_keystore_.keystore.md#abstract-removekey)
* [setKey](_key_stores_keystore_.keystore.md#abstract-setkey)

## Methods

### `Abstract` clear

▸ **clear**(): *Promise‹void›*

*Defined in [src.ts/key_stores/keystore.ts:12](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/keystore.ts#L12)*

**Returns:** *Promise‹void›*

___

### `Abstract` getAccounts

▸ **getAccounts**(`networkId`: string): *Promise‹string[]›*

*Defined in [src.ts/key_stores/keystore.ts:14](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/keystore.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |

**Returns:** *Promise‹string[]›*

___

### `Abstract` getKey

▸ **getKey**(`networkId`: string, `accountId`: string): *Promise‹[KeyPair](_utils_key_pair_.keypair.md)›*

*Defined in [src.ts/key_stores/keystore.ts:10](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/keystore.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |

**Returns:** *Promise‹[KeyPair](_utils_key_pair_.keypair.md)›*

___

### `Abstract` getNetworks

▸ **getNetworks**(): *Promise‹string[]›*

*Defined in [src.ts/key_stores/keystore.ts:13](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/keystore.ts#L13)*

**Returns:** *Promise‹string[]›*

___

### `Abstract` removeKey

▸ **removeKey**(`networkId`: string, `accountId`: string): *Promise‹void›*

*Defined in [src.ts/key_stores/keystore.ts:11](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/keystore.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |

**Returns:** *Promise‹void›*

___

### `Abstract` setKey

▸ **setKey**(`networkId`: string, `accountId`: string, `keyPair`: [KeyPair](_utils_key_pair_.keypair.md)): *Promise‹void›*

*Defined in [src.ts/key_stores/keystore.ts:9](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/keystore.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |
`keyPair` | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** *Promise‹void›*
