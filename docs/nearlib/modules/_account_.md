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

*Defined in [src.ts/account.ts:15](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/account.ts#L15)*

___

### `Const` TX_STATUS_RETRY_NUMBER

• **TX_STATUS_RETRY_NUMBER**: *10* = 10

*Defined in [src.ts/account.ts:18](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/account.ts#L18)*

___

### `Const` TX_STATUS_RETRY_WAIT

• **TX_STATUS_RETRY_WAIT**: *500* = 500

*Defined in [src.ts/account.ts:21](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/account.ts#L21)*

___

### `Const` TX_STATUS_RETRY_WAIT_BACKOFF

• **TX_STATUS_RETRY_WAIT_BACKOFF**: *1.5* = 1.5

*Defined in [src.ts/account.ts:24](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/account.ts#L24)*

## Functions

###  sleep

▸ **sleep**(`millis`: number): *Promise‹any›*

*Defined in [src.ts/account.ts:27](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/account.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`millis` | number |

**Returns:** *Promise‹any›*
