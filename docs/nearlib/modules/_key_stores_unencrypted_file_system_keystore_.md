---
id: "_key_stores_unencrypted_file_system_keystore_"
title: "key_stores/unencrypted_file_system_keystore"
sidebar_label: "key_stores/unencrypted_file_system_keystore"
---

## Index

### Classes

* [UnencryptedFileSystemKeyStore](../classes/_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md)

### Interfaces

* [AccountInfo](../interfaces/_key_stores_unencrypted_file_system_keystore_.accountinfo.md)

### Variables

* [exists](_key_stores_unencrypted_file_system_keystore_.md#const-exists)
* [mkdir](_key_stores_unencrypted_file_system_keystore_.md#const-mkdir)
* [readFile](_key_stores_unencrypted_file_system_keystore_.md#const-readfile)
* [readdir](_key_stores_unencrypted_file_system_keystore_.md#const-readdir)
* [unlink](_key_stores_unencrypted_file_system_keystore_.md#const-unlink)
* [writeFile](_key_stores_unencrypted_file_system_keystore_.md#const-writefile)

### Functions

* [ensureDir](_key_stores_unencrypted_file_system_keystore_.md#ensuredir)
* [loadJsonFile](_key_stores_unencrypted_file_system_keystore_.md#loadjsonfile)
* [promisify](_key_stores_unencrypted_file_system_keystore_.md#const-promisify)
* [readKeyFile](_key_stores_unencrypted_file_system_keystore_.md#readkeyfile)

## Variables

### `Const` exists

• **exists**: *Function* =  promisify(fs.exists)

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:18](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L18)*

___

### `Const` mkdir

• **mkdir**: *Function* =  promisify(fs.mkdir)

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:23](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L23)*

___

### `Const` readFile

• **readFile**: *Function* =  promisify(fs.readFile)

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:19](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L19)*

___

### `Const` readdir

• **readdir**: *Function* =  promisify(fs.readdir)

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:22](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L22)*

___

### `Const` unlink

• **unlink**: *Function* =  promisify(fs.unlink)

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:21](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L21)*

___

### `Const` writeFile

• **writeFile**: *Function* =  promisify(fs.writeFile)

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:20](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L20)*

## Functions

###  ensureDir

▸ **ensureDir**(`path`: string): *Promise‹void›*

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:38](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹void›*

___

###  loadJsonFile

▸ **loadJsonFile**(`path`: string): *Promise‹any›*

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:33](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹any›*

___

### `Const` promisify

▸ **promisify**(`fn`: any): *Function*

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:9](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | any |

**Returns:** *Function*

___

###  readKeyFile

▸ **readKeyFile**(`path`: string): *Promise‹[string, [KeyPair](../classes/_utils_key_pair_.keypair.md)]›*

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:46](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹[string, [KeyPair](../classes/_utils_key_pair_.keypair.md)]›*
