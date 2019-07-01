

# Hierarchy

**Account**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new Account**(connection: *[Connection](_connection_.connection.md)*, accountId: *`string`*): [Account](_account_.account.md)

*Defined in [account.ts:45](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L45)*

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

*Defined in [account.ts:42](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L42)*

___
<a id="_state"></a>

## `<Private>` _state

**● _state**: *[AccountState](../interfaces/_account_.accountstate.md)*

*Defined in [account.ts:40](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L40)*

___
<a id="accountid"></a>

##  accountId

**● accountId**: *`string`*

*Defined in [account.ts:39](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L39)*

___
<a id="connection"></a>

##  connection

**● connection**: *[Connection](_connection_.connection.md)*

*Defined in [account.ts:38](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L38)*

___

# Accessors

<a id="ready"></a>

## `<Protected>` ready

**get ready**(): `Promise`<`void`>

*Defined in [account.ts:43](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L43)*

**Returns:** `Promise`<`void`>

___

# Methods

<a id="addkey"></a>

##  addKey

▸ **addKey**(publicKey: *`string`*, contractId?: *`string`*, methodName?: *`string`*, balanceOwner?: *`string`*, amount?: *`bigint`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:161](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L161)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |
| `Optional` contractId | `string` |
| `Optional` methodName | `string` |
| `Optional` balanceOwner | `string` |
| `Optional` amount | `bigint` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="createaccount"></a>

##  createAccount

▸ **createAccount**(newAccountId: *`string`*, publicKey: *`string`*, amount: *`bigint`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:140](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L140)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| newAccountId | `string` |
| publicKey | `string` |
| amount | `bigint` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="createanddeploycontract"></a>

##  createAndDeployContract

▸ **createAndDeployContract**(contractId: *`string`*, publicKey: *`string`*, data: *`Uint8Array`*, amount: *`bigint`*): `Promise`<[Account](_account_.account.md)>

*Defined in [account.ts:126](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L126)*

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

▸ **deleteKey**(publicKey: *`string`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:168](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L168)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="deploycontract"></a>

##  deployContract

▸ **deployContract**(data: *`Uint8Array`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:146](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L146)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="fetchstate"></a>

##  fetchState

▸ **fetchState**(): `Promise`<`void`>

*Defined in [account.ts:52](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L52)*

**Returns:** `Promise`<`void`>

___
<a id="functioncall"></a>

##  functionCall

▸ **functionCall**(contractId: *`string`*, methodName: *`string`*, args: *`any`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:152](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L152)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| methodName | `string` |
| args | `any` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="getaccountdetails"></a>

##  getAccountDetails

▸ **getAccountDetails**(): `Promise`<`any`>

*Defined in [account.ts:188](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L188)*

**Returns:** `Promise`<`any`>

___
<a id="printlogs"></a>

## `<Private>` printLogs

▸ **printLogs**(contractId: *`string`*, logs: *`string`[]*): `void`

*Defined in [account.ts:64](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L64)*

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

*Defined in [account.ts:70](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L70)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| txHash | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="sendmoney"></a>

##  sendMoney

▸ **sendMoney**(receiver: *`string`*, amount: *`bigint`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:134](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L134)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| receiver | `string` |
| amount | `bigint` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="signandsendtransaction"></a>

## `<Private>` signAndSendTransaction

▸ **signAndSendTransaction**(transaction: *`any`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:92](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L92)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transaction | `any` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="stake"></a>

##  stake

▸ **stake**(publicKey: *`string`*, amount: *`bigint`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:174](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L174)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |
| amount | `bigint` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="state"></a>

##  state

▸ **state**(): `Promise`<[AccountState](../interfaces/_account_.accountstate.md)>

*Defined in [account.ts:59](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L59)*

**Returns:** `Promise`<[AccountState](../interfaces/_account_.accountstate.md)>

___
<a id="viewfunction"></a>

##  viewFunction

▸ **viewFunction**(contractId: *`string`*, methodName: *`string`*, args: *`any`*): `Promise`<`any`>

*Defined in [account.ts:180](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account.ts#L180)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| methodName | `string` |
| args | `any` |

**Returns:** `Promise`<`any`>

___

