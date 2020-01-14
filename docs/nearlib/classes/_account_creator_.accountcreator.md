---
id: "_account_creator_.accountcreator"
title: "AccountCreator"
sidebar_label: "AccountCreator"
---

Account creator provides interface to specific implementation to acutally create account.

## Hierarchy

* **AccountCreator**

  ↳ [LocalAccountCreator](_account_creator_.localaccountcreator.md)

  ↳ [UrlAccountCreator](_account_creator_.urlaccountcreator.md)

## Index

### Methods

* [createAccount](_account_creator_.accountcreator.md#abstract-createaccount)

## Methods

### `Abstract` createAccount

▸ **createAccount**(`newAccountId`: string, `publicKey`: [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹void›*

*Defined in [src.ts/account_creator.ts:11](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/account_creator.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`newAccountId` | string |
`publicKey` | [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** *Promise‹void›*
