

Keystore which can be used to merge multiple key stores into one virtual key store.

# Hierarchy

 [KeyStore](_key_stores_keystore_.keystore.md)

**↳ MergeKeyStore**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new MergeKeyStore**(keyStores: *[KeyStore](_key_stores_keystore_.keystore.md)[]*): [MergeKeyStore](_key_stores_merge_key_store_.mergekeystore.md)

*Defined in [key_stores/merge_key_store.ts:10](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/merge_key_store.ts#L10)*

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| keyStores | [KeyStore](_key_stores_keystore_.keystore.md)[] |  first keystore gets all write calls, read calls are attempted from start to end of array |

**Returns:** [MergeKeyStore](_key_stores_merge_key_store_.mergekeystore.md)

___

# Properties

<a id="keystores"></a>

##  keyStores

**● keyStores**: *[KeyStore](_key_stores_keystore_.keystore.md)[]*

*Defined in [key_stores/merge_key_store.ts:10](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/merge_key_store.ts#L10)*

___

# Methods

<a id="clear"></a>

##  clear

▸ **clear**(): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[clear](_key_stores_keystore_.keystore.md#clear)*

*Defined in [key_stores/merge_key_store.ts:40](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/merge_key_store.ts#L40)*

**Returns:** `Promise`<`void`>

___
<a id="getaccounts"></a>

##  getAccounts

▸ **getAccounts**(networkId: *`string`*): `Promise`<`string`[]>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getAccounts](_key_stores_keystore_.keystore.md#getaccounts)*

*Defined in [key_stores/merge_key_store.ts:56](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/merge_key_store.ts#L56)*

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

*Defined in [key_stores/merge_key_store.ts:24](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/merge_key_store.ts#L24)*

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

*Defined in [key_stores/merge_key_store.ts:46](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/merge_key_store.ts#L46)*

**Returns:** `Promise`<`string`[]>

___
<a id="removekey"></a>

##  removeKey

▸ **removeKey**(networkId: *`string`*, accountId: *`string`*): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[removeKey](_key_stores_keystore_.keystore.md#removekey)*

*Defined in [key_stores/merge_key_store.ts:34](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/merge_key_store.ts#L34)*

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

*Defined in [key_stores/merge_key_store.ts:20](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/merge_key_store.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |
| keyPair | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** `Promise`<`void`>

___

