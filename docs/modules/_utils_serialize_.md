

# Index

### Classes

* [BinaryReader](../classes/_utils_serialize_.binaryreader.md)
* [BinaryWriter](../classes/_utils_serialize_.binarywriter.md)

### Type aliases

* [Schema](_utils_serialize_.md#schema)

### Variables

* [INITIAL_LENGTH](_utils_serialize_.md#initial_length)

### Functions

* [base_decode](_utils_serialize_.md#base_decode)
* [base_encode](_utils_serialize_.md#base_encode)
* [deserialize](_utils_serialize_.md#deserialize)
* [deserializeField](_utils_serialize_.md#deserializefield)
* [deserializeStruct](_utils_serialize_.md#deserializestruct)
* [serialize](_utils_serialize_.md#serialize)
* [serializeField](_utils_serialize_.md#serializefield)
* [serializeStruct](_utils_serialize_.md#serializestruct)

---

# Type aliases

<a id="schema"></a>

##  Schema

**Ƭ Schema**: *`Map`<`Function`, `any`>*

*Defined in [utils/serialize.ts:19](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L19)*

___

# Variables

<a id="initial_length"></a>

## `<Const>` INITIAL_LENGTH

**● INITIAL_LENGTH**: *`1024`* = 1024

*Defined in [utils/serialize.ts:17](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L17)*

___

# Functions

<a id="base_decode"></a>

##  base_decode

▸ **base_decode**(value: *`string`*): `Uint8Array`

*Defined in [utils/serialize.ts:13](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `string` |

**Returns:** `Uint8Array`

___
<a id="base_encode"></a>

##  base_encode

▸ **base_encode**(value: *`Uint8Array` \| `string`*): `string`

*Defined in [utils/serialize.ts:6](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L6)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `Uint8Array` \| `string` |

**Returns:** `string`

___
<a id="deserialize"></a>

##  deserialize

▸ **deserialize**(schema: *[Schema](_utils_serialize_.md#schema)*, classType: *`any`*, buffer: *`Buffer`*): `any`

*Defined in [utils/serialize.ts:228](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L228)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | [Schema](_utils_serialize_.md#schema) |
| classType | `any` |
| buffer | `Buffer` |

**Returns:** `any`

___
<a id="deserializefield"></a>

##  deserializeField

▸ **deserializeField**(schema: *[Schema](_utils_serialize_.md#schema)*, fieldType: *`any`*, reader: *`any`*): `any`

*Defined in [utils/serialize.ts:206](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L206)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | [Schema](_utils_serialize_.md#schema) |
| fieldType | `any` |
| reader | `any` |

**Returns:** `any`

___
<a id="deserializestruct"></a>

##  deserializeStruct

▸ **deserializeStruct**(schema: *[Schema](_utils_serialize_.md#schema)*, classType: *`any`*, reader: *`any`*): `any`

*Defined in [utils/serialize.ts:220](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L220)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | [Schema](_utils_serialize_.md#schema) |
| classType | `any` |
| reader | `any` |

**Returns:** `any`

___
<a id="serialize"></a>

##  serialize

▸ **serialize**(schema: *[Schema](_utils_serialize_.md#schema)*, obj: *`any`*): `Uint8Array`

*Defined in [utils/serialize.ts:200](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L200)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | [Schema](_utils_serialize_.md#schema) |
| obj | `any` |

**Returns:** `Uint8Array`

___
<a id="serializefield"></a>

##  serializeField

▸ **serializeField**(schema: *[Schema](_utils_serialize_.md#schema)*, value: *`any`*, fieldType: *`any`*, writer: *`any`*): `void`

*Defined in [utils/serialize.ts:147](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L147)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | [Schema](_utils_serialize_.md#schema) |
| value | `any` |
| fieldType | `any` |
| writer | `any` |

**Returns:** `void`

___
<a id="serializestruct"></a>

##  serializeStruct

▸ **serializeStruct**(schema: *[Schema](_utils_serialize_.md#schema)*, obj: *`any`*, writer: *`any`*): `void`

*Defined in [utils/serialize.ts:174](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/utils/serialize.ts#L174)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | [Schema](_utils_serialize_.md#schema) |
| obj | `any` |
| writer | `any` |

**Returns:** `void`

___

