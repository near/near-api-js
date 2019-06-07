

# Type aliases

<a id="connectioninfo"></a>

##  ConnectionInfo

**Ƭ ConnectionInfo**: *`object`*

*Defined in [utils/web.ts:5](https://github.com/nearprotocol/nearlib/blob/7f7cdf3/src.ts/utils/web.ts#L5)*

#### Type declaration

`Optional`  allowInsecure: `boolean`

`Optional`  headers: `object`

[key: `string`]: `string` \| `number`

`Optional`  password: `string`

`Optional`  timeout: `number`

 url: `string`

`Optional`  user: `string`

___

# Variables

<a id="fetch"></a>

## `<Const>` fetch

**● fetch**: *`any`* =  (typeof window === 'undefined' || window.name == 'nodejs') ? require('node-fetch') : window.fetch

*Defined in [utils/web.ts:14](https://github.com/nearprotocol/nearlib/blob/7f7cdf3/src.ts/utils/web.ts#L14)*

___

# Functions

<a id="fetchjson"></a>

##  fetchJson

▸ **fetchJson**(connection: *`string` \| [ConnectionInfo](_utils_web_.md#connectioninfo)*, json?: *`string`*): `Promise`<`any`>

*Defined in [utils/web.ts:16](https://github.com/nearprotocol/nearlib/blob/7f7cdf3/src.ts/utils/web.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| connection | `string` \| [ConnectionInfo](_utils_web_.md#connectioninfo) |
| `Optional` json | `string` |

**Returns:** `Promise`<`any`>

___

