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
* [write_fixed_array](_utils_serialize_.binarywriter.md#write_fixed_array)
* [write_string](_utils_serialize_.binarywriter.md#write_string)
* [write_u128](_utils_serialize_.binarywriter.md#write_u128)
* [write_u32](_utils_serialize_.binarywriter.md#write_u32)
* [write_u64](_utils_serialize_.binarywriter.md#write_u64)
* [write_u8](_utils_serialize_.binarywriter.md#write_u8)

## Constructors

###  constructor

\+ **new BinaryWriter**(): *[BinaryWriter](_utils_serialize_.binarywriter.md)*

**Returns:** *[BinaryWriter](_utils_serialize_.binarywriter.md)*

## Properties

###  buf

• **buf**: *Buffer*

___

###  length

• **length**: *number*

## Methods

###  maybe_resize

▸ **maybe_resize**(): *void*

**Returns:** *void*

___

###  toArray

▸ **toArray**(): *Uint8Array*

**Returns:** *Uint8Array*

___

###  write_array

▸ **write_array**(`array`: any[], `fn`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`array` | any[] |
`fn` | any |

**Returns:** *void*

___

###  write_fixed_array

▸ **write_fixed_array**(`array`: Uint8Array): *void*

**Parameters:**

Name | Type |
------ | ------ |
`array` | Uint8Array |

**Returns:** *void*

___

###  write_string

▸ **write_string**(`str`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *void*

___

###  write_u128

▸ **write_u128**(`value`: BN): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | BN |

**Returns:** *void*

___

###  write_u32

▸ **write_u32**(`value`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  write_u64

▸ **write_u64**(`value`: BN): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | BN |

**Returns:** *void*

___

###  write_u8

▸ **write_u8**(`value`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*
