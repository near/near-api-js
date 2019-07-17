

# Index

### Interfaces

* [ConnectionInfo](../interfaces/_utils_web_.connectioninfo.md)

### Variables

* [fetch](_utils_web_.md#fetch)

### Functions

* [fetchJson](_utils_web_.md#fetchjson)

---

# Variables

<a id="fetch"></a>

## `<Const>` fetch

**● fetch**: *`any`* =  (typeof window === 'undefined' || window.name === 'nodejs') ? require('node-fetch') : window.fetch

*Defined in [utils/web.ts:14](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/web.ts#L14)*

___

# Functions

<a id="fetchjson"></a>

##  fetchJson

▸ **fetchJson**(connection: *`string` \| [ConnectionInfo](../interfaces/_utils_web_.connectioninfo.md)*, json?: *`string`*): `Promise`<`any`>

*Defined in [utils/web.ts:16](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/utils/web.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| connection | `string` \| [ConnectionInfo](../interfaces/_utils_web_.connectioninfo.md) |
| `Optional` json | `string` |

**Returns:** `Promise`<`any`>

___

