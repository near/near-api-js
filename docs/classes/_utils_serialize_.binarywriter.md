

# Hierarchy

**BinaryWriter**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new BinaryWriter**(): [BinaryWriter](_utils_serialize_.binarywriter.md)

*Defined in [utils/serialize.ts:22](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L22)*

**Returns:** [BinaryWriter](_utils_serialize_.binarywriter.md)

___

# Properties

<a id="buf"></a>

##  buf

**● buf**: *`Buffer`*

*Defined in [utils/serialize.ts:21](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L21)*

___
<a id="length"></a>

##  length

**● length**: *`number`*

*Defined in [utils/serialize.ts:22](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L22)*

___

# Methods

<a id="maybe_resize"></a>

##  maybe_resize

▸ **maybe_resize**(): `void`

*Defined in [utils/serialize.ts:29](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L29)*

**Returns:** `void`

___
<a id="toarray"></a>

##  toArray

▸ **toArray**(): `Uint8Array`

*Defined in [utils/serialize.ts:82](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L82)*

**Returns:** `Uint8Array`

___
<a id="write_array"></a>

##  write_array

▸ **write_array**(array: *`any`[]*, fn: *`any`*): `void`

*Defined in [utils/serialize.ts:73](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| array | `any`[] |
| fn | `any` |

**Returns:** `void`

___
<a id="write_buffer"></a>

## `<Private>` write_buffer

▸ **write_buffer**(buffer: *`Buffer`*): `void`

*Defined in [utils/serialize.ts:57](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L57)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| buffer | `Buffer` |

**Returns:** `void`

___
<a id="write_fixed_array"></a>

##  write_fixed_array

▸ **write_fixed_array**(array: *`Uint8Array`*): `void`

*Defined in [utils/serialize.ts:69](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L69)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| array | `Uint8Array` |

**Returns:** `void`

___
<a id="write_string"></a>

##  write_string

▸ **write_string**(str: *`string`*): `void`

*Defined in [utils/serialize.ts:62](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L62)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| str | `string` |

**Returns:** `void`

___
<a id="write_u128"></a>

##  write_u128

▸ **write_u128**(value: *`BN`*): `void`

*Defined in [utils/serialize.ts:52](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L52)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `BN` |

**Returns:** `void`

___
<a id="write_u32"></a>

##  write_u32

▸ **write_u32**(value: *`number`*): `void`

*Defined in [utils/serialize.ts:41](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L41)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `number` |

**Returns:** `void`

___
<a id="write_u64"></a>

##  write_u64

▸ **write_u64**(value: *`BN`*): `void`

*Defined in [utils/serialize.ts:47](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L47)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `BN` |

**Returns:** `void`

___
<a id="write_u8"></a>

##  write_u8

▸ **write_u8**(value: *`number`*): `void`

*Defined in [utils/serialize.ts:35](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L35)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `number` |

**Returns:** `void`

___

