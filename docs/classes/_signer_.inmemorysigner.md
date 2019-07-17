

Signs using in memory key store.

# Hierarchy

 [Signer](_signer_.signer.md)

**↳ InMemorySigner**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new InMemorySigner**(keyStore: *[KeyStore](_key_stores_keystore_.keystore.md)*): [InMemorySigner](_signer_.inmemorysigner.md)

*Defined in [signer.ts:47](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/signer.ts#L47)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| keyStore | [KeyStore](_key_stores_keystore_.keystore.md) |

**Returns:** [InMemorySigner](_signer_.inmemorysigner.md)

___

# Properties

<a id="keystore"></a>

##  keyStore

**● keyStore**: *[KeyStore](_key_stores_keystore_.keystore.md)*

*Defined in [signer.ts:47](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/signer.ts#L47)*

___

# Methods

<a id="createkey"></a>

##  createKey

▸ **createKey**(accountId: *`string`*, networkId: *`string`*): `Promise`<`string`>

*Overrides [Signer](_signer_.signer.md).[createKey](_signer_.signer.md#createkey)*

*Defined in [signer.ts:54](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/signer.ts#L54)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| accountId | `string` |
| networkId | `string` |

**Returns:** `Promise`<`string`>

___
<a id="getpublickey"></a>

##  getPublicKey

▸ **getPublicKey**(accountId?: *`string`*, networkId?: *`string`*): `Promise`<`string`>

*Overrides [Signer](_signer_.signer.md).[getPublicKey](_signer_.signer.md#getpublickey)*

*Defined in [signer.ts:60](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/signer.ts#L60)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` accountId | `string` |
| `Optional` networkId | `string` |

**Returns:** `Promise`<`string`>

___
<a id="signhash"></a>

##  signHash

▸ **signHash**(hash: *`Uint8Array`*, accountId?: *`string`*, networkId?: *`string`*): `Promise`<[Signature](../interfaces/_utils_key_pair_.signature.md)>

*Overrides [Signer](_signer_.signer.md).[signHash](_signer_.signer.md#signhash)*

*Defined in [signer.ts:65](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/signer.ts#L65)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| hash | `Uint8Array` |
| `Optional` accountId | `string` |
| `Optional` networkId | `string` |

**Returns:** `Promise`<[Signature](../interfaces/_utils_key_pair_.signature.md)>

___
<a id="signmessage"></a>

##  signMessage

▸ **signMessage**(message: *`Uint8Array`*, accountId?: *`string`*, networkId?: *`string`*): `Promise`<[Signature](../interfaces/_utils_key_pair_.signature.md)>

*Inherited from [Signer](_signer_.signer.md).[signMessage](_signer_.signer.md#signmessage)*

*Defined in [signer.ts:38](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/signer.ts#L38)*

Signs given message, by first hashing with sha256.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| message | `Uint8Array` |  message to sign. |
| `Optional` accountId | `string` |  accountId to use for signing. |
| `Optional` networkId | `string` |  network for this accontId. |

**Returns:** `Promise`<[Signature](../interfaces/_utils_key_pair_.signature.md)>

___

