

# Hierarchy

 [AccountCreator](_account_creator_.accountcreator.md)

**↳ UrlAccountCreator**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new UrlAccountCreator**(connection: *[Connection](_connection_.connection.md)*, helperUrl: *`string`*): [UrlAccountCreator](_account_creator_.urlaccountcreator.md)

*Defined in [account_creator.ts:32](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/account_creator.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| connection | [Connection](_connection_.connection.md) |
| helperUrl | `string` |

**Returns:** [UrlAccountCreator](_account_creator_.urlaccountcreator.md)

___

# Properties

<a id="connection"></a>

##  connection

**● connection**: *[Connection](_connection_.connection.md)*

*Defined in [account_creator.ts:31](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/account_creator.ts#L31)*

___
<a id="helperconnection"></a>

##  helperConnection

**● helperConnection**: *[ConnectionInfo](../interfaces/_utils_web_.connectioninfo.md)*

*Defined in [account_creator.ts:32](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/account_creator.ts#L32)*

___

# Methods

<a id="createaccount"></a>

##  createAccount

▸ **createAccount**(newAccountId: *`string`*, publicKey: *[PublicKey](_utils_key_pair_.publickey.md)*): `Promise`<`void`>

*Overrides [AccountCreator](_account_creator_.accountcreator.md).[createAccount](_account_creator_.accountcreator.md#createaccount)*

*Defined in [account_creator.ts:40](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/account_creator.ts#L40)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| newAccountId | `string` |
| publicKey | [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** `Promise`<`void`>

___

