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

*Defined in [utils/serialize.ts:92](https://github.com/nearprotocol/nearlib/blob/08f7443/src.ts/utils/serialize.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`buf` | Buffer |

**Returns:** *[BinaryReader](_utils_serialize_.binaryreader.md)*

## Properties

###  buf

• **buf**: *Buffer*

*Defined in [utils/serialize.ts:91](https://github.com/nearprotocol/nearlib/blob/08f7443/src.ts/utils/serialize.ts#L91)*

___

###  offset

• **offset**: *number*

*Defined in [utils/serialize.ts:92](https://github.com/nearprotocol/nearlib/blob/08f7443/src.ts/utils/serialize.ts#L92)*

## Methods

###  read_array

▸ **read_array**(`fn`: any): *any[]*

*Defined in [utils/serialize.ts:137](https://github.com/nearprotocol/nearlib/blob/08f7443/src.ts/utils/serialize.ts#L137)*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | any |

**Returns:** *any[]*

___

### `Private` read_buffer

▸ **read_buffer**(`len`: number): *Buffer*

*Defined in [utils/serialize.ts:122](https://github.com/nearprotocol/nearlib/blob/08f7443/src.ts/utils/serialize.ts#L122)*

**Parameters:**

Name | Type |
------ | ------ |
`len` | number |

**Returns:** *Buffer*

___

###  read_fixed_array

▸ **read_fixed_array**(`len`: number): *Uint8Array*

*Defined in [utils/serialize.ts:133](https://github.com/nearprotocol/nearlib/blob/08f7443/src.ts/utils/serialize.ts#L133)*

**Parameters:**

Name | Type |
------ | ------ |
`len` | number |

**Returns:** *Uint8Array*

___

###  read_string

▸ **read_string**(): *string*

*Defined in [utils/serialize.ts:128](https://github.com/nearprotocol/nearlib/blob/08f7443/src.ts/utils/serialize.ts#L128)*

**Returns:** *string*

___

###  read_u128

▸ **read_u128**(): *BN*

*Defined in [utils/serialize.ts:117](https://github.com/nearprotocol/nearlib/blob/08f7443/src.ts/utils/serialize.ts#L117)*

**Returns:** *BN*

___

###  read_u32

▸ **read_u32**(): *number*

*Defined in [utils/serialize.ts:105](https://github.com/nearprotocol/nearlib/blob/08f7443/src.ts/utils/serialize.ts#L105)*

**Returns:** *number*

___

###  read_u64

▸ **read_u64**(): *BN*

*Defined in [utils/serialize.ts:111](https://github.com/nearprotocol/nearlib/blob/08f7443/src.ts/utils/serialize.ts#L111)*

**Returns:** *BN*

___

###  read_u8

▸ **read_u8**(): *number*

*Defined in [utils/serialize.ts:99](https://github.com/nearprotocol/nearlib/blob/08f7443/src.ts/utils/serialize.ts#L99)*

**Returns:** *number*
