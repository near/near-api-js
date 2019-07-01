

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
* [rmdir](_key_stores_unencrypted_file_system_keystore_.md#rmdir)
* [unlink](_key_stores_unencrypted_file_system_keystore_.md#unlink)
* [writeFile](_key_stores_unencrypted_file_system_keystore_.md#writefile)

### Functions

* [ensureDir](_key_stores_unencrypted_file_system_keystore_.md#ensuredir)
* [loadJsonFile](_key_stores_unencrypted_file_system_keystore_.md#loadjsonfile)

---

# Variables

<a id="exists"></a>

## `<Const>` exists

**● exists**: *`__promisify__`* =  promisify(fs.exists)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:9](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/key_stores/unencrypted_file_system_keystore.ts#L9)*

___
<a id="mkdir"></a>

## `<Const>` mkdir

**● mkdir**: *`__promisify__`* =  promisify(fs.mkdir)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:14](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/key_stores/unencrypted_file_system_keystore.ts#L14)*

___
<a id="readfile"></a>

## `<Const>` readFile

**● readFile**: *`__promisify__`* =  promisify(fs.readFile)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:10](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/key_stores/unencrypted_file_system_keystore.ts#L10)*

___
<a id="readdir"></a>

## `<Const>` readdir

**● readdir**: *`__promisify__`* =  promisify(fs.readdir)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:13](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/key_stores/unencrypted_file_system_keystore.ts#L13)*

___
<a id="rmdir"></a>

## `<Const>` rmdir

**● rmdir**: *`__promisify__`* =  promisify(fs.rmdir)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:15](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/key_stores/unencrypted_file_system_keystore.ts#L15)*

___
<a id="unlink"></a>

## `<Const>` unlink

**● unlink**: *`__promisify__`* =  promisify(fs.unlink)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:12](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/key_stores/unencrypted_file_system_keystore.ts#L12)*

___
<a id="writefile"></a>

## `<Const>` writeFile

**● writeFile**: *`__promisify__`* =  promisify(fs.writeFile)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:11](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/key_stores/unencrypted_file_system_keystore.ts#L11)*

___

# Functions

<a id="ensuredir"></a>

##  ensureDir

▸ **ensureDir**(path: *`string`*): `Promise`<`void`>

*Defined in [key_stores/unencrypted_file_system_keystore.ts:30](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/key_stores/unencrypted_file_system_keystore.ts#L30)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |

**Returns:** `Promise`<`void`>

___
<a id="loadjsonfile"></a>

##  loadJsonFile

▸ **loadJsonFile**(path: *`string`*): `Promise`<`any`>

*Defined in [key_stores/unencrypted_file_system_keystore.ts:25](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/key_stores/unencrypted_file_system_keystore.ts#L25)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |

**Returns:** `Promise`<`any`>

___

