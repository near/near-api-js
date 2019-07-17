

# Hierarchy

**Account**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new Account**(connection: *[Connection](_connection_.connection.md)*, accountId: *`string`*): [Account](_account_.account.md)

*Defined in [account.ts:46](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L46)*

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

*Defined in [account.ts:43](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L43)*

___
<a id="_state"></a>

## `<Private>` _state

**● _state**: *[AccountState](../interfaces/_account_.accountstate.md)*

*Defined in [account.ts:41](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L41)*

___
<a id="accountid"></a>

##  accountId

**● accountId**: *`string`*

*Defined in [account.ts:40](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L40)*

___
<a id="connection"></a>

##  connection

**● connection**: *[Connection](_connection_.connection.md)*

*Defined in [account.ts:39](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L39)*

___

# Accessors

<a id="ready"></a>

## `<Protected>` ready

**get ready**(): `Promise`<`void`>

*Defined in [account.ts:44](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L44)*

**Returns:** `Promise`<`void`>

___

# Methods

<a id="addkey"></a>

##  addKey

▸ **addKey**(publicKey: *`string`*, contractId?: *`string`*, methodName?: *`string`*, balanceOwner?: *`string`*, amount?: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:155](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L155)*

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

*Defined in [account.ts:134](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L134)*

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

*Defined in [account.ts:120](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L120)*

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

*Defined in [account.ts:162](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L162)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="deploycontract"></a>

##  deployContract

▸ **deployContract**(data: *`Uint8Array`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:140](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L140)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="fetchstate"></a>

##  fetchState

▸ **fetchState**(): `Promise`<`void`>

*Defined in [account.ts:53](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L53)*

**Returns:** `Promise`<`void`>

___
<a id="functioncall"></a>

##  functionCall

▸ **functionCall**(contractId: *`string`*, methodName: *`string`*, args: *`any`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:146](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L146)*

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

*Defined in [account.ts:182](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L182)*

**Returns:** `Promise`<`any`>

___
<a id="printlogs"></a>

## `<Private>` printLogs

▸ **printLogs**(contractId: *`string`*, logs: *`string`[]*): `void`

*Defined in [account.ts:65](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L65)*

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

*Defined in [account.ts:71](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L71)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| txHash | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="sendmoney"></a>

##  sendMoney

▸ **sendMoney**(receiver: *`string`*, amount: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:128](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L128)*

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

*Defined in [account.ts:86](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L86)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transaction | `any` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="stake"></a>

##  stake

▸ **stake**(publicKey: *`string`*, amount: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:168](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L168)*

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

*Defined in [account.ts:60](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L60)*

**Returns:** `Promise`<[AccountState](../interfaces/_account_.accountstate.md)>

___
<a id="viewfunction"></a>

##  viewFunction

▸ **viewFunction**(contractId: *`string`*, methodName: *`string`*, args: *`any`*): `Promise`<`any`>

*Defined in [account.ts:174](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/account.ts#L174)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| methodName | `string` |
| args | `any` |

**Returns:** `Promise`<`any`>

___

