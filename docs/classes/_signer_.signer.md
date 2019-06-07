

General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.

# Hierarchy

**Signer**

↳  [InMemorySigner](_signer_.inmemorysigner.md)

# Methods

<a id="createkey"></a>

## `<Abstract>` createKey

▸ **createKey**(accountId: *`string`*, networkId?: *`string`*): `Promise`<`string`>

*Defined in [signer.ts:15](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/signer.ts#L15)*

Creates new key and returns public key.

**Parameters:**

| Name | Type |
| ------ | ------ |
| accountId | `string` |
| `Optional` networkId | `string` |

**Returns:** `Promise`<`string`>

___
<a id="getpublickey"></a>

## `<Abstract>` getPublicKey

▸ **getPublicKey**(accountId?: *`string`*, networkId?: *`string`*): `Promise`<`string`>

*Defined in [signer.ts:22](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/signer.ts#L22)*

Returns public key for given account / network.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| `Optional` accountId | `string` |  accountId to retrieve from. |
| `Optional` networkId | `string` |  network for this accountId. |

**Returns:** `Promise`<`string`>

___
<a id="signhash"></a>

## `<Abstract>` signHash

▸ **signHash**(hash: *`Uint8Array`*, accountId?: *`string`*, networkId?: *`string`*): `Promise`<[Signature](../modules/_utils_key_pair_.md#signature)>

*Defined in [signer.ts:30](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/signer.ts#L30)*

Signs given hash.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| hash | `Uint8Array` |  hash to sign. |
| `Optional` accountId | `string` |  accountId to use for signing. |
| `Optional` networkId | `string` |  network for this accontId. |

**Returns:** `Promise`<[Signature](../modules/_utils_key_pair_.md#signature)>

___
<a id="signmessage"></a>

##  signMessage

▸ **signMessage**(message: *`Uint8Array`*, accountId?: *`string`*, networkId?: *`string`*): `Promise`<[Signature](../modules/_utils_key_pair_.md#signature)>

*Defined in [signer.ts:38](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/signer.ts#L38)*

Signs given message, by first hashing with sha256.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| message | `Uint8Array` |  message to sign. |
| `Optional` accountId | `string` |  accountId to use for signing. |
| `Optional` networkId | `string` |  network for this accontId. |

**Returns:** `Promise`<[Signature](../modules/_utils_key_pair_.md#signature)>

___

