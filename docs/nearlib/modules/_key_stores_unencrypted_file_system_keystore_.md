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

• **exists**: *Function* = promisify(fs.exists)

___

### `Const` mkdir

• **mkdir**: *Function* = promisify(fs.mkdir)

___

### `Const` readFile

• **readFile**: *Function* = promisify(fs.readFile)

___

### `Const` readdir

• **readdir**: *Function* = promisify(fs.readdir)

___

### `Const` unlink

• **unlink**: *Function* = promisify(fs.unlink)

___

### `Const` writeFile

• **writeFile**: *Function* = promisify(fs.writeFile)

## Functions

###  ensureDir

▸ **ensureDir**(`path`: string): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹void›*

___

###  loadJsonFile

▸ **loadJsonFile**(`path`: string): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹any›*

___

### `Const` promisify

▸ **promisify**(`fn`: any): *Function*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | any |

**Returns:** *Function*

___

###  readKeyFile

▸ **readKeyFile**(`path`: string): *Promise‹[string, [KeyPair](../classes/_utils_key_pair_.keypair.md)]›*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *Promise‹[string, [KeyPair](../classes/_utils_key_pair_.keypair.md)]›*
