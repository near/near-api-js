

# Index

### Classes

* [Account](../classes/_account_.account.md)

### Type aliases

* [AccountState](_account_.md#accountstate)

### Variables

* [DEFAULT_FUNC_CALL_AMOUNT](_account_.md#default_func_call_amount)
* [TX_STATUS_RETRY_NUMBER](_account_.md#tx_status_retry_number)
* [TX_STATUS_RETRY_WAIT](_account_.md#tx_status_retry_wait)
* [TX_STATUS_RETRY_WAIT_BACKOFF](_account_.md#tx_status_retry_wait_backoff)

### Functions

* [sleep](_account_.md#sleep)

---

# Type aliases

<a id="accountstate"></a>

##  AccountState

**Ƭ AccountState**: *`object`*

*Defined in [account.ts:28](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/account.ts#L28)*

#### Type declaration

 account_id: `string`

 amount: `bigint`

 code_hash: `string`

 nonce: `number`

 public_keys: `Uint8Array`[]

 stake: `bigint`

___

# Variables

<a id="default_func_call_amount"></a>

## `<Const>` DEFAULT_FUNC_CALL_AMOUNT

**● DEFAULT_FUNC_CALL_AMOUNT**: *`bigint`* =  BigInt(1000000000)

*Defined in [account.ts:12](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/account.ts#L12)*

___
<a id="tx_status_retry_number"></a>

## `<Const>` TX_STATUS_RETRY_NUMBER

**● TX_STATUS_RETRY_NUMBER**: *`10`* = 10

*Defined in [account.ts:15](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/account.ts#L15)*

___
<a id="tx_status_retry_wait"></a>

## `<Const>` TX_STATUS_RETRY_WAIT

**● TX_STATUS_RETRY_WAIT**: *`500`* = 500

*Defined in [account.ts:18](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/account.ts#L18)*

___
<a id="tx_status_retry_wait_backoff"></a>

## `<Const>` TX_STATUS_RETRY_WAIT_BACKOFF

**● TX_STATUS_RETRY_WAIT_BACKOFF**: *`1.5`* = 1.5

*Defined in [account.ts:21](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/account.ts#L21)*

___

# Functions

<a id="sleep"></a>

##  sleep

▸ **sleep**(millis: *`number`*): `Promise`<`any`>

*Defined in [account.ts:24](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/account.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| millis | `number` |

**Returns:** `Promise`<`any`>

___

