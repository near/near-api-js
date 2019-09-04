

# Hierarchy

 [AccountCreator](_account_creator_.accountcreator.md)

**↳ LocalAccountCreator**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new LocalAccountCreator**(masterAccount: *[Account](_account_.account.md)*, initialBalance: *`BN`*): [LocalAccountCreator](_account_creator_.localaccountcreator.md)

*Defined in [account_creator.ts:16](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/account_creator.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| masterAccount | [Account](_account_.account.md) |
| initialBalance | `BN` |

**Returns:** [LocalAccountCreator](_account_creator_.localaccountcreator.md)

___

# Properties

<a id="initialbalance"></a>

##  initialBalance

**● initialBalance**: *`BN`*

*Defined in [account_creator.ts:16](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/account_creator.ts#L16)*

___
<a id="masteraccount"></a>

##  masterAccount

**● masterAccount**: *[Account](_account_.account.md)*

*Defined in [account_creator.ts:15](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/account_creator.ts#L15)*

___

# Methods

<a id="createaccount"></a>

##  createAccount

▸ **createAccount**(newAccountId: *`string`*, publicKey: *[PublicKey](_utils_key_pair_.publickey.md)*): `Promise`<`void`>

*Overrides [AccountCreator](_account_creator_.accountcreator.md).[createAccount](_account_creator_.accountcreator.md#createaccount)*

*Defined in [account_creator.ts:24](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/account_creator.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| newAccountId | `string` |
| publicKey | [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** `Promise`<`void`>

___

