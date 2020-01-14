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
* [TextDecoder](_utils_serialize_.md#const-textdecoder)
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

*Defined in [src.ts/utils/serialize.ts:24](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L24)*

## Variables

### `Const` INITIAL_LENGTH

• **INITIAL_LENGTH**: *1024* = 1024

*Defined in [src.ts/utils/serialize.ts:22](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L22)*

___

### `Const` TextDecoder

• **TextDecoder**: *any* =  (typeof (global as any).TextDecoder !== 'function') ? encoding.TextDecoder : (global as any).TextDecoder

*Defined in [src.ts/utils/serialize.ts:8](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L8)*

___

### `Const` textDecoder

• **textDecoder**: *any* =  new TextDecoder('utf-8', { fatal: true })

*Defined in [src.ts/utils/serialize.ts:9](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L9)*

## Functions

###  base_decode

▸ **base_decode**(`value`: string): *Uint8Array*

*Defined in [src.ts/utils/serialize.ts:18](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *Uint8Array*

___

###  base_encode

▸ **base_encode**(`value`: Uint8Array | string): *string*

*Defined in [src.ts/utils/serialize.ts:11](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Uint8Array &#124; string |

**Returns:** *string*

___

###  deserialize

▸ **deserialize**(`schema`: [Schema](_utils_serialize_.md#schema), `classType`: any, `buffer`: Buffer): *any*

*Defined in [src.ts/utils/serialize.ts:321](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L321)*

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

*Defined in [src.ts/utils/serialize.ts:270](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L270)*

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

*Defined in [src.ts/utils/serialize.ts:293](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L293)*

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

*Defined in [src.ts/utils/serialize.ts:111](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L111)*

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

*Defined in [src.ts/utils/serialize.ts:264](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L264)*

**Parameters:**

Name | Type |
------ | ------ |
`schema` | [Schema](_utils_serialize_.md#schema) |
`obj` | any |

**Returns:** *Uint8Array*

___

###  serializeField

▸ **serializeField**(`schema`: [Schema](_utils_serialize_.md#schema), `fieldName`: string, `value`: any, `fieldType`: any, `writer`: any): *void*

*Defined in [src.ts/utils/serialize.ts:200](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L200)*

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

*Defined in [src.ts/utils/serialize.ts:238](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L238)*

**Parameters:**

Name | Type |
------ | ------ |
`schema` | [Schema](_utils_serialize_.md#schema) |
`obj` | any |
`writer` | any |

**Returns:** *void*
