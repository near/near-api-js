---
id: "_utils_format_"
title: "utils/format"
sidebar_label: "utils/format"
---

## Index

### Variables

* [BN](_utils_format_.md#const-bn)
* [exp](_utils_format_.md#const-exp)
* [unitsInOneNear](_utils_format_.md#const-unitsinonenear)

### Functions

* [convertAccountBalanceAmountToNear](_utils_format_.md#convertaccountbalanceamounttonear)
* [nearAmountToAccountBalanceAmount](_utils_format_.md#nearamounttoaccountbalanceamount)

## Variables

### `Const` BN

• **BN**: *any* =  require ('bn.js')

Defined in src.ts/utils/format.ts:1

___

### `Const` exp

• **exp**: *24* = 24

Defined in src.ts/utils/format.ts:4

___

### `Const` unitsInOneNear

• **unitsInOneNear**: *any* =  new BN('10', 10).pow(new BN(exp, 10))

Defined in src.ts/utils/format.ts:6

## Functions

###  convertAccountBalanceAmountToNear

▸ **convertAccountBalanceAmountToNear**(`balance`: string): *string*

Defined in src.ts/utils/format.ts:12

Convert account balance to near.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`balance` | string |   |

**Returns:** *string*

___

###  nearAmountToAccountBalanceAmount

▸ **nearAmountToAccountBalanceAmount**(`amt`: any): *any*

Defined in src.ts/utils/format.ts:24

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`amt` | any |   |

**Returns:** *any*
