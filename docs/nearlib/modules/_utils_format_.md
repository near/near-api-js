---
id: "_utils_format_"
title: "utils/format"
sidebar_label: "utils/format"
---

## Index

### Variables

* [BN](_utils_format_.md#const-bn)
* [BN10](_utils_format_.md#const-bn10)
* [NEAR_NOMINATION](_utils_format_.md#const-near_nomination)
* [NEAR_NOMINATION_EXP](_utils_format_.md#const-near_nomination_exp)
* [ROUNDING_OFFSETS](_utils_format_.md#const-rounding_offsets)

### Functions

* [cleanupAmount](_utils_format_.md#cleanupamount)
* [formatNearAmount](_utils_format_.md#formatnearamount)
* [formatWithCommas](_utils_format_.md#formatwithcommas)
* [parseNearAmount](_utils_format_.md#parsenearamount)
* [trimLeadingZeroes](_utils_format_.md#trimleadingzeroes)
* [trimTrailingZeroes](_utils_format_.md#trimtrailingzeroes)

## Variables

### `Const` BN

• **BN**: *any* =  require ('bn.js')

*Defined in [src.ts/utils/format.ts:1](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/format.ts#L1)*

___

### `Const` BN10

• **BN10**: *any* =  new BN(10)

*Defined in [src.ts/utils/format.ts:15](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/format.ts#L15)*

___

### `Const` NEAR_NOMINATION

• **NEAR_NOMINATION**: *any* =  new BN('10', 10).pow(new BN(NEAR_NOMINATION_EXP, 10))

*Defined in [src.ts/utils/format.ts:11](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/format.ts#L11)*

Number of indivisible units in one NEAR. Derived from [NEAR_NOMINATION_EXP](_utils_format_.md#const-near_nomination_exp).

___

### `Const` NEAR_NOMINATION_EXP

• **NEAR_NOMINATION_EXP**: *24* = 24

*Defined in [src.ts/utils/format.ts:6](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/format.ts#L6)*

Exponent for calculating how many indivisible units are there in one NEAR. See [NEAR_NOMINATION](_utils_format_.md#const-near_nomination).

___

### `Const` ROUNDING_OFFSETS

• **ROUNDING_OFFSETS**: *any[]* =  []

*Defined in [src.ts/utils/format.ts:14](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/format.ts#L14)*

## Functions

###  cleanupAmount

▸ **cleanupAmount**(`amount`: string): *string*

*Defined in [src.ts/utils/format.ts:63](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/format.ts#L63)*

**Parameters:**

Name | Type |
------ | ------ |
`amount` | string |

**Returns:** *string*

___

###  formatNearAmount

▸ **formatNearAmount**(`balance`: string, `fracDigits`: number): *string*

*Defined in [src.ts/utils/format.ts:27](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/format.ts#L27)*

Convert account balance value from internal indivisible units to NEAR. 1 NEAR is defined by [NEAR_NOMINATION](_utils_format_.md#const-near_nomination).
Effectively this divides given amount by [NEAR_NOMINATION](_utils_format_.md#const-near_nomination).

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`balance` | string | - | decimal string representing balance in smallest non-divisible NEAR units (as specified by [NEAR_NOMINATION](_utils_format_.md#const-near_nomination)) |
`fracDigits` | number |  NEAR_NOMINATION_EXP | number of fractional digits to preserve in formatted string. Balance is rounded to match given number of digits.  |

**Returns:** *string*

___

###  formatWithCommas

▸ **formatWithCommas**(`value`: string): *string*

*Defined in [src.ts/utils/format.ts:75](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/format.ts#L75)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *string*

___

###  parseNearAmount

▸ **parseNearAmount**(`amt?`: string): *string | null*

*Defined in [src.ts/utils/format.ts:51](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/format.ts#L51)*

Convert human readable NEAR amount to internal indivisible units.
Effectively this multiplies given amount by [NEAR_NOMINATION](_utils_format_.md#const-near_nomination).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`amt?` | string | decimal string (potentially fractional) denominated in NEAR.  |

**Returns:** *string | null*

___

###  trimLeadingZeroes

▸ **trimLeadingZeroes**(`value`: string): *string*

*Defined in [src.ts/utils/format.ts:71](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/format.ts#L71)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *string*

___

###  trimTrailingZeroes

▸ **trimTrailingZeroes**(`value`: string): *string*

*Defined in [src.ts/utils/format.ts:67](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/format.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *string*
