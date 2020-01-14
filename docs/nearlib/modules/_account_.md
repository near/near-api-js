---
id: "_account_"
title: "account"
sidebar_label: "account"
---

## Index

### Classes

* [Account](../classes/_account_.account.md)

### Interfaces

* [AccountState](../interfaces/_account_.accountstate.md)

### Variables

* [DEFAULT_FUNC_CALL_AMOUNT](_account_.md#const-default_func_call_amount)
* [TX_STATUS_RETRY_NUMBER](_account_.md#const-tx_status_retry_number)
* [TX_STATUS_RETRY_WAIT](_account_.md#const-tx_status_retry_wait)
* [TX_STATUS_RETRY_WAIT_BACKOFF](_account_.md#const-tx_status_retry_wait_backoff)

### Functions

* [sleep](_account_.md#sleep)

## Variables

### `Const` DEFAULT_FUNC_CALL_AMOUNT

• **DEFAULT_FUNC_CALL_AMOUNT**: *number* =  2000000 * 1000000

*Defined in [src.ts/account.ts:16](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/account.ts#L16)*

___

### `Const` TX_STATUS_RETRY_NUMBER

• **TX_STATUS_RETRY_NUMBER**: *10* = 10

*Defined in [src.ts/account.ts:19](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/account.ts#L19)*

___

### `Const` TX_STATUS_RETRY_WAIT

• **TX_STATUS_RETRY_WAIT**: *500* = 500

*Defined in [src.ts/account.ts:22](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/account.ts#L22)*

___

### `Const` TX_STATUS_RETRY_WAIT_BACKOFF

• **TX_STATUS_RETRY_WAIT_BACKOFF**: *1.5* = 1.5

*Defined in [src.ts/account.ts:25](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/account.ts#L25)*

## Functions

###  sleep

▸ **sleep**(`millis`: number): *Promise‹any›*

*Defined in [src.ts/account.ts:28](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/account.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`millis` | number |

**Returns:** *Promise‹any›*
