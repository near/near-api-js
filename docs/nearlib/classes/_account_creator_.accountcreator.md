---
id: "_account_creator_.accountcreator"
title: "AccountCreator"
sidebar_label: "AccountCreator"
---

Account creator provides an interface for implementations to actually create accounts.

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

**Parameters:**

Name | Type |
------ | ------ |
`newAccountId` | string |
`publicKey` | [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** *Promise‹void›*
