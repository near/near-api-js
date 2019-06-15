

# Hierarchy

 [KeyStore](_key_stores_keystore_.keystore.md)

**↳ UnencryptedFileSystemKeyStore**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new UnencryptedFileSystemKeyStore**(keyDir: *`string`*): [UnencryptedFileSystemKeyStore](_key_stores_unencrypted_file_system_keystore_.unencryptedfilesystemkeystore.md)

*Defined in [key_stores/unencrypted_file_system_keystore.ts:23](https://github.com/nearprotocol/nearlib/blob/b1675ba/src.ts/key_stores/unencrypted_file_system_keystore.ts#L23)*

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

*Defined in [key_stores/unencrypted_file_system_keystore.ts:23](https://github.com/nearprotocol/nearlib/blob/b1675ba/src.ts/key_stores/unencrypted_file_system_keystore.ts#L23)*

___

# Methods

<a id="clear"></a>

##  clear

▸ **clear**(): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[clear](_key_stores_keystore_.keystore.md#clear)*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:53](https://github.com/nearprotocol/nearlib/blob/b1675ba/src.ts/key_stores/unencrypted_file_system_keystore.ts#L53)*

**Returns:** `Promise`<`void`>

___
<a id="getaccounts"></a>

##  getAccounts

▸ **getAccounts**(networkId: *`string`*): `Promise`<`Array`<`string`>>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getAccounts](_key_stores_keystore_.keystore.md#getaccounts)*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:70](https://github.com/nearprotocol/nearlib/blob/b1675ba/src.ts/key_stores/unencrypted_file_system_keystore.ts#L70)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |

**Returns:** `Promise`<`Array`<`string`>>

___
<a id="getkey"></a>

##  getKey

▸ **getKey**(networkId: *`string`*, accountId: *`string`*): `Promise`<[KeyPair](_utils_key_pair_.keypair.md)>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getKey](_key_stores_keystore_.keystore.md#getkey)*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:38](https://github.com/nearprotocol/nearlib/blob/b1675ba/src.ts/key_stores/unencrypted_file_system_keystore.ts#L38)*

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

*Defined in [key_stores/unencrypted_file_system_keystore.ts:57](https://github.com/nearprotocol/nearlib/blob/b1675ba/src.ts/key_stores/unencrypted_file_system_keystore.ts#L57)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |

**Returns:** `string`

___
<a id="getnetworks"></a>

##  getNetworks

▸ **getNetworks**(): `Promise`<`Array`<`string`>>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getNetworks](_key_stores_keystore_.keystore.md#getnetworks)*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:61](https://github.com/nearprotocol/nearlib/blob/b1675ba/src.ts/key_stores/unencrypted_file_system_keystore.ts#L61)*

**Returns:** `Promise`<`Array`<`string`>>

___
<a id="removekey"></a>

##  removeKey

▸ **removeKey**(networkId: *`string`*, accountId: *`string`*): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[removeKey](_key_stores_keystore_.keystore.md#removekey)*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:47](https://github.com/nearprotocol/nearlib/blob/b1675ba/src.ts/key_stores/unencrypted_file_system_keystore.ts#L47)*

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

*Defined in [key_stores/unencrypted_file_system_keystore.ts:30](https://github.com/nearprotocol/nearlib/blob/b1675ba/src.ts/key_stores/unencrypted_file_system_keystore.ts#L30)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |
| keyPair | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** `Promise`<`void`>

___
<a id="totalaccounts"></a>

##  totalAccounts

▸ **totalAccounts**(): `Promise`<`number`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[totalAccounts](_key_stores_keystore_.keystore.md#totalaccounts)*

*Defined in [key_stores/unencrypted_file_system_keystore.ts:82](https://github.com/nearprotocol/nearlib/blob/b1675ba/src.ts/key_stores/unencrypted_file_system_keystore.ts#L82)*

**Returns:** `Promise`<`number`>

___

