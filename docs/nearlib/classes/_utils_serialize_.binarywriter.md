---
id: "_utils_serialize_.binarywriter"
title: "BinaryWriter"
sidebar_label: "BinaryWriter"
---

## Hierarchy

* **BinaryWriter**

## Index

### Constructors

* [constructor](_utils_serialize_.binarywriter.md#constructor)

### Properties

* [buf](_utils_serialize_.binarywriter.md#buf)
* [length](_utils_serialize_.binarywriter.md#length)

### Methods

* [maybe_resize](_utils_serialize_.binarywriter.md#maybe_resize)
* [toArray](_utils_serialize_.binarywriter.md#toarray)
* [write_array](_utils_serialize_.binarywriter.md#write_array)
* [write_buffer](_utils_serialize_.binarywriter.md#private-write_buffer)
* [write_fixed_array](_utils_serialize_.binarywriter.md#write_fixed_array)
* [write_string](_utils_serialize_.binarywriter.md#write_string)
* [write_u128](_utils_serialize_.binarywriter.md#write_u128)
* [write_u32](_utils_serialize_.binarywriter.md#write_u32)
* [write_u64](_utils_serialize_.binarywriter.md#write_u64)
* [write_u8](_utils_serialize_.binarywriter.md#write_u8)

## Constructors

###  constructor

\+ **new BinaryWriter**(): *[BinaryWriter](_utils_serialize_.binarywriter.md)*

*Defined in [src.ts/utils/serialize.ts:45](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L45)*

**Returns:** *[BinaryWriter](_utils_serialize_.binarywriter.md)*

## Properties

###  buf

• **buf**: *Buffer*

*Defined in [src.ts/utils/serialize.ts:44](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L44)*

___

###  length

• **length**: *number*

*Defined in [src.ts/utils/serialize.ts:45](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L45)*

## Methods

###  maybe_resize

▸ **maybe_resize**(): *void*

*Defined in [src.ts/utils/serialize.ts:52](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L52)*

**Returns:** *void*

___

###  toArray

▸ **toArray**(): *Uint8Array*

*Defined in [src.ts/utils/serialize.ts:106](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L106)*

**Returns:** *Uint8Array*

___

###  write_array

▸ **write_array**(`array`: any[], `fn`: any): *void*

*Defined in [src.ts/utils/serialize.ts:97](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L97)*

**Parameters:**

Name | Type |
------ | ------ |
`array` | any[] |
`fn` | any |

**Returns:** *void*

___

### `Private` write_buffer

▸ **write_buffer**(`buffer`: Buffer): *void*

*Defined in [src.ts/utils/serialize.ts:80](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L80)*

**Parameters:**

Name | Type |
------ | ------ |
`buffer` | Buffer |

**Returns:** *void*

___

###  write_fixed_array

▸ **write_fixed_array**(`array`: Uint8Array): *void*

*Defined in [src.ts/utils/serialize.ts:93](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L93)*

**Parameters:**

Name | Type |
------ | ------ |
`array` | Uint8Array |

**Returns:** *void*

___

###  write_string

▸ **write_string**(`str`: string): *void*

*Defined in [src.ts/utils/serialize.ts:86](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L86)*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *void*

___

###  write_u128

▸ **write_u128**(`value`: BN): *void*

*Defined in [src.ts/utils/serialize.ts:75](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | BN |

**Returns:** *void*

___

###  write_u32

▸ **write_u32**(`value`: number): *void*

*Defined in [src.ts/utils/serialize.ts:64](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L64)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  write_u64

▸ **write_u64**(`value`: BN): *void*

*Defined in [src.ts/utils/serialize.ts:70](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | BN |

**Returns:** *void*

___

###  write_u8

▸ **write_u8**(`value`: number): *void*

*Defined in [src.ts/utils/serialize.ts:58](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*
