

# Hierarchy

**Account**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new Account**(connection: *[Connection](_connection_.connection.md)*, accountId: *`string`*): [Account](_account_.account.md)

*Defined in [account.ts:47](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L47)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| connection | [Connection](_connection_.connection.md) |
| accountId | `string` |

**Returns:** [Account](_account_.account.md)

___

# Properties

<a id="_ready"></a>

## `<Private>` _ready

**● _ready**: *`Promise`<`void`>*

*Defined in [account.ts:44](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L44)*

___
<a id="_state"></a>

## `<Private>` _state

**● _state**: *[AccountState](../interfaces/_account_.accountstate.md)*

*Defined in [account.ts:42](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L42)*

___
<a id="accountid"></a>

##  accountId

**● accountId**: *`string`*

*Defined in [account.ts:41](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L41)*

___
<a id="connection"></a>

##  connection

**● connection**: *[Connection](_connection_.connection.md)*

*Defined in [account.ts:40](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L40)*

___

# Accessors

<a id="ready"></a>

## `<Protected>` ready

**get ready**(): `Promise`<`void`>

*Defined in [account.ts:45](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L45)*

**Returns:** `Promise`<`void`>

___

# Methods

<a id="addkey"></a>

##  addKey

▸ **addKey**(publicKey: *`string`*, contractId?: *`string`*, methodName?: *`string`*, balanceOwner?: *`string`*, amount?: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:159](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L159)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |
| `Optional` contractId | `string` |
| `Optional` methodName | `string` |
| `Optional` balanceOwner | `string` |
| `Optional` amount | `BN` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="createaccount"></a>

##  createAccount

▸ **createAccount**(newAccountId: *`string`*, publicKey: *`string`*, amount: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:138](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L138)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| newAccountId | `string` |
| publicKey | `string` |
| amount | `BN` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="createanddeploycontract"></a>

##  createAndDeployContract

▸ **createAndDeployContract**(contractId: *`string`*, publicKey: *`string`*, data: *`Uint8Array`*, amount: *`BN`*): `Promise`<[Account](_account_.account.md)>

*Defined in [account.ts:124](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L124)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| publicKey | `string` |
| data | `Uint8Array` |
| amount | `BN` |

**Returns:** `Promise`<[Account](_account_.account.md)>

___
<a id="deletekey"></a>

##  deleteKey

▸ **deleteKey**(publicKey: *`string`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:166](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L166)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="deploycontract"></a>

##  deployContract

▸ **deployContract**(data: *`Uint8Array`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:144](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L144)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="fetchstate"></a>

##  fetchState

▸ **fetchState**(): `Promise`<`void`>

*Defined in [account.ts:54](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L54)*

**Returns:** `Promise`<`void`>

___
<a id="functioncall"></a>

##  functionCall

▸ **functionCall**(contractId: *`string`*, methodName: *`string`*, args: *`any`*, amount?: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:150](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L150)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| methodName | `string` |
| args | `any` |
| `Optional` amount | `BN` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="getaccountdetails"></a>

##  getAccountDetails

▸ **getAccountDetails**(): `Promise`<`any`>

*Defined in [account.ts:186](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L186)*

**Returns:** `Promise`<`any`>

___
<a id="printlogs"></a>

## `<Private>` printLogs

▸ **printLogs**(contractId: *`string`*, logs: *`string`[]*): `void`

*Defined in [account.ts:66](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L66)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| logs | `string`[] |

**Returns:** `void`

___
<a id="retrytxresult"></a>

## `<Private>` retryTxResult

▸ **retryTxResult**(txHash: *`Uint8Array`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:72](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L72)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| txHash | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="sendmoney"></a>

##  sendMoney

▸ **sendMoney**(receiver: *`string`*, amount: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:132](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L132)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| receiver | `string` |
| amount | `BN` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="signandsendtransaction"></a>

## `<Private>` signAndSendTransaction

▸ **signAndSendTransaction**(transaction: *`any`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:87](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L87)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transaction | `any` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="stake"></a>

##  stake

▸ **stake**(publicKey: *`string`*, amount: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:172](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L172)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |
| amount | `BN` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="state"></a>

##  state

▸ **state**(): `Promise`<[AccountState](../interfaces/_account_.accountstate.md)>

*Defined in [account.ts:61](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L61)*

**Returns:** `Promise`<[AccountState](../interfaces/_account_.accountstate.md)>

___
<a id="viewfunction"></a>

##  viewFunction

▸ **viewFunction**(contractId: *`string`*, methodName: *`string`*, args: *`any`*): `Promise`<`any`>

*Defined in [account.ts:178](https://github.com/nearprotocol/nearlib/blob/7c6612b/src.ts/account.ts#L178)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| methodName | `string` |
| args | `any` |

**Returns:** `Promise`<`any`>

___

