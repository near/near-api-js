

# Hierarchy

**Account**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new Account**(connection: *[Connection](_connection_.connection.md)*, accountId: *`string`*): [Account](_account_.account.md)

*Defined in [account.ts:41](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L41)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| connection | [Connection](_connection_.connection.md) |
| accountId | `string` |

**Returns:** [Account](_account_.account.md)

___

# Properties

<a id="_state"></a>

## `<Private>` _state

**● _state**: *[AccountState](../modules/_account_.md#accountstate)*

*Defined in [account.ts:40](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L40)*

___
<a id="accountid"></a>

##  accountId

**● accountId**: *`string`*

*Defined in [account.ts:39](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L39)*

___
<a id="connection"></a>

##  connection

**● connection**: *[Connection](_connection_.connection.md)*

*Defined in [account.ts:38](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L38)*

___
<a id="ready"></a>

## `<Protected>` ready

**● ready**: *`Promise`<`void`>*

*Defined in [account.ts:41](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L41)*

___

# Methods

<a id="addkey"></a>

##  addKey

▸ **addKey**(publicKey: *`string`*, contractId?: *`string`*, methodName?: *`string`*, balanceOwner?: *`string`*, amount?: *`bigint`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:159](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L159)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |
| `Optional` contractId | `string` |
| `Optional` methodName | `string` |
| `Optional` balanceOwner | `string` |
| `Optional` amount | `bigint` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___
<a id="createaccount"></a>

##  createAccount

▸ **createAccount**(newAccountId: *`string`*, publicKey: *`string`*, amount: *`bigint`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:138](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L138)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| newAccountId | `string` |
| publicKey | `string` |
| amount | `bigint` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___
<a id="createanddeploycontract"></a>

##  createAndDeployContract

▸ **createAndDeployContract**(contractId: *`string`*, publicKey: *`string`*, data: *`Uint8Array`*, amount: *`bigint`*): `Promise`<[Account](_account_.account.md)>

*Defined in [account.ts:124](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L124)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| publicKey | `string` |
| data | `Uint8Array` |
| amount | `bigint` |

**Returns:** `Promise`<[Account](_account_.account.md)>

___
<a id="deletekey"></a>

##  deleteKey

▸ **deleteKey**(publicKey: *`string`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:166](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L166)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___
<a id="deploycontract"></a>

##  deployContract

▸ **deployContract**(data: *`Uint8Array`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:144](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L144)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___
<a id="fetchstate"></a>

##  fetchState

▸ **fetchState**(): `Promise`<`void`>

*Defined in [account.ts:49](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L49)*

**Returns:** `Promise`<`void`>

___
<a id="functioncall"></a>

##  functionCall

▸ **functionCall**(contractId: *`string`*, methodName: *`string`*, args: *`any`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:150](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L150)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| methodName | `string` |
| args | `any` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___
<a id="getaccountdetails"></a>

##  getAccountDetails

▸ **getAccountDetails**(): `Promise`<`any`>

*Defined in [account.ts:186](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L186)*

**Returns:** `Promise`<`any`>

___
<a id="printlogs"></a>

## `<Private>` printLogs

▸ **printLogs**(contractId: *`string`*, logs: *`string`[]*): `void`

*Defined in [account.ts:61](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| logs | `string`[] |

**Returns:** `void`

___
<a id="retrytxresult"></a>

## `<Private>` retryTxResult

▸ **retryTxResult**(txHash: *`Uint8Array`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:67](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L67)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| txHash | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___
<a id="sendmoney"></a>

##  sendMoney

▸ **sendMoney**(receiver: *`string`*, amount: *`bigint`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:132](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L132)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| receiver | `string` |
| amount | `bigint` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___
<a id="signandsendtransaction"></a>

## `<Private>` signAndSendTransaction

▸ **signAndSendTransaction**(transaction: *`any`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:89](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L89)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transaction | `any` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___
<a id="stake"></a>

##  stake

▸ **stake**(publicKey: *`string`*, amount: *`bigint`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:172](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L172)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |
| amount | `bigint` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___
<a id="state"></a>

##  state

▸ **state**(): `Promise`<[AccountState](../modules/_account_.md#accountstate)>

*Defined in [account.ts:56](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L56)*

**Returns:** `Promise`<[AccountState](../modules/_account_.md#accountstate)>

___
<a id="viewfunction"></a>

##  viewFunction

▸ **viewFunction**(contractId: *`string`*, methodName: *`string`*, args: *`any`*): `Promise`<`any`>

*Defined in [account.ts:178](https://github.com/nearprotocol/nearlib/blob/206b17f/src.ts/account.ts#L178)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| methodName | `string` |
| args | `any` |

**Returns:** `Promise`<`any`>

___

