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
* [getKeyFilePath](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md#private-getkeyfilepath)
* [getNetworks](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md#getnetworks)
* [removeKey](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md#removekey)
* [setKey](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md#setkey)

## Constructors

###  constructor

\+ **new UnencryptedFileSystemKeyStore**(`keyDir`: string): *[UnencryptedFileSystemKeyStore](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md)*

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:57](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`keyDir` | string |

**Returns:** *[UnencryptedFileSystemKeyStore](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md)*

## Properties

###  keyDir

• **keyDir**: *string*

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:57](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L57)*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[clear](_key_stores_keystore_.keystore.md#abstract-clear)*

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:85](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L85)*

**Returns:** *Promise‹void›*

___

###  getAccounts

▸ **getAccounts**(`networkId`: string): *Promise‹string[]›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getAccounts](_key_stores_keystore_.keystore.md#abstract-getaccounts)*

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:106](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L106)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |

**Returns:** *Promise‹string[]›*

___

###  getKey

▸ **getKey**(`networkId`: string, `accountId`: string): *Promise‹[KeyPair](_utils_key_pair_.keypair.md)›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getKey](_key_stores_keystore_.keystore.md#abstract-getkey)*

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:70](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |

**Returns:** *Promise‹[KeyPair](_utils_key_pair_.keypair.md)›*

___

### `Private` getKeyFilePath

▸ **getKeyFilePath**(`networkId`: string, `accountId`: string): *string*

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:93](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L93)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |

**Returns:** *string*

___

###  getNetworks

▸ **getNetworks**(): *Promise‹string[]›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getNetworks](_key_stores_keystore_.keystore.md#abstract-getnetworks)*

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:97](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L97)*

**Returns:** *Promise‹string[]›*

___

###  removeKey

▸ **removeKey**(`networkId`: string, `accountId`: string): *Promise‹void›*

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[removeKey](_key_stores_keystore_.keystore.md#abstract-removekey)*

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:79](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L79)*

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

*Defined in [src.ts/key_stores/unencrypted_file_system_keystore.ts:64](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/key_stores/unencrypted_file_system_keystore.ts#L64)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`accountId` | string |
`keyPair` | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** *Promise‹void›*
