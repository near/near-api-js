

# Hierarchy

 [KeyStore](_key_stores_keystore_.keystore.md)

**↳ BrowserLocalStorageKeyStore**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new BrowserLocalStorageKeyStore**(localStorage?: *`any`*): [BrowserLocalStorageKeyStore](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md)

*Defined in [key_stores/browser_local_storage_key_store.ts:13](https://github.com/nearprotocol/nearlib/blob/b149382/src.ts/key_stores/browser_local_storage_key_store.ts#L13)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` localStorage | `any` |  window.localStorage |

**Returns:** [BrowserLocalStorageKeyStore](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md)

___

# Properties

<a id="localstorage"></a>

## `<Private>` localStorage

**● localStorage**: *`any`*

*Defined in [key_stores/browser_local_storage_key_store.ts:13](https://github.com/nearprotocol/nearlib/blob/b149382/src.ts/key_stores/browser_local_storage_key_store.ts#L13)*

___

# Methods

<a id="clear"></a>

##  clear

▸ **clear**(): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[clear](_key_stores_keystore_.keystore.md#clear)*

*Defined in [key_stores/browser_local_storage_key_store.ts:36](https://github.com/nearprotocol/nearlib/blob/b149382/src.ts/key_stores/browser_local_storage_key_store.ts#L36)*

**Returns:** `Promise`<`void`>

___
<a id="getaccounts"></a>

##  getAccounts

▸ **getAccounts**(networkId: *`string`*): `Promise`<`Array`<`string`>>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getAccounts](_key_stores_keystore_.keystore.md#getaccounts)*

*Defined in [key_stores/browser_local_storage_key_store.ts:55](https://github.com/nearprotocol/nearlib/blob/b149382/src.ts/key_stores/browser_local_storage_key_store.ts#L55)*

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

*Defined in [key_stores/browser_local_storage_key_store.ts:24](https://github.com/nearprotocol/nearlib/blob/b149382/src.ts/key_stores/browser_local_storage_key_store.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |

**Returns:** `Promise`<[KeyPair](_utils_key_pair_.keypair.md)>

___
<a id="getnetworks"></a>

##  getNetworks

▸ **getNetworks**(): `Promise`<`Array`<`string`>>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getNetworks](_key_stores_keystore_.keystore.md#getnetworks)*

*Defined in [key_stores/browser_local_storage_key_store.ts:44](https://github.com/nearprotocol/nearlib/blob/b149382/src.ts/key_stores/browser_local_storage_key_store.ts#L44)*

**Returns:** `Promise`<`Array`<`string`>>

___
<a id="removekey"></a>

##  removeKey

▸ **removeKey**(networkId: *`string`*, accountId: *`string`*): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[removeKey](_key_stores_keystore_.keystore.md#removekey)*

*Defined in [key_stores/browser_local_storage_key_store.ts:32](https://github.com/nearprotocol/nearlib/blob/b149382/src.ts/key_stores/browser_local_storage_key_store.ts#L32)*

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

*Defined in [key_stores/browser_local_storage_key_store.ts:20](https://github.com/nearprotocol/nearlib/blob/b149382/src.ts/key_stores/browser_local_storage_key_store.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |
| keyPair | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** `Promise`<`void`>

___

