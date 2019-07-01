

# Hierarchy

 [AccountCreator](_account_creator_.accountcreator.md)

**↳ LocalAccountCreator**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new LocalAccountCreator**(masterAccount: *[Account](_account_.account.md)*, initialBalance: *`bigint`*): [LocalAccountCreator](_account_creator_.localaccountcreator.md)

*Defined in [account_creator.ts:14](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account_creator.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| masterAccount | [Account](_account_.account.md) |
| initialBalance | `bigint` |

**Returns:** [LocalAccountCreator](_account_creator_.localaccountcreator.md)

___

# Properties

<a id="initialbalance"></a>

##  initialBalance

**● initialBalance**: *`bigint`*

*Defined in [account_creator.ts:14](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account_creator.ts#L14)*

___
<a id="masteraccount"></a>

##  masterAccount

**● masterAccount**: *[Account](_account_.account.md)*

*Defined in [account_creator.ts:13](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account_creator.ts#L13)*

___

# Methods

<a id="createaccount"></a>

##  createAccount

▸ **createAccount**(newAccountId: *`string`*, publicKey: *`string`*): `Promise`<`void`>

*Overrides [AccountCreator](_account_creator_.accountcreator.md).[createAccount](_account_creator_.accountcreator.md#createaccount)*

*Defined in [account_creator.ts:22](https://github.com/nearprotocol/nearlib/blob/c8da0d8/src.ts/account_creator.ts#L22)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| newAccountId | `string` |
| publicKey | `string` |

**Returns:** `Promise`<`void`>

___

