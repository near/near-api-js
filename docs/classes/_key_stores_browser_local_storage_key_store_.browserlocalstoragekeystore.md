

# Hierarchy

 [KeyStore](_key_stores_keystore_.keystore.md)

**↳ BrowserLocalStorageKeyStore**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new BrowserLocalStorageKeyStore**(localStorage?: *`any`*, prefix?: *`string`*): [BrowserLocalStorageKeyStore](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md)

*Defined in [key_stores/browser_local_storage_key_store.ts:10](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/browser_local_storage_key_store.ts#L10)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` localStorage | `any` |  window.localStorage |
| `Default value` prefix | `string` |  LOCAL_STORAGE_KEY_PREFIX |

**Returns:** [BrowserLocalStorageKeyStore](_key_stores_browser_local_storage_key_store_.browserlocalstoragekeystore.md)

___

# Properties

<a id="localstorage"></a>

## `<Private>` localStorage

**● localStorage**: *`any`*

*Defined in [key_stores/browser_local_storage_key_store.ts:9](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/browser_local_storage_key_store.ts#L9)*

___
<a id="prefix"></a>

## `<Private>` prefix

**● prefix**: *`string`*

*Defined in [key_stores/browser_local_storage_key_store.ts:10](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/browser_local_storage_key_store.ts#L10)*

___

# Methods

<a id="clear"></a>

##  clear

▸ **clear**(): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[clear](_key_stores_keystore_.keystore.md#clear)*

*Defined in [key_stores/browser_local_storage_key_store.ts:34](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/browser_local_storage_key_store.ts#L34)*

**Returns:** `Promise`<`void`>

___
<a id="getaccounts"></a>

##  getAccounts

▸ **getAccounts**(networkId: *`string`*): `Promise`<`string`[]>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getAccounts](_key_stores_keystore_.keystore.md#getaccounts)*

*Defined in [key_stores/browser_local_storage_key_store.ts:53](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/browser_local_storage_key_store.ts#L53)*

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

*Defined in [key_stores/browser_local_storage_key_store.ts:22](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/browser_local_storage_key_store.ts#L22)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |

**Returns:** `Promise`<[KeyPair](_utils_key_pair_.keypair.md)>

___
<a id="getnetworks"></a>

##  getNetworks

▸ **getNetworks**(): `Promise`<`string`[]>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getNetworks](_key_stores_keystore_.keystore.md#getnetworks)*

*Defined in [key_stores/browser_local_storage_key_store.ts:42](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/browser_local_storage_key_store.ts#L42)*

**Returns:** `Promise`<`string`[]>

___
<a id="removekey"></a>

##  removeKey

▸ **removeKey**(networkId: *`string`*, accountId: *`string`*): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[removeKey](_key_stores_keystore_.keystore.md#removekey)*

*Defined in [key_stores/browser_local_storage_key_store.ts:30](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/browser_local_storage_key_store.ts#L30)*

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

*Defined in [key_stores/browser_local_storage_key_store.ts:18](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/browser_local_storage_key_store.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |
| keyPair | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** `Promise`<`void`>

___
<a id="storagekeyforsecretkey"></a>

## `<Private>` storageKeyForSecretKey

▸ **storageKeyForSecretKey**(networkId: *`string`*, accountId: *`string`*): `string`

*Defined in [key_stores/browser_local_storage_key_store.ts:66](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/browser_local_storage_key_store.ts#L66)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |

**Returns:** `string`

___
<a id="storagekeys"></a>

## `<Private>` storageKeys

▸ **storageKeys**(): `IterableIterator`<`string`>

*Defined in [key_stores/browser_local_storage_key_store.ts:70](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/browser_local_storage_key_store.ts#L70)*

**Returns:** `IterableIterator`<`string`>

___

