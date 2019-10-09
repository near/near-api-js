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

*Defined in [utils/serialize.ts:24](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L24)*

**Returns:** *[BinaryWriter](_utils_serialize_.binarywriter.md)*

## Properties

###  buf

• **buf**: *Buffer*

*Defined in [utils/serialize.ts:23](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L23)*

___

###  length

• **length**: *number*

*Defined in [utils/serialize.ts:24](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L24)*

## Methods

###  maybe_resize

▸ **maybe_resize**(): *void*

*Defined in [utils/serialize.ts:31](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L31)*

**Returns:** *void*

___

###  toArray

▸ **toArray**(): *Uint8Array*

*Defined in [utils/serialize.ts:85](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L85)*

**Returns:** *Uint8Array*

___

###  write_array

▸ **write_array**(`array`: any[], `fn`: any): *void*

*Defined in [utils/serialize.ts:76](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`array` | any[] |
`fn` | any |

**Returns:** *void*

___

### `Private` write_buffer

▸ **write_buffer**(`buffer`: Buffer): *void*

*Defined in [utils/serialize.ts:59](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L59)*

**Parameters:**

Name | Type |
------ | ------ |
`buffer` | Buffer |

**Returns:** *void*

___

###  write_fixed_array

▸ **write_fixed_array**(`array`: Uint8Array): *void*

*Defined in [utils/serialize.ts:72](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`array` | Uint8Array |

**Returns:** *void*

___

###  write_string

▸ **write_string**(`str`: string): *void*

*Defined in [utils/serialize.ts:65](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *void*

___

###  write_u128

▸ **write_u128**(`value`: BN): *void*

*Defined in [utils/serialize.ts:54](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | BN |

**Returns:** *void*

___

###  write_u32

▸ **write_u32**(`value`: number): *void*

*Defined in [utils/serialize.ts:43](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  write_u64

▸ **write_u64**(`value`: BN): *void*

*Defined in [utils/serialize.ts:49](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | BN |

**Returns:** *void*

___

###  write_u8

▸ **write_u8**(`value`: number): *void*

*Defined in [utils/serialize.ts:37](https://github.com/nearprotocol/nearlib/blob/cbaa79a/src.ts/utils/serialize.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*
