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

*Defined in [src.ts/utils/serialize.ts:133](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L133)*

**Parameters:**

Name | Type |
------ | ------ |
`buf` | Buffer |

**Returns:** *[BinaryReader](_utils_serialize_.binaryreader.md)*

## Properties

###  buf

• **buf**: *Buffer*

*Defined in [src.ts/utils/serialize.ts:132](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L132)*

___

###  offset

• **offset**: *number*

*Defined in [src.ts/utils/serialize.ts:133](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L133)*

## Methods

###  read_array

▸ **read_array**(`fn`: any): *any[]*

*Defined in [src.ts/utils/serialize.ts:193](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L193)*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | any |

**Returns:** *any[]*

___

### `Private` read_buffer

▸ **read_buffer**(`len`: number): *Buffer*

*Defined in [src.ts/utils/serialize.ts:166](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L166)*

**Parameters:**

Name | Type |
------ | ------ |
`len` | number |

**Returns:** *Buffer*

___

###  read_fixed_array

▸ **read_fixed_array**(`len`: number): *Uint8Array*

*Defined in [src.ts/utils/serialize.ts:188](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L188)*

**Parameters:**

Name | Type |
------ | ------ |
`len` | number |

**Returns:** *Uint8Array*

___

###  read_string

▸ **read_string**(): *string*

*Defined in [src.ts/utils/serialize.ts:176](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L176)*

**Returns:** *string*

___

###  read_u128

▸ **read_u128**(): *BN*

*Defined in [src.ts/utils/serialize.ts:161](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L161)*

**Returns:** *BN*

___

###  read_u32

▸ **read_u32**(): *number*

*Defined in [src.ts/utils/serialize.ts:148](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L148)*

**Returns:** *number*

___

###  read_u64

▸ **read_u64**(): *BN*

*Defined in [src.ts/utils/serialize.ts:155](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L155)*

**Returns:** *BN*

___

###  read_u8

▸ **read_u8**(): *number*

*Defined in [src.ts/utils/serialize.ts:141](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L141)*

**Returns:** *number*
