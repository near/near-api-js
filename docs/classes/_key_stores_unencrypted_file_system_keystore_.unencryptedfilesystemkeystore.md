

# Hierarchy

 [KeyStore](_key_stores_keystore_.keystore.md)

**↳ UnencryptedFileSystemKeyStore**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new UnencryptedFileSystemKeyStore**(keyDir: *`string`*): [UnencryptedFileSystemKeyStore](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:47](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L47)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| keyDir | `string` |

**Returns:** [UnencryptedFileSystemKeyStore](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md)

___

# Properties

<a id="keydir"></a>

##  keyDir

**● keyDir**: *`string`*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:47](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L47)*

___

# Methods

<a id="clear"></a>

##  clear

▸ **clear**(): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[clear](_key_stores_keystore_.keystore.md#clear)*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:75](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L75)*

**Returns:** `Promise`<`void`>

___
<a id="getaccounts"></a>

##  getAccounts

▸ **getAccounts**(networkId: *`string`*): `Promise`<`string`[]>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getAccounts](_key_stores_keystore_.keystore.md#getaccounts)*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:96](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L96)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |

**Returns:** `Promise`<`string`[]>

___
<a id="getkey"></a>

##  getKey

▸ **getKey**(networkId: *`string`*, accountId: *`string`*): `Promise`<[KeyPair](_utils_key_pair_.keypair.md)>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getKey](_key_stores_keystore_.keystore.md#getkey)*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:60](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L60)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |

**Returns:** `Promise`<[KeyPair](_utils_key_pair_.keypair.md)>

___
<a id="getkeyfilepath"></a>

## `<Private>` getKeyFilePath

▸ **getKeyFilePath**(networkId: *`string`*, accountId: *`string`*): `string`

*Defined in [key_stores/unencrypted_file_system_keystore.ts:83](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L83)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |

**Returns:** `string`

___
<a id="getnetworks"></a>

##  getNetworks

▸ **getNetworks**(): `Promise`<`string`[]>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getNetworks](_key_stores_keystore_.keystore.md#getnetworks)*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:87](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L87)*

**Returns:** `Promise`<`string`[]>

___
<a id="removekey"></a>

##  removeKey

▸ **removeKey**(networkId: *`string`*, accountId: *`string`*): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[removeKey](_key_stores_keystore_.keystore.md#removekey)*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:69](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L69)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |

**Returns:** `Promise`<`void`>

___
<a id="setkey"></a>

##  setKey

▸ **setKey**(networkId: *`string`*, accountId: *`string`*, keyPair: *[KeyPair](_utils_key_pair_.keypair.md)*): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[setKey](_key_stores_keystore_.keystore.md#setkey)*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:54](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/unencrypted_file_system_keystore.ts#L54)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |
| keyPair | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** `Promise`<`void`>

___

