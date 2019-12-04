---
id: "_utils_serialize_"
title: "utils/serialize"
sidebar_label: "utils/serialize"
---

## Index

### Classes

* [BinaryReader](../classes/_utils_serialize_.binaryreader.md)
* [BinaryWriter](../classes/_utils_serialize_.binarywriter.md)
* [BorshError](../classes/_utils_serialize_.borsherror.md)

### Type aliases

* [Schema](_utils_serialize_.md#schema)

### Variables

* [INITIAL_LENGTH](_utils_serialize_.md#const-initial_length)
* [textDecoder](_utils_serialize_.md#const-textdecoder)

### Functions

* [base_decode](_utils_serialize_.md#base_decode)
* [base_encode](_utils_serialize_.md#base_encode)
* [deserialize](_utils_serialize_.md#deserialize)
* [deserializeField](_utils_serialize_.md#deserializefield)
* [deserializeStruct](_utils_serialize_.md#deserializestruct)
* [handlingRangeError](_utils_serialize_.md#handlingrangeerror)
* [serialize](_utils_serialize_.md#serialize)
* [serializeField](_utils_serialize_.md#serializefield)
* [serializeStruct](_utils_serialize_.md#serializestruct)

## Type aliases

###  Schema

Ƭ **Schema**: *Map‹Function, any›*

*Defined in [src.ts/utils/serialize.ts:27](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L27)*

## Variables

### `Const` INITIAL_LENGTH

• **INITIAL_LENGTH**: *1024* = 1024

*Defined in [src.ts/utils/serialize.ts:25](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L25)*

___

### `Const` textDecoder

• **textDecoder**: *TextDecoder* =  new TextDecoder('utf-8', { fatal: true })

*Defined in [src.ts/utils/serialize.ts:12](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L12)*

## Functions

###  base_decode

▸ **base_decode**(`value`: string): *Uint8Array*

*Defined in [src.ts/utils/serialize.ts:21](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *Uint8Array*

___

###  base_encode

▸ **base_encode**(`value`: Uint8Array | string): *string*

*Defined in [src.ts/utils/serialize.ts:14](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Uint8Array &#124; string |

**Returns:** *string*

___

###  deserialize

▸ **deserialize**(`schema`: [Schema](_utils_serialize_.md#schema), `classType`: any, `buffer`: Buffer): *any*

*Defined in [src.ts/utils/serialize.ts:324](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L324)*

**Parameters:**

Name | Type |
------ | ------ |
`schema` | [Schema](_utils_serialize_.md#schema) |
`classType` | any |
`buffer` | Buffer |

**Returns:** *any*

___

###  deserializeField

▸ **deserializeField**(`schema`: [Schema](_utils_serialize_.md#schema), `fieldName`: string, `fieldType`: any, `reader`: [BinaryReader](../classes/_utils_serialize_.binaryreader.md)): *any*

*Defined in [src.ts/utils/serialize.ts:273](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L273)*

**Parameters:**

Name | Type |
------ | ------ |
`schema` | [Schema](_utils_serialize_.md#schema) |
`fieldName` | string |
`fieldType` | any |
`reader` | [BinaryReader](../classes/_utils_serialize_.binaryreader.md) |

**Returns:** *any*

___

###  deserializeStruct

▸ **deserializeStruct**(`schema`: [Schema](_utils_serialize_.md#schema), `classType`: any, `reader`: [BinaryReader](../classes/_utils_serialize_.binaryreader.md)): *any*

*Defined in [src.ts/utils/serialize.ts:296](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L296)*

**Parameters:**

Name | Type |
------ | ------ |
`schema` | [Schema](_utils_serialize_.md#schema) |
`classType` | any |
`reader` | [BinaryReader](../classes/_utils_serialize_.binaryreader.md) |

**Returns:** *any*

___

###  handlingRangeError

▸ **handlingRangeError**(`target`: any, `propertyKey`: string, `propertyDescriptor`: PropertyDescriptor): *void*

*Defined in [src.ts/utils/serialize.ts:114](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L114)*

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string |
`propertyDescriptor` | PropertyDescriptor |

**Returns:** *void*

___

###  serialize

▸ **serialize**(`schema`: [Schema](_utils_serialize_.md#schema), `obj`: any): *Uint8Array*

*Defined in [src.ts/utils/serialize.ts:267](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L267)*

**Parameters:**

Name | Type |
------ | ------ |
`schema` | [Schema](_utils_serialize_.md#schema) |
`obj` | any |

**Returns:** *Uint8Array*

___

###  serializeField

▸ **serializeField**(`schema`: [Schema](_utils_serialize_.md#schema), `fieldName`: string, `value`: any, `fieldType`: any, `writer`: any): *void*

*Defined in [src.ts/utils/serialize.ts:203](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L203)*

**Parameters:**

Name | Type |
------ | ------ |
`schema` | [Schema](_utils_serialize_.md#schema) |
`fieldName` | string |
`value` | any |
`fieldType` | any |
`writer` | any |

**Returns:** *void*

___

###  serializeStruct

▸ **serializeStruct**(`schema`: [Schema](_utils_serialize_.md#schema), `obj`: any, `writer`: any): *void*

*Defined in [src.ts/utils/serialize.ts:241](https://github.com/nearprotocol/nearlib/blob/fe97eb6/src.ts/utils/serialize.ts#L241)*

**Parameters:**

Name | Type |
------ | ------ |
`schema` | [Schema](_utils_serialize_.md#schema) |
`obj` | any |
`writer` | any |

**Returns:** *void*
