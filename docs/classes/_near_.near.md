

# Hierarchy

**Near**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new Near**(config: *`any`*): [Near](_near_.near.md)

*Defined in [near.ts:13](https://github.com/nearprotocol/nearlib/blob/8b364b8/src.ts/near.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | `any` |

**Returns:** [Near](_near_.near.md)

___

# Properties

<a id="accountcreator"></a>

##  accountCreator

**● accountCreator**: *[AccountCreator](_account_creator_.accountcreator.md)*

*Defined in [near.ts:13](https://github.com/nearprotocol/nearlib/blob/8b364b8/src.ts/near.ts#L13)*

___
<a id="connection"></a>

##  connection

**● connection**: *[Connection](_connection_.connection.md)*

*Defined in [near.ts:12](https://github.com/nearprotocol/nearlib/blob/8b364b8/src.ts/near.ts#L12)*

___

# Methods

<a id="account"></a>

##  account

▸ **account**(accountId: *`string`*): `Promise`<[Account](_account_.account.md)>

*Defined in [near.ts:31](https://github.com/nearprotocol/nearlib/blob/8b364b8/src.ts/near.ts#L31)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| accountId | `string` |

**Returns:** `Promise`<[Account](_account_.account.md)>

___
<a id="createaccount"></a>

##  createAccount

▸ **createAccount**(accountId: *`string`*, publicKey: *`string`*): `Promise`<[Account](_account_.account.md)>

*Defined in [near.ts:37](https://github.com/nearprotocol/nearlib/blob/8b364b8/src.ts/near.ts#L37)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| accountId | `string` |
| publicKey | `string` |

**Returns:** `Promise`<[Account](_account_.account.md)>

___
<a id="deploycontract"></a>

##  deployContract

▸ **deployContract**(contractId: *`string`*, wasmByteArray: *`Uint8Array`*): `Promise`<`string`>

*Defined in [near.ts:61](https://github.com/nearprotocol/nearlib/blob/8b364b8/src.ts/near.ts#L61)*

Backwards compatibility method. Use `contractAccount.deployContract` or `yourAccount.createAndDeployContract` instead.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| contractId | `string` |  \- |
| wasmByteArray | `Uint8Array` |   |

**Returns:** `Promise`<`string`>

___
<a id="loadcontract"></a>

##  loadContract

▸ **loadContract**(contractId: *`string`*, options: *`object`*): `Promise`<[Contract](_contract_.contract.md)>

*Defined in [near.ts:50](https://github.com/nearprotocol/nearlib/blob/8b364b8/src.ts/near.ts#L50)*

Backwards compatibility method. Use `new nearlib.Contract(yourAccount, contractId, { viewMethods, changeMethods })` instead.

**Parameters:**

**contractId: `string`**

**options: `object`**

| Name | Type |
| ------ | ------ |
| changeMethods | `string`[] |
| sender | `string` |
| viewMethods | `string`[] |

**Returns:** `Promise`<[Contract](_contract_.contract.md)>

___
<a id="sendtokens"></a>

##  sendTokens

▸ **sendTokens**(amount: *`BN`*, originator: *`string`*, receiver: *`string`*): `Promise`<`string`>

*Defined in [near.ts:74](https://github.com/nearprotocol/nearlib/blob/8b364b8/src.ts/near.ts#L74)*

Backwards compatibility method. Use `yourAccount.sendMoney` instead.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| amount | `BN` |  \- |
| originator | `string` |  \- |
| receiver | `string` |   |

**Returns:** `Promise`<`string`>

___

