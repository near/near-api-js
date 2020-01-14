---
id: "_utils_serialize_.binaryreader"
title: "BinaryReader"
sidebar_label: "BinaryReader"
---

## Hierarchy

* **BinaryReader**

## Index

### Constructors

* [constructor](_utils_serialize_.binaryreader.md#constructor)

### Properties

* [buf](_utils_serialize_.binaryreader.md#buf)
* [offset](_utils_serialize_.binaryreader.md#offset)

### Methods

* [read_array](_utils_serialize_.binaryreader.md#read_array)
* [read_buffer](_utils_serialize_.binaryreader.md#private-read_buffer)
* [read_fixed_array](_utils_serialize_.binaryreader.md#read_fixed_array)
* [read_string](_utils_serialize_.binaryreader.md#read_string)
* [read_u128](_utils_serialize_.binaryreader.md#read_u128)
* [read_u32](_utils_serialize_.binaryreader.md#read_u32)
* [read_u64](_utils_serialize_.binaryreader.md#read_u64)
* [read_u8](_utils_serialize_.binaryreader.md#read_u8)

## Constructors

###  constructor

\+ **new BinaryReader**(`buf`: Buffer): *[BinaryReader](_utils_serialize_.binaryreader.md)*

*Defined in [src.ts/utils/serialize.ts:130](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L130)*

**Parameters:**

Name | Type |
------ | ------ |
`buf` | Buffer |

**Returns:** *[BinaryReader](_utils_serialize_.binaryreader.md)*

## Properties

###  buf

• **buf**: *Buffer*

*Defined in [src.ts/utils/serialize.ts:129](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L129)*

___

###  offset

• **offset**: *number*

*Defined in [src.ts/utils/serialize.ts:130](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L130)*

## Methods

###  read_array

▸ **read_array**(`fn`: any): *any[]*

*Defined in [src.ts/utils/serialize.ts:190](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L190)*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | any |

**Returns:** *any[]*

___

### `Private` read_buffer

▸ **read_buffer**(`len`: number): *Buffer*

*Defined in [src.ts/utils/serialize.ts:163](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L163)*

**Parameters:**

Name | Type |
------ | ------ |
`len` | number |

**Returns:** *Buffer*

___

###  read_fixed_array

▸ **read_fixed_array**(`len`: number): *Uint8Array*

*Defined in [src.ts/utils/serialize.ts:185](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L185)*

**Parameters:**

Name | Type |
------ | ------ |
`len` | number |

**Returns:** *Uint8Array*

___

###  read_string

▸ **read_string**(): *string*

*Defined in [src.ts/utils/serialize.ts:173](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L173)*

**Returns:** *string*

___

###  read_u128

▸ **read_u128**(): *BN*

*Defined in [src.ts/utils/serialize.ts:158](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L158)*

**Returns:** *BN*

___

###  read_u32

▸ **read_u32**(): *number*

*Defined in [src.ts/utils/serialize.ts:145](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L145)*

**Returns:** *number*

___

###  read_u64

▸ **read_u64**(): *BN*

*Defined in [src.ts/utils/serialize.ts:152](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L152)*

**Returns:** *BN*

___

###  read_u8

▸ **read_u8**(): *number*

*Defined in [src.ts/utils/serialize.ts:138](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L138)*

**Returns:** *number*
