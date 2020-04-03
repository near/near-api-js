---
id: "_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore"
title: "UnencryptedFileSystemKeyStore"
sidebar_label: "UnencryptedFileSystemKeyStore"
---

## Hierarchy

* [KeyStore](_key_stores_keystore_.keystore.md)

  ↳ **UnencryptedFileSystemKeyStore**

## Index

### Constructors

* [constructor](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md#constructor)

### Properties

* [keyDir](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md#keydir)

### Methods

* [clear](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md#clear)
* [getAccounts](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md#getaccounts)
* [getKey](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md#getkey)
* [getNetworks](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md#getnetworks)
* [removeKey](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md#removekey)
* [setKey](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md#setkey)

## Constructors

###  constructor

\+ **new UnencryptedFileSystemKeyStore**(`keyDir`: string): *[UnencryptedFileSystemKeyStore](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md)*

**Parameters:**

Name | Type |
------ | ------ |
`keyDir` | string |

**Returns:** *[UnencryptedFileSystemKeyStore](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md)*

## Properties

###  keyDir

• **keyDir**: *string*

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
