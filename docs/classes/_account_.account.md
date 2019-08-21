

# Hierarchy

**Account**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new Account**(connection: *[Connection](_connection_.connection.md)*, accountId: *`string`*): [Account](_account_.account.md)

*Defined in [account.ts:45](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L45)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| connection | [Connection](_connection_.connection.md) |
| accountId | `string` |

**Returns:** [Account](_account_.account.md)

___

# Properties

<a id="_accesskey"></a>

## `<Private>` _accessKey

**● _accessKey**: *[AccessKey](_transaction_.accesskey.md)*

*Defined in [account.ts:40](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L40)*

___
<a id="_ready"></a>

## `<Private>` _ready

**● _ready**: *`Promise`<`void`>*

*Defined in [account.ts:42](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L42)*

___
<a id="_state"></a>

## `<Private>` _state

**● _state**: *[AccountState](../interfaces/_account_.accountstate.md)*

*Defined in [account.ts:39](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L39)*

___
<a id="accountid"></a>

##  accountId

**● accountId**: *`string`*

*Defined in [account.ts:38](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L38)*

___
<a id="connection"></a>

##  connection

**● connection**: *[Connection](_connection_.connection.md)*

*Defined in [account.ts:37](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L37)*

___

# Accessors

<a id="ready"></a>

## `<Protected>` ready

**get ready**(): `Promise`<`void`>

*Defined in [account.ts:43](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L43)*

**Returns:** `Promise`<`void`>

___

# Methods

<a id="addkey"></a>

##  addKey

▸ **addKey**(publicKey: *`string`*, contractId?: *`string`*, methodName?: *`string`*, amount?: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:150](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L150)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |
| `Optional` contractId | `string` |
| `Optional` methodName | `string` |
| `Optional` amount | `BN` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="createaccount"></a>

##  createAccount

▸ **createAccount**(newAccountId: *`string`*, publicKey: *`string`*, amount: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:133](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L133)*

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

*Defined in [account.ts:121](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L121)*

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

*Defined in [account.ts:160](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L160)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="deploycontract"></a>

##  deployContract

▸ **deployContract**(data: *`Uint8Array`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:138](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L138)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="fetchstate"></a>

##  fetchState

▸ **fetchState**(): `Promise`<`void`>

*Defined in [account.ts:52](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L52)*

**Returns:** `Promise`<`void`>

___
<a id="functioncall"></a>

##  functionCall

▸ **functionCall**(contractId: *`string`*, methodName: *`string`*, args: *`any`*, gas: *`number`*, amount?: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:142](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L142)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| methodName | `string` |
| args | `any` |
| gas | `number` |
| `Optional` amount | `BN` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="getaccesskeys"></a>

##  getAccessKeys

▸ **getAccessKeys**(): `Promise`<`any`>

*Defined in [account.ts:177](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L177)*

**Returns:** `Promise`<`any`>

___
<a id="getaccountdetails"></a>

##  getAccountDetails

▸ **getAccountDetails**(): `Promise`<`any`>

*Defined in [account.ts:182](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L182)*

**Returns:** `Promise`<`any`>

___
<a id="printlogs"></a>

## `<Private>` printLogs

▸ **printLogs**(contractId: *`string`*, logs: *`string`[]*): `void`

*Defined in [account.ts:67](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L67)*

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

*Defined in [account.ts:73](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| txHash | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="sendmoney"></a>

##  sendMoney

▸ **sendMoney**(receiverId: *`string`*, amount: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:129](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L129)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| receiverId | `string` |
| amount | `BN` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="signandsendtransaction"></a>

## `<Private>` signAndSendTransaction

▸ **signAndSendTransaction**(receiverId: *`string`*, actions: *[Action](_transaction_.action.md)[]*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:88](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L88)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| receiverId | `string` |
| actions | [Action](_transaction_.action.md)[] |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="stake"></a>

##  stake

▸ **stake**(publicKey: *`string`*, amount: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:164](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L164)*

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

*Defined in [account.ts:62](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L62)*

**Returns:** `Promise`<[AccountState](../interfaces/_account_.accountstate.md)>

___
<a id="viewfunction"></a>

##  viewFunction

▸ **viewFunction**(contractId: *`string`*, methodName: *`string`*, args: *`any`*): `Promise`<`any`>

*Defined in [account.ts:168](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/account.ts#L168)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| methodName | `string` |
| args | `any` |

**Returns:** `Promise`<`any`>

___

