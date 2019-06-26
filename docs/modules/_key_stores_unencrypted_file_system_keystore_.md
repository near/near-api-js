

# Index

### Classes

* [UnencryptedFileSystemKeyStore](../classes/_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md)

### Type aliases

* [AccountInfo](_key_stores_unencrypted_file_system_keystore_.md#accountinfo)

### Functions

* [ensureDir](_key_stores_unencrypted_file_system_keystore_.md#ensuredir)
* [loadJsonFile](_key_stores_unencrypted_file_system_keystore_.md#loadjsonfile)

---

# Type aliases

<a id="accountinfo"></a>

##  AccountInfo

**Ƭ AccountInfo**: *`object`*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:12](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/key_stores/unencrypted_file_system_keystore.ts#L12)*

Format of the account stored on disk.

#### Type declaration

 account_id: `string`

 private_key: `string`

___

# Functions

<a id="ensuredir"></a>

##  ensureDir

▸ **ensureDir**(path: *`string`*): `Promise`<`void`>

*Defined in [key_stores/unencrypted_file_system_keystore.ts:22](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/key_stores/unencrypted_file_system_keystore.ts#L22)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |

**Returns:** `Promise`<`void`>

___
<a id="loadjsonfile"></a>

##  loadJsonFile

▸ **loadJsonFile**(path: *`string`*): `Promise`<`any`>

*Defined in [key_stores/unencrypted_file_system_keystore.ts:17](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/key_stores/unencrypted_file_system_keystore.ts#L17)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |

**Returns:** `Promise`<`any`>

___

