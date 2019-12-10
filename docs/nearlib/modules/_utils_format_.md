---
id: "_utils_format_"
title: "utils/format"
sidebar_label: "utils/format"
---

## Index

### Variables

* [BN](_utils_format_.md#const-bn)
* [NEAR_NOMINATION](_utils_format_.md#const-near_nomination)
* [NEAR_NOMINATION_EXP](_utils_format_.md#const-near_nomination_exp)

### Functions

* [formatNearAmount](_utils_format_.md#formatnearamount)
* [formatWithCommas](_utils_format_.md#formatwithcommas)
* [parseNearAmount](_utils_format_.md#parsenearamount)
* [trimTrailingZeroes](_utils_format_.md#trimtrailingzeroes)

## Variables

### `Const` BN

• **BN**: *any* =  require ('bn.js')

*Defined in [src.ts/utils/format.ts:1](https://github.com/nearprotocol/nearlib/blob/a71bd4f/src.ts/utils/format.ts#L1)*

___

### `Const` NEAR_NOMINATION

• **NEAR_NOMINATION**: *any* =  new BN('10', 10).pow(new BN(NEAR_NOMINATION_EXP, 10))

*Defined in [src.ts/utils/format.ts:6](https://github.com/nearprotocol/nearlib/blob/a71bd4f/src.ts/utils/format.ts#L6)*

___

### `Const` NEAR_NOMINATION_EXP

• **NEAR_NOMINATION_EXP**: *18* = 18

*Defined in [src.ts/utils/format.ts:4](https://github.com/nearprotocol/nearlib/blob/a71bd4f/src.ts/utils/format.ts#L4)*

## Functions

###  formatNearAmount

▸ **formatNearAmount**(`balance`: string): *string*

*Defined in [src.ts/utils/format.ts:12](https://github.com/nearprotocol/nearlib/blob/a71bd4f/src.ts/utils/format.ts#L12)*

Convert account balance value from internal units (currently yoctoNEAR) to NEAR.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`balance` | string |   |

**Returns:** *string*

___

###  formatWithCommas

▸ **formatWithCommas**(`value`: string): *string*

*Defined in [src.ts/utils/format.ts:49](https://github.com/nearprotocol/nearlib/blob/a71bd4f/src.ts/utils/format.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *string*

___

###  parseNearAmount

▸ **parseNearAmount**(`amt?`: string): *string | null*

*Defined in [src.ts/utils/format.ts:25](https://github.com/nearprotocol/nearlib/blob/a71bd4f/src.ts/utils/format.ts#L25)*

Convert human readable near amount to internal account balance units.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`amt?` | string |   |

**Returns:** *string | null*

___

###  trimTrailingZeroes

▸ **trimTrailingZeroes**(`value`: string): *string*

*Defined in [src.ts/utils/format.ts:40](https://github.com/nearprotocol/nearlib/blob/a71bd4f/src.ts/utils/format.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *string*
