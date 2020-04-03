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
* [read_fixed_array](_utils_serialize_.binaryreader.md#read_fixed_array)
* [read_string](_utils_serialize_.binaryreader.md#read_string)
* [read_u128](_utils_serialize_.binaryreader.md#read_u128)
* [read_u32](_utils_serialize_.binaryreader.md#read_u32)
* [read_u64](_utils_serialize_.binaryreader.md#read_u64)
* [read_u8](_utils_serialize_.binaryreader.md#read_u8)

## Constructors

###  constructor

\+ **new BinaryReader**(`buf`: Buffer): *[BinaryReader](_utils_serialize_.binaryreader.md)*

**Parameters:**

Name | Type |
------ | ------ |
`buf` | Buffer |

**Returns:** *[BinaryReader](_utils_serialize_.binaryreader.md)*

## Properties

###  buf

• **buf**: *Buffer*

___

###  offset

• **offset**: *number*

## Methods

###  read_array

▸ **read_array**(`fn`: any): *any[]*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | any |

**Returns:** *any[]*

___

###  read_fixed_array

▸ **read_fixed_array**(`len`: number): *Uint8Array*

**Parameters:**

Name | Type |
------ | ------ |
`len` | number |

**Returns:** *Uint8Array*

___

###  read_string

▸ **read_string**(): *string*

**Returns:** *string*

___

###  read_u128

▸ **read_u128**(): *BN*

**Returns:** *BN*

___

###  read_u32

▸ **read_u32**(): *number*

**Returns:** *number*

___

###  read_u64

▸ **read_u64**(): *BN*

**Returns:** *BN*

___

###  read_u8

▸ **read_u8**(): *number*

**Returns:** *number*
