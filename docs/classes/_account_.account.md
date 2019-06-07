

# Hierarchy

**Account**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new Account**(connection: *[Connection](_connection_.connection.md)*, accountId: *`string`*): [Account](_account_.account.md)

*Defined in [account.ts:27](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L27)*

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

*Defined in [account.ts:26](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L26)*

___
<a id="accountid"></a>

##  accountId

**● accountId**: *`string`*

*Defined in [account.ts:25](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L25)*

___
<a id="connection"></a>

##  connection

**● connection**: *[Connection](_connection_.connection.md)*

*Defined in [account.ts:24](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L24)*

___
<a id="ready"></a>

## `<Protected>` ready

**● ready**: *`Promise`<`void`>*

*Defined in [account.ts:27](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L27)*

___

# Methods

<a id="addkey"></a>

##  addKey

▸ **addKey**(publicKey: *`string`*, contractId?: *`string`*, methodName?: *`string`*, balanceOwner?: *`string`*, amount?: *`bigint`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:114](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L114)*

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

*Defined in [account.ts:93](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L93)*

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

*Defined in [account.ts:79](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L79)*

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

*Defined in [account.ts:121](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L121)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___
<a id="deploycontract"></a>

##  deployContract

▸ **deployContract**(data: *`Uint8Array`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:99](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L99)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___
<a id="fetchstate"></a>

##  fetchState

▸ **fetchState**(): `Promise`<`void`>

*Defined in [account.ts:35](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L35)*

**Returns:** `Promise`<`void`>

___
<a id="functioncall"></a>

##  functionCall

▸ **functionCall**(contractId: *`string`*, methodName: *`string`*, args: *`any`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:105](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L105)*

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

*Defined in [account.ts:137](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L137)*

**Returns:** `Promise`<`any`>

___
<a id="printlogs"></a>

## `<Private>` printLogs

▸ **printLogs**(contractId: *`string`*, logs: *`string`[]*): `void`

*Defined in [account.ts:48](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L48)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| logs | `string`[] |

**Returns:** `void`

___
<a id="sendmoney"></a>

##  sendMoney

▸ **sendMoney**(receiver: *`string`*, amount: *`bigint`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [account.ts:87](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L87)*

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

*Defined in [account.ts:56](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L56)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transaction | `any` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___
<a id="state"></a>

##  state

▸ **state**(): `Promise`<[AccountState](../modules/_account_.md#accountstate)>

*Defined in [account.ts:43](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L43)*

**Returns:** `Promise`<[AccountState](../modules/_account_.md#accountstate)>

___
<a id="viewfunction"></a>

##  viewFunction

▸ **viewFunction**(contractId: *`string`*, methodName: *`string`*, args: *`any`*): `Promise`<`any`>

*Defined in [account.ts:127](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/account.ts#L127)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| methodName | `string` |
| args | `any` |

**Returns:** `Promise`<`any`>

___

