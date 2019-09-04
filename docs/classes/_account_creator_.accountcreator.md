

Account creator provides interface to specific implementation to acutally create account.

# Hierarchy

**AccountCreator**

↳  [LocalAccountCreator](_account_creator_.localaccountcreator.md)

↳  [UrlAccountCreator](_account_creator_.urlaccountcreator.md)

# Methods

<a id="createaccount"></a>

## `<Abstract>` createAccount

▸ **createAccount**(newAccountId: *`string`*, publicKey: *[PublicKey](_utils_key_pair_.publickey.md)*): `Promise`<`void`>

*Defined in [account_creator.ts:11](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/account_creator.ts#L11)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| newAccountId | `string` |
| publicKey | [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** `Promise`<`void`>

___

