

# Hierarchy

**BinaryReader**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new BinaryReader**(buf: *`Buffer`*): [BinaryReader](_utils_serialize_.binaryreader.md)

*Defined in [utils/serialize.ts:89](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L89)*

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

*Defined in [utils/serialize.ts:88](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L88)*

___
<a id="offset"></a>

##  offset

**● offset**: *`number`*

*Defined in [utils/serialize.ts:89](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L89)*

___

# Methods

<a id="read_array"></a>

##  read_array

▸ **read_array**(fn: *`any`*): `any`[]

*Defined in [utils/serialize.ts:134](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L134)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `any` |

**Returns:** `any`[]

___
<a id="read_buffer"></a>

## `<Private>` read_buffer

▸ **read_buffer**(len: *`number`*): `Buffer`

*Defined in [utils/serialize.ts:119](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L119)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| len | `number` |

**Returns:** `Buffer`

___
<a id="read_fixed_array"></a>

##  read_fixed_array

▸ **read_fixed_array**(len: *`number`*): `Uint8Array`

*Defined in [utils/serialize.ts:130](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L130)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| len | `number` |

**Returns:** `Uint8Array`

___
<a id="read_string"></a>

##  read_string

▸ **read_string**(): `string`

*Defined in [utils/serialize.ts:125](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L125)*

**Returns:** `string`

___
<a id="read_u128"></a>

##  read_u128

▸ **read_u128**(): `BN`

*Defined in [utils/serialize.ts:114](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L114)*

**Returns:** `BN`

___
<a id="read_u32"></a>

##  read_u32

▸ **read_u32**(): `number`

*Defined in [utils/serialize.ts:102](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L102)*

**Returns:** `number`

___
<a id="read_u64"></a>

##  read_u64

▸ **read_u64**(): `BN`

*Defined in [utils/serialize.ts:108](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L108)*

**Returns:** `BN`

___
<a id="read_u8"></a>

##  read_u8

▸ **read_u8**(): `number`

*Defined in [utils/serialize.ts:96](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L96)*

**Returns:** `number`

___

