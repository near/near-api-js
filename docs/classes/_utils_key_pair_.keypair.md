

# Hierarchy

**KeyPair**

↳  [KeyPairEd25519](_utils_key_pair_.keypaired25519.md)

# Methods

<a id="getpublickey"></a>

## `<Abstract>` getPublicKey

▸ **getPublicKey**(): [PublicKey](_utils_key_pair_.publickey.md)

*Defined in [utils/key_pair.ts:71](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/key_pair.ts#L71)*

**Returns:** [PublicKey](_utils_key_pair_.publickey.md)

___
<a id="sign"></a>

## `<Abstract>` sign

▸ **sign**(message: *`Uint8Array`*): [Signature](../interfaces/_utils_key_pair_.signature.md)

*Defined in [utils/key_pair.ts:68](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/key_pair.ts#L68)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | `Uint8Array` |

**Returns:** [Signature](../interfaces/_utils_key_pair_.signature.md)

___
<a id="tostring"></a>

## `<Abstract>` toString

▸ **toString**(): `string`

*Defined in [utils/key_pair.ts:70](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/key_pair.ts#L70)*

**Returns:** `string`

___
<a id="verify"></a>

## `<Abstract>` verify

▸ **verify**(message: *`Uint8Array`*, signature: *`Uint8Array`*): `boolean`

*Defined in [utils/key_pair.ts:69](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/key_pair.ts#L69)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | `Uint8Array` |
| signature | `Uint8Array` |

**Returns:** `boolean`

___
<a id="fromrandom"></a>

## `<Static>` fromRandom

▸ **fromRandom**(curve: *`string`*): [KeyPair](_utils_key_pair_.keypair.md)

*Defined in [utils/key_pair.ts:73](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/key_pair.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| curve | `string` |

**Returns:** [KeyPair](_utils_key_pair_.keypair.md)

___
<a id="fromstring"></a>

## `<Static>` fromString

▸ **fromString**(encodedKey: *`string`*): [KeyPair](_utils_key_pair_.keypair.md)

*Defined in [utils/key_pair.ts:80](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/key_pair.ts#L80)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| encodedKey | `string` |

**Returns:** [KeyPair](_utils_key_pair_.keypair.md)

___

