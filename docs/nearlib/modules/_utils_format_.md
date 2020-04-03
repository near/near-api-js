---
id: "_utils_format_"
title: "utils/format"
sidebar_label: "utils/format"
---

## Index

### Variables

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

### `Const` BN10

• **BN10**: *BN‹›* = new BN(10)

___

### `Const` NEAR_NOMINATION

• **NEAR_NOMINATION**: *BN‹›* = new BN('10', 10).pow(new BN(NEAR_NOMINATION_EXP, 10))

Number of indivisible units in one NEAR. Derived from [NEAR_NOMINATION_EXP](_utils_format_.md#const-near_nomination_exp).

___

### `Const` NEAR_NOMINATION_EXP

• **NEAR_NOMINATION_EXP**: *24* = 24

Exponent for calculating how many indivisible units are there in one NEAR. See [NEAR_NOMINATION](_utils_format_.md#const-near_nomination).

___

### `Const` ROUNDING_OFFSETS

• **ROUNDING_OFFSETS**: *BN[]* = []

## Functions

###  cleanupAmount

▸ **cleanupAmount**(`amount`: string): *string*

Removes commas from the input

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`amount` | string | A value or amount that may contain commas |

**Returns:** *string*

string The cleaned value

___

###  formatNearAmount

▸ **formatNearAmount**(`balance`: string, `fracDigits`: number): *string*

Convert account balance value from internal indivisible units to NEAR. 1 NEAR is defined by [NEAR_NOMINATION](_utils_format_.md#const-near_nomination).
Effectively this divides given amount by [NEAR_NOMINATION](_utils_format_.md#const-near_nomination).

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`balance` | string | - | decimal string representing balance in smallest non-divisible NEAR units (as specified by [NEAR_NOMINATION](_utils_format_.md#const-near_nomination)) |
`fracDigits` | number | NEAR_NOMINATION_EXP | number of fractional digits to preserve in formatted string. Balance is rounded to match given number of digits. |

**Returns:** *string*

Value in Ⓝ

___

###  formatWithCommas

▸ **formatWithCommas**(`value`: string): *string*

Returns a human-readable value with commas

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | string | A value that may not contain commas |

**Returns:** *string*

string A value with commas

___

###  parseNearAmount

▸ **parseNearAmount**(`amt?`: string): *string | null*

Convert human readable NEAR amount to internal indivisible units.
Effectively this multiplies given amount by [NEAR_NOMINATION](_utils_format_.md#const-near_nomination).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`amt?` | string | decimal string (potentially fractional) denominated in NEAR. |

**Returns:** *string | null*

The parsed yoctoⓃ amount or null if no amount was passed in

___

###  trimLeadingZeroes

▸ **trimLeadingZeroes**(`value`: string): *string*

Removes leading zeroes from an input

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | string | A value that may contain leading zeroes |

**Returns:** *string*

string The value without the leading zeroes

___

###  trimTrailingZeroes

▸ **trimTrailingZeroes**(`value`: string): *string*

Removes .000… from an input

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | string | A value that may contain trailing zeroes in the decimals place |

**Returns:** *string*

string The value without the trailing zeros
