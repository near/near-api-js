

# Hierarchy

**KeyPair**

↳  [KeyPairEd25519](_utils_key_pair_.keypaired25519.md)

# Methods

<a id="getpublickey"></a>

## `<Abstract>` getPublicKey

▸ **getPublicKey**(): `string`

*Defined in [utils/key_pair.ts:17](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L17)*

**Returns:** `string`

___
<a id="sign"></a>

## `<Abstract>` sign

▸ **sign**(message: *`Uint8Array`*): [Signature](../interfaces/_utils_key_pair_.signature.md)

*Defined in [utils/key_pair.ts:14](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | `Uint8Array` |

**Returns:** [Signature](../interfaces/_utils_key_pair_.signature.md)

___
<a id="tostring"></a>

## `<Abstract>` toString

▸ **toString**(): `string`

*Defined in [utils/key_pair.ts:16](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L16)*

**Returns:** `string`

___
<a id="verify"></a>

## `<Abstract>` verify

▸ **verify**(message: *`Uint8Array`*, signature: *`Uint8Array`*): `boolean`

*Defined in [utils/key_pair.ts:15](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L15)*

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

*Defined in [utils/key_pair.ts:19](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L19)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| curve | `string` |

**Returns:** [KeyPair](_utils_key_pair_.keypair.md)

___
<a id="fromstring"></a>

## `<Static>` fromString

▸ **fromString**(encodedKey: *`string`*): [KeyPair](_utils_key_pair_.keypair.md)

*Defined in [utils/key_pair.ts:26](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| encodedKey | `string` |

**Returns:** [KeyPair](_utils_key_pair_.keypair.md)

___

