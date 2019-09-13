

# Hierarchy

**Account**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new Account**(connection: *[Connection](_connection_.connection.md)*, accountId: *`string`*): [Account](_account_.account.md)

*Defined in [account.ts:46](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L46)*

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

*Defined in [account.ts:41](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L41)*

___
<a id="_ready"></a>

## `<Private>` _ready

**● _ready**: *`Promise`<`void`>*

*Defined in [account.ts:43](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L43)*

___
<a id="_state"></a>

## `<Private>` _state

**● _state**: *[AccountState](../interfaces/_account_.accountstate.md)*

*Defined in [account.ts:40](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L40)*

___
<a id="accountid"></a>

##  accountId

**● accountId**: *`string`*

*Defined in [account.ts:39](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L39)*

___
<a id="connection"></a>

##  connection

**● connection**: *[Connection](_connection_.connection.md)*

*Defined in [account.ts:38](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L38)*

___

# Accessors

<a id="ready"></a>

## `<Protected>` ready

**get ready**(): `Promise`<`void`>

*Defined in [account.ts:44](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L44)*

**Returns:** `Promise`<`void`>

___

# Methods

<a id="addkey"></a>

##  addKey

▸ **addKey**(publicKey: *`string` \| [PublicKey](_utils_key_pair_.publickey.md)*, contractId?: *`string`*, methodName?: *`string`*, amount?: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:158](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L158)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` \| [PublicKey](_utils_key_pair_.publickey.md) |
| `Optional` contractId | `string` |
| `Optional` methodName | `string` |
| `Optional` amount | `BN` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="createaccount"></a>

##  createAccount

▸ **createAccount**(newAccountId: *`string`*, publicKey: *`string` \| [PublicKey](_utils_key_pair_.publickey.md)*, amount: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:141](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L141)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| newAccountId | `string` |
| publicKey | `string` \| [PublicKey](_utils_key_pair_.publickey.md) |
| amount | `BN` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="createanddeploycontract"></a>

##  createAndDeployContract

▸ **createAndDeployContract**(contractId: *`string`*, publicKey: *`string` \| [PublicKey](_utils_key_pair_.publickey.md)*, data: *`Uint8Array`*, amount: *`BN`*): `Promise`<[Account](_account_.account.md)>

*Defined in [account.ts:130](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L130)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| publicKey | `string` \| [PublicKey](_utils_key_pair_.publickey.md) |
| data | `Uint8Array` |
| amount | `BN` |

**Returns:** `Promise`<[Account](_account_.account.md)>

___
<a id="deletekey"></a>

##  deleteKey

▸ **deleteKey**(publicKey: *`string` \| [PublicKey](_utils_key_pair_.publickey.md)*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:168](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L168)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` \| [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="deploycontract"></a>

##  deployContract

▸ **deployContract**(data: *`Uint8Array`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:146](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L146)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="fetchstate"></a>

##  fetchState

▸ **fetchState**(): `Promise`<`void`>

*Defined in [account.ts:53](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L53)*

**Returns:** `Promise`<`void`>

___
<a id="functioncall"></a>

##  functionCall

▸ **functionCall**(contractId: *`string`*, methodName: *`string`*, args: *`any`*, gas: *`number`*, amount?: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:150](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L150)*

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

*Defined in [account.ts:185](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L185)*

**Returns:** `Promise`<`any`>

___
<a id="getaccountdetails"></a>

##  getAccountDetails

▸ **getAccountDetails**(): `Promise`<`any`>

*Defined in [account.ts:190](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L190)*

**Returns:** `Promise`<`any`>

___
<a id="printlogs"></a>

## `<Private>` printLogs

▸ **printLogs**(contractId: *`string`*, logs: *`string`[]*): `void`

*Defined in [account.ts:72](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L72)*

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

*Defined in [account.ts:78](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L78)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| txHash | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="sendmoney"></a>

##  sendMoney

▸ **sendMoney**(receiverId: *`string`*, amount: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:137](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L137)*

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

*Defined in [account.ts:93](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L93)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| receiverId | `string` |
| actions | [Action](_transaction_.action.md)[] |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="stake"></a>

##  stake

▸ **stake**(publicKey: *`string` \| [PublicKey](_utils_key_pair_.publickey.md)*, amount: *`BN`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [account.ts:172](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L172)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` \| [PublicKey](_utils_key_pair_.publickey.md) |
| amount | `BN` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="state"></a>

##  state

▸ **state**(): `Promise`<[AccountState](../interfaces/_account_.accountstate.md)>

*Defined in [account.ts:67](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L67)*

**Returns:** `Promise`<[AccountState](../interfaces/_account_.accountstate.md)>

___
<a id="viewfunction"></a>

##  viewFunction

▸ **viewFunction**(contractId: *`string`*, methodName: *`string`*, args: *`any`*): `Promise`<`any`>

*Defined in [account.ts:176](https://github.com/nearprotocol/nearlib/blob/5251dca/src.ts/account.ts#L176)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractId | `string` |
| methodName | `string` |
| args | `any` |

**Returns:** `Promise`<`any`>

___

