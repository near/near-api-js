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

**Parameters:**

Name | Type |
------ | ------ |
`connection` | [Connection](_connection_.connection.md) |
`helperUrl` | string |

**Returns:** *[UrlAccountCreator](_account_creator_.urlaccountcreator.md)*

## Properties

###  connection

• **connection**: *[Connection](_connection_.connection.md)*

___

###  helperUrl

• **helperUrl**: *string*

## Methods

###  createAccount

▸ **createAccount**(`newAccountId`: string, `publicKey`: [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹void›*

*Overrides [AccountCreator](_account_creator_.accountcreator.md).[createAccount](_account_creator_.accountcreator.md#abstract-createaccount)*

Creates an account using a helperUrl
This is [hosted here](https://helper.nearprotocol.com) or set up locally with the [near-contract-helper](https://github.com/nearprotocol/near-contract-helper) repository

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`newAccountId` | string | The name of the NEAR account to be created |
`publicKey` | [PublicKey](_utils_key_pair_.publickey.md) | The public key from the masterAccount used to create this account |

**Returns:** *Promise‹void›*
