

# Hierarchy

**BinaryWriter**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new BinaryWriter**(): [BinaryWriter](_utils_serialize_.binarywriter.md)

*Defined in [utils/serialize.ts:24](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L24)*

**Returns:** [BinaryWriter](_utils_serialize_.binarywriter.md)

___

# Properties

<a id="buf"></a>

##  buf

**● buf**: *`Buffer`*

*Defined in [utils/serialize.ts:23](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L23)*

___
<a id="length"></a>

##  length

**● length**: *`number`*

*Defined in [utils/serialize.ts:24](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L24)*

___

# Methods

<a id="maybe_resize"></a>

##  maybe_resize

▸ **maybe_resize**(): `void`

*Defined in [utils/serialize.ts:31](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L31)*

**Returns:** `void`

___
<a id="toarray"></a>

##  toArray

▸ **toArray**(): `Uint8Array`

*Defined in [utils/serialize.ts:85](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L85)*

**Returns:** `Uint8Array`

___
<a id="write_array"></a>

##  write_array

▸ **write_array**(array: *`any`[]*, fn: *`any`*): `void`

*Defined in [utils/serialize.ts:76](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L76)*

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

*Defined in [utils/serialize.ts:59](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L59)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| buffer | `Buffer` |

**Returns:** `void`

___
<a id="write_fixed_array"></a>

##  write_fixed_array

▸ **write_fixed_array**(array: *`Uint8Array`*): `void`

*Defined in [utils/serialize.ts:72](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L72)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| array | `Uint8Array` |

**Returns:** `void`

___
<a id="write_string"></a>

##  write_string

▸ **write_string**(str: *`string`*): `void`

*Defined in [utils/serialize.ts:65](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L65)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| str | `string` |

**Returns:** `void`

___
<a id="write_u128"></a>

##  write_u128

▸ **write_u128**(value: *`BN`*): `void`

*Defined in [utils/serialize.ts:54](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L54)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `BN` |

**Returns:** `void`

___
<a id="write_u32"></a>

##  write_u32

▸ **write_u32**(value: *`number`*): `void`

*Defined in [utils/serialize.ts:43](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L43)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `number` |

**Returns:** `void`

___
<a id="write_u64"></a>

##  write_u64

▸ **write_u64**(value: *`BN`*): `void`

*Defined in [utils/serialize.ts:49](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `BN` |

**Returns:** `void`

___
<a id="write_u8"></a>

##  write_u8

▸ **write_u8**(value: *`number`*): `void`

*Defined in [utils/serialize.ts:37](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L37)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `number` |

**Returns:** `void`

___

