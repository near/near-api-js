---
id: "_utils_rpc_errors_"
title: "utils/rpc_errors"
sidebar_label: "utils/rpc_errors"
---

## Index

### Functions

* [formatError](_utils_rpc_errors_.md#formaterror)
* [isObject](_utils_rpc_errors_.md#isobject)
* [parseRpcError](_utils_rpc_errors_.md#parserpcerror)
* [walkSubtype](_utils_rpc_errors_.md#walksubtype)

## Functions

###  formatError

▸ **formatError**(`errorClassName`: string, `errorData`: any): *string*

*Defined in [src.ts/utils/rpc_errors.ts:19](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/rpc_errors.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`errorClassName` | string |
`errorData` | any |

**Returns:** *string*

___

###  isObject

▸ **isObject**(`n`: any): *boolean*

*Defined in [src.ts/utils/rpc_errors.ts:55](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/rpc_errors.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`n` | any |

**Returns:** *boolean*

___

###  parseRpcError

▸ **parseRpcError**(`errorObj`: Object): *[ServerError](../classes/_generated_rpc_error_types_.servererror.md)*

*Defined in [src.ts/utils/rpc_errors.ts:10](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/rpc_errors.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`errorObj` | Object |

**Returns:** *[ServerError](../classes/_generated_rpc_error_types_.servererror.md)*

___

###  walkSubtype

▸ **walkSubtype**(`errorObj`: any, `schema`: any, `result`: any, `typeName`: any): *any*

*Defined in [src.ts/utils/rpc_errors.ts:26](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/rpc_errors.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`errorObj` | any |
`schema` | any |
`result` | any |
`typeName` | any |

**Returns:** *any*
