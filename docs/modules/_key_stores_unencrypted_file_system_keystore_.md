

# Index

### Classes

* [UnencryptedFileSystemKeyStore](../classes/_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md)

### Interfaces

* [AccountInfo](../interfaces/_key_stores_unencrypted_file_system_keystore_.accountinfo.md)

### Variables

* [exists](_key_stores_unencrypted_file_system_keystore_.md#exists)
* [mkdir](_key_stores_unencrypted_file_system_keystore_.md#mkdir)
* [readFile](_key_stores_unencrypted_file_system_keystore_.md#readfile)
* [readdir](_key_stores_unencrypted_file_system_keystore_.md#readdir)
* [unlink](_key_stores_unencrypted_file_system_keystore_.md#unlink)
* [writeFile](_key_stores_unencrypted_file_system_keystore_.md#writefile)

### Functions

* [ensureDir](_key_stores_unencrypted_file_system_keystore_.md#ensuredir)
* [loadJsonFile](_key_stores_unencrypted_file_system_keystore_.md#loadjsonfile)
* [promisify](_key_stores_unencrypted_file_system_keystore_.md#promisify)

---

# Variables

<a id="exists"></a>

## `<Const>` exists

**● exists**: *`Function`* =  promisify(fs.exists)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:18](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L18)*

___
<a id="mkdir"></a>

## `<Const>` mkdir

**● mkdir**: *`Function`* =  promisify(fs.mkdir)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:23](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L23)*

___
<a id="readfile"></a>

## `<Const>` readFile

**● readFile**: *`Function`* =  promisify(fs.readFile)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:19](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L19)*

___
<a id="readdir"></a>

## `<Const>` readdir

**● readdir**: *`Function`* =  promisify(fs.readdir)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:22](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L22)*

___
<a id="unlink"></a>

## `<Const>` unlink

**● unlink**: *`Function`* =  promisify(fs.unlink)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:21](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L21)*

___
<a id="writefile"></a>

## `<Const>` writeFile

**● writeFile**: *`Function`* =  promisify(fs.writeFile)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:20](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L20)*

___

# Functions

<a id="ensuredir"></a>

##  ensureDir

▸ **ensureDir**(path: *`string`*): `Promise`<`void`>

*Defined in [key_stores/unencrypted_file_system_keystore.ts:38](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L38)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |

**Returns:** `Promise`<`void`>

___
<a id="loadjsonfile"></a>

##  loadJsonFile

▸ **loadJsonFile**(path: *`string`*): `Promise`<`any`>

*Defined in [key_stores/unencrypted_file_system_keystore.ts:33](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L33)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |

**Returns:** `Promise`<`any`>

___
<a id="promisify"></a>

## `<Const>` promisify

▸ **promisify**(fn: *`any`*): `Function`

*Defined in [key_stores/unencrypted_file_system_keystore.ts:9](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L9)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `any` |

**Returns:** `Function`

___

