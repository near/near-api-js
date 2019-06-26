

# Hierarchy

**Near**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new Near**(config: *`any`*): [Near](_near_.near.md)

*Defined in [near.ts:11](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/near.ts#L11)*

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

*Defined in [near.ts:11](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/near.ts#L11)*

___
<a id="connection"></a>

##  connection

**● connection**: *[Connection](_connection_.connection.md)*

*Defined in [near.ts:10](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/near.ts#L10)*

___

# Methods

<a id="account"></a>

##  account

▸ **account**(accountId: *`string`*): `Promise`<[Account](_account_.account.md)>

*Defined in [near.ts:29](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/near.ts#L29)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| accountId | `string` |

**Returns:** `Promise`<[Account](_account_.account.md)>

___
<a id="createaccount"></a>

##  createAccount

▸ **createAccount**(accountId: *`string`*, publicKey: *`string`*): `Promise`<[Account](_account_.account.md)>

*Defined in [near.ts:35](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/near.ts#L35)*

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

*Defined in [near.ts:59](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/near.ts#L59)*

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

*Defined in [near.ts:48](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/near.ts#L48)*

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

▸ **sendTokens**(amount: *`bigint`*, originator: *`string`*, receiver: *`string`*): `Promise`<`string`>

*Defined in [near.ts:72](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/near.ts#L72)*

Backwards compatibility method. Use `yourAccount.sendMoney` instead.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| amount | `bigint` |  \- |
| originator | `string` |  \- |
| receiver | `string` |   |

**Returns:** `Promise`<`string`>

___

