---
id: "_account_creator_.urlaccountcreator"
title: "UrlAccountCreator"
sidebar_label: "UrlAccountCreator"
---

## Hierarchy

* [AccountCreator](_account_creator_.accountcreator.md)

  ↳ **UrlAccountCreator**

## Index

### Constructors

* [constructor](_account_creator_.urlaccountcreator.md#constructor)

### Properties

* [connection](_account_creator_.urlaccountcreator.md#connection)
* [helperUrl](_account_creator_.urlaccountcreator.md#helperurl)

### Methods

* [createAccount](_account_creator_.urlaccountcreator.md#createaccount)

## Constructors

###  constructor

\+ **new UrlAccountCreator**(`connection`: [Connection](_connection_.connection.md), `helperUrl`: string): *[UrlAccountCreator](_account_creator_.urlaccountcreator.md)*

*Defined in [src.ts/account_creator.ts:31](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/account_creator.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`connection` | [Connection](_connection_.connection.md) |
`helperUrl` | string |

**Returns:** *[UrlAccountCreator](_account_creator_.urlaccountcreator.md)*

## Properties

###  connection

• **connection**: *[Connection](_connection_.connection.md)*

*Defined in [src.ts/account_creator.ts:30](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/account_creator.ts#L30)*

___

###  helperUrl

• **helperUrl**: *string*

*Defined in [src.ts/account_creator.ts:31](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/account_creator.ts#L31)*

## Methods

###  createAccount

▸ **createAccount**(`newAccountId`: string, `publicKey`: [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹void›*

*Overrides [AccountCreator](_account_creator_.accountcreator.md).[createAccount](_account_creator_.accountcreator.md#abstract-createaccount)*

*Defined in [src.ts/account_creator.ts:39](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/account_creator.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`newAccountId` | string |
`publicKey` | [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** *Promise‹void›*
