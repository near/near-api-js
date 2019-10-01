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

• **DEFAULT_FUNC_CALL_AMOUNT**: *2000000* = 2000000

*Defined in [account.ts:14](https://github.com/nearprotocol/nearlib/blob/57ba3df/src.ts/account.ts#L14)*

___

### `Const` TX_STATUS_RETRY_NUMBER

• **TX_STATUS_RETRY_NUMBER**: *10* = 10

*Defined in [account.ts:17](https://github.com/nearprotocol/nearlib/blob/57ba3df/src.ts/account.ts#L17)*

___

### `Const` TX_STATUS_RETRY_WAIT

• **TX_STATUS_RETRY_WAIT**: *500* = 500

*Defined in [account.ts:20](https://github.com/nearprotocol/nearlib/blob/57ba3df/src.ts/account.ts#L20)*

___

### `Const` TX_STATUS_RETRY_WAIT_BACKOFF

• **TX_STATUS_RETRY_WAIT_BACKOFF**: *1.5* = 1.5

*Defined in [account.ts:23](https://github.com/nearprotocol/nearlib/blob/57ba3df/src.ts/account.ts#L23)*

## Functions

###  sleep

▸ **sleep**(`millis`: number): *Promise‹any›*

*Defined in [account.ts:26](https://github.com/nearprotocol/nearlib/blob/57ba3df/src.ts/account.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`millis` | number |

**Returns:** *Promise‹any›*
