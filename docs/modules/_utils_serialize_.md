

# Index

### Classes

* [BinaryReader](../classes/_utils_serialize_.binaryreader.md)
* [BinaryWriter](../classes/_utils_serialize_.binarywriter.md)

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

# Variables

<a id="initial_length"></a>

## `<Const>` INITIAL_LENGTH

**● INITIAL_LENGTH**: *`1024`* = 1024

*Defined in [utils/serialize.ts:17](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L17)*

___

# Functions

<a id="base_decode"></a>

##  base_decode

▸ **base_decode**(value: *`string`*): `Uint8Array`

*Defined in [utils/serialize.ts:13](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `string` |

**Returns:** `Uint8Array`

___
<a id="base_encode"></a>

##  base_encode

▸ **base_encode**(value: *`Uint8Array` \| `string`*): `string`

*Defined in [utils/serialize.ts:6](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L6)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `Uint8Array` \| `string` |

**Returns:** `string`

___
<a id="deserialize"></a>

##  deserialize

▸ **deserialize**(schema: *`any`*, classType: *`any`*, buffer: *`Buffer`*): `any`

*Defined in [utils/serialize.ts:225](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L225)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| classType | `any` |
| buffer | `Buffer` |

**Returns:** `any`

___
<a id="deserializefield"></a>

##  deserializeField

▸ **deserializeField**(schema: *`any`*, fieldType: *`any`*, reader: *`any`*): `any`

*Defined in [utils/serialize.ts:203](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L203)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| fieldType | `any` |
| reader | `any` |

**Returns:** `any`

___
<a id="deserializestruct"></a>

##  deserializeStruct

▸ **deserializeStruct**(schema: *`any`*, classType: *`any`*, reader: *`any`*): `any`

*Defined in [utils/serialize.ts:217](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L217)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| classType | `any` |
| reader | `any` |

**Returns:** `any`

___
<a id="serialize"></a>

##  serialize

▸ **serialize**(schema: *`any`*, obj: *`any`*): `Uint8Array`

*Defined in [utils/serialize.ts:197](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L197)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| obj | `any` |

**Returns:** `Uint8Array`

___
<a id="serializefield"></a>

##  serializeField

▸ **serializeField**(schema: *`any`*, value: *`any`*, fieldType: *`any`*, writer: *`any`*): `void`

*Defined in [utils/serialize.ts:144](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L144)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| value | `any` |
| fieldType | `any` |
| writer | `any` |

**Returns:** `void`

___
<a id="serializestruct"></a>

##  serializeStruct

▸ **serializeStruct**(schema: *`any`*, obj: *`any`*, writer: *`any`*): `void`

*Defined in [utils/serialize.ts:171](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/utils/serialize.ts#L171)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| schema | `any` |
| obj | `any` |
| writer | `any` |

**Returns:** `void`

___

