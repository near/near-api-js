---
id: "_utils_web_"
title: "utils/web"
sidebar_label: "utils/web"
---

## Index

### Interfaces

* [ConnectionInfo](../interfaces/_utils_web_.connectioninfo.md)

### Variables

* [fetch](_utils_web_.md#const-fetch)

### Functions

* [fetchJson](_utils_web_.md#fetchjson)

## Variables

### `Const` fetch

• **fetch**: *any* =  (typeof window === 'undefined' || window.name === 'nodejs') ? require('node-fetch') : window.fetch

*Defined in [utils/web.ts:14](https://github.com/nearprotocol/nearlib/blob/f222a4e/src.ts/utils/web.ts#L14)*

## Functions

###  fetchJson

▸ **fetchJson**(`connection`: string | [ConnectionInfo](../interfaces/_utils_web_.connectioninfo.md), `json?`: string): *Promise‹any›*

*Defined in [utils/web.ts:16](https://github.com/nearprotocol/nearlib/blob/f222a4e/src.ts/utils/web.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`connection` | string &#124; [ConnectionInfo](../interfaces/_utils_web_.connectioninfo.md) |
`json?` | string |

**Returns:** *Promise‹any›*
