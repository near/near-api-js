

This class provides key pair functionality for Ed25519 curve: generating key pairs, encoding key pairs, signing and verifying.

# Hierarchy

 [KeyPair](_utils_key_pair_.keypair.md)

**↳ KeyPairEd25519**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new KeyPairEd25519**(secretKey: *`string`*): [KeyPairEd25519](_utils_key_pair_.keypaired25519.md)

*Defined in [utils/key_pair.ts:44](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L44)*

Construct an instance of key pair given a secret key. It's generally assumed that these are encoded in base58.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| secretKey | `string` |   |

**Returns:** [KeyPairEd25519](_utils_key_pair_.keypaired25519.md)

___

# Properties

<a id="publickey"></a>

##  publicKey

**● publicKey**: *`string`*

*Defined in [utils/key_pair.ts:43](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L43)*

___
<a id="secretkey"></a>

##  secretKey

**● secretKey**: *`string`*

*Defined in [utils/key_pair.ts:44](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L44)*

___

# Methods

<a id="getpublickey"></a>

##  getPublicKey

▸ **getPublicKey**(): `string`

*Overrides [KeyPair](_utils_key_pair_.keypair.md).[getPublicKey](_utils_key_pair_.keypair.md#getpublickey)*

*Defined in [utils/key_pair.ts:86](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L86)*

**Returns:** `string`

___
<a id="sign"></a>

##  sign

▸ **sign**(message: *`Uint8Array`*): [Signature](../interfaces/_utils_key_pair_.signature.md)

*Overrides [KeyPair](_utils_key_pair_.keypair.md).[sign](_utils_key_pair_.keypair.md#sign)*

*Defined in [utils/key_pair.ts:73](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | `Uint8Array` |

**Returns:** [Signature](../interfaces/_utils_key_pair_.signature.md)

___
<a id="tostring"></a>

##  toString

▸ **toString**(): `string`

*Overrides [KeyPair](_utils_key_pair_.keypair.md).[toString](_utils_key_pair_.keypair.md#tostring)*

*Defined in [utils/key_pair.ts:82](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L82)*

**Returns:** `string`

___
<a id="verify"></a>

##  verify

▸ **verify**(message: *`Uint8Array`*, signature: *`Uint8Array`*): `boolean`

*Overrides [KeyPair](_utils_key_pair_.keypair.md).[verify](_utils_key_pair_.keypair.md#verify)*

*Defined in [utils/key_pair.ts:78](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L78)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | `Uint8Array` |
| signature | `Uint8Array` |

**Returns:** `boolean`

___
<a id="fromrandom"></a>

## `<Static>` fromRandom

▸ **fromRandom**(): [KeyPairEd25519](_utils_key_pair_.keypaired25519.md)

*Overrides [KeyPair](_utils_key_pair_.keypair.md).[fromRandom](_utils_key_pair_.keypair.md#fromrandom)*

*Defined in [utils/key_pair.ts:68](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L68)*

Generate a new random keypair.

*__example__*: const keyRandom = KeyPair.fromRandom(); keyRandom.publicKey // returns \[PUBLIC\_KEY\]

keyRandom.secretKey // returns \[SECRET\_KEY\]

**Returns:** [KeyPairEd25519](_utils_key_pair_.keypaired25519.md)

___
<a id="fromstring"></a>

## `<Static>` fromString

▸ **fromString**(encodedKey: *`string`*): [KeyPair](_utils_key_pair_.keypair.md)

*Inherited from [KeyPair](_utils_key_pair_.keypair.md).[fromString](_utils_key_pair_.keypair.md#fromstring)*

*Defined in [utils/key_pair.ts:26](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/key_pair.ts#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| encodedKey | `string` |

**Returns:** [KeyPair](_utils_key_pair_.keypair.md)

___

