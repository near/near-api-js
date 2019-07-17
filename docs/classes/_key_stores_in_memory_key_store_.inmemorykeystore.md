

Simple in-memory keystore for testing purposes.

# Hierarchy

 [KeyStore](_key_stores_keystore_.keystore.md)

**↳ InMemoryKeyStore**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new InMemoryKeyStore**(): [InMemoryKeyStore](_key_stores_in_memory_key_store_.inmemorykeystore.md)

*Defined in [key_stores/in_memory_key_store.ts:10](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/in_memory_key_store.ts#L10)*

**Returns:** [InMemoryKeyStore](_key_stores_in_memory_key_store_.inmemorykeystore.md)

___

# Properties

<a id="keys"></a>

## `<Private>` keys

**● keys**: *`object`*

*Defined in [key_stores/in_memory_key_store.ts:10](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/in_memory_key_store.ts#L10)*

#### Type declaration

[key: `string`]: `string`

___

# Methods

<a id="clear"></a>

##  clear

▸ **clear**(): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[clear](_key_stores_keystore_.keystore.md#clear)*

*Defined in [key_stores/in_memory_key_store.ts:33](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/in_memory_key_store.ts#L33)*

**Returns:** `Promise`<`void`>

___
<a id="getaccounts"></a>

##  getAccounts

▸ **getAccounts**(networkId: *`string`*): `Promise`<`string`[]>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[getAccounts](_key_stores_keystore_.keystore.md#getaccounts)*

*Defined in [key_stores/in_memory_key_store.ts:46](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/in_memory_key_store.ts#L46)*

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

*Defined in [key_stores/in_memory_key_store.ts:21](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/in_memory_key_store.ts#L21)*

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

*Defined in [key_stores/in_memory_key_store.ts:37](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/in_memory_key_store.ts#L37)*

**Returns:** `Promise`<`string`[]>

___
<a id="removekey"></a>

##  removeKey

▸ **removeKey**(networkId: *`string`*, accountId: *`string`*): `Promise`<`void`>

*Overrides [KeyStore](_key_stores_keystore_.keystore.md).[removeKey](_key_stores_keystore_.keystore.md#removekey)*

*Defined in [key_stores/in_memory_key_store.ts:29](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/in_memory_key_store.ts#L29)*

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

*Defined in [key_stores/in_memory_key_store.ts:17](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/key_stores/in_memory_key_store.ts#L17)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `string` |
| accountId | `string` |
| keyPair | [KeyPair](_utils_key_pair_.keypair.md) |

**Returns:** `Promise`<`void`>

___

