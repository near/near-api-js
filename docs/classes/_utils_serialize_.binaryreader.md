

# Hierarchy

**BinaryReader**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new BinaryReader**(buf: *`Buffer`*): [BinaryReader](_utils_serialize_.binaryreader.md)

*Defined in [utils/serialize.ts:92](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L92)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| buf | `Buffer` |

**Returns:** [BinaryReader](_utils_serialize_.binaryreader.md)

___

# Properties

<a id="buf"></a>

##  buf

**● buf**: *`Buffer`*

*Defined in [utils/serialize.ts:91](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L91)*

___
<a id="offset"></a>

##  offset

**● offset**: *`number`*

*Defined in [utils/serialize.ts:92](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L92)*

___

# Methods

<a id="read_array"></a>

##  read_array

▸ **read_array**(fn: *`any`*): `any`[]

*Defined in [utils/serialize.ts:137](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L137)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `any` |

**Returns:** `any`[]

___
<a id="read_buffer"></a>

## `<Private>` read_buffer

▸ **read_buffer**(len: *`number`*): `Buffer`

*Defined in [utils/serialize.ts:122](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L122)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| len | `number` |

**Returns:** `Buffer`

___
<a id="read_fixed_array"></a>

##  read_fixed_array

▸ **read_fixed_array**(len: *`number`*): `Uint8Array`

*Defined in [utils/serialize.ts:133](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L133)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| len | `number` |

**Returns:** `Uint8Array`

___
<a id="read_string"></a>

##  read_string

▸ **read_string**(): `string`

*Defined in [utils/serialize.ts:128](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L128)*

**Returns:** `string`

___
<a id="read_u128"></a>

##  read_u128

▸ **read_u128**(): `BN`

*Defined in [utils/serialize.ts:117](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L117)*

**Returns:** `BN`

___
<a id="read_u32"></a>

##  read_u32

▸ **read_u32**(): `number`

*Defined in [utils/serialize.ts:105](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L105)*

**Returns:** `number`

___
<a id="read_u64"></a>

##  read_u64

▸ **read_u64**(): `BN`

*Defined in [utils/serialize.ts:111](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L111)*

**Returns:** `BN`

___
<a id="read_u8"></a>

##  read_u8

▸ **read_u8**(): `number`

*Defined in [utils/serialize.ts:99](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L99)*

**Returns:** `number`

___

