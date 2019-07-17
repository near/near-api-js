

Key store interface for `InMemorySigner`.

# Hierarchy

**KeyStore**

↳  [InMemoryKeyStore](_key_stores_in_memory_key_store_.inmemorykeystore.md)

↳  [BrowserLocalStorageKeyStore](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md)

↳  [UnencryptedFileSystemKeyStore](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md)

↳  [MergeKeyStore](_key_stores_merge_key_store_.mergekeystore.md)

# Methods

<a id="clear"></a>

## `<Abstract>` clear

▸ **clear**(): `Promise`<`void`>

*Defined in [key_stores/keystore.ts:12](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/keystore.ts#L12)*

**Returns:** `Promise`<`void`>

___
<a id="getaccounts"></a>

## `<Abstract>` getAccounts

▸ **getAccounts**(networkId: *`string`*): `Promise`<`string`[]>

*Defined in [key_stores/keystore.ts:14](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/keystore.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |

**Returns:** `Promise`<`string`[]>

___
<a id="getkey"></a>

## `<Abstract>` getKey

▸ **getKey**(networkId: *`string`*, accountId: *`string`*): `Promise`<[KeyPair](_utils_key_pair_.keypair.md)>

*Defined in [key_stores/keystore.ts:10](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/keystore.ts#L10)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |

**Returns:** `Promise`<[KeyPair](_utils_key_pair_.keypair.md)>

___
<a id="getnetworks"></a>

## `<Abstract>` getNetworks

▸ **getNetworks**(): `Promise`<`string`[]>

*Defined in [key_stores/keystore.ts:13](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/keystore.ts#L13)*

**Returns:** `Promise`<`string`[]>

___
<a id="removekey"></a>

## `<Abstract>` removeKey

▸ **removeKey**(networkId: *`string`*, accountId: *`string`*): `Promise`<`void`>

*Defined in [key_stores/keystore.ts:11](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/keystore.ts#L11)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |

**Returns:** `Promise`<`void`>

___
<a id="setkey"></a>

## `<Abstract>` setKey

▸ **setKey**(networkId: *`string`*, accountId: *`string`*, keyPair: *[KeyPair](_utils_key_pair_.keypair.md)*): `Promise`<`void`>

*Defined in [key_stores/keystore.ts:9](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/keystore.ts#L9)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |
| keyPair | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** `Promise`<`void`>

___

