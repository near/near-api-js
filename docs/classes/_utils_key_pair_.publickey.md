

PublicKey representation that has type and bytes of the key.

# Hierarchy

**PublicKey**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new PublicKey**(keyType: *[KeyType](../enums/_utils_key_pair_.keytype.md)*, data: *`Uint8Array`*): [PublicKey](_utils_key_pair_.publickey.md)

*Defined in [utils/key_pair.ts:37](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/key_pair.ts#L37)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| keyType | [KeyType](../enums/_utils_key_pair_.keytype.md) |
| data | `Uint8Array` |

**Returns:** [PublicKey](_utils_key_pair_.publickey.md)

___

# Properties

<a id="data"></a>

##  data

**● data**: *`Uint8Array`*

*Defined in [utils/key_pair.ts:37](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/key_pair.ts#L37)*

___
<a id="keytype"></a>

##  keyType

**● keyType**: *[KeyType](../enums/_utils_key_pair_.keytype.md)*

*Defined in [utils/key_pair.ts:36](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/key_pair.ts#L36)*

___

# Methods

<a id="tostring"></a>

##  toString

▸ **toString**(): `string`

*Defined in [utils/key_pair.ts:62](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/key_pair.ts#L62)*

**Returns:** `string`

___
<a id="from"></a>

## `<Static>` from

▸ **from**(value: *`string` \| [PublicKey](_utils_key_pair_.publickey.md)*): [PublicKey](_utils_key_pair_.publickey.md)

*Defined in [utils/key_pair.ts:44](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/key_pair.ts#L44)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `string` \| [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** [PublicKey](_utils_key_pair_.publickey.md)

___
<a id="fromstring"></a>

## `<Static>` fromString

▸ **fromString**(encodedKey: *`string`*): [PublicKey](_utils_key_pair_.publickey.md)

*Defined in [utils/key_pair.ts:51](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/key_pair.ts#L51)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| encodedKey | `string` |

**Returns:** [PublicKey](_utils_key_pair_.publickey.md)

___

