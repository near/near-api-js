---
id: "_account_creator_.localaccountcreator"
title: "LocalAccountCreator"
sidebar_label: "LocalAccountCreator"
---

## Hierarchy

* [AccountCreator](_account_creator_.accountcreator.md)

  ↳ **LocalAccountCreator**

## Index

### Constructors

* [constructor](_account_creator_.localaccountcreator.md#constructor)

### Properties

* [initialBalance](_account_creator_.localaccountcreator.md#initialbalance)
* [masterAccount](_account_creator_.localaccountcreator.md#masteraccount)

### Methods

* [createAccount](_account_creator_.localaccountcreator.md#createaccount)

## Constructors

###  constructor

\+ **new LocalAccountCreator**(`masterAccount`: [Account](_account_.account.md), `initialBalance`: BN): *[LocalAccountCreator](_account_creator_.localaccountcreator.md)*

**Parameters:**

Name | Type |
------ | ------ |
`masterAccount` | [Account](_account_.account.md) |
`initialBalance` | BN |

**Returns:** *[LocalAccountCreator](_account_creator_.localaccountcreator.md)*

## Properties

###  initialBalance

• **initialBalance**: *BN*

___

###  masterAccount

• **masterAccount**: *[Account](_account_.account.md)*

## Methods

###  createAccount

▸ **createAccount**(`newAccountId`: string, `publicKey`: [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹void›*

*Overrides [AccountCreator](_account_creator_.accountcreator.md).[createAccount](_account_creator_.accountcreator.md#abstract-createaccount)*

Creates an account using a masterAccount, meaning the new account is created from an existing account

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`newAccountId` | string | The name of the NEAR account to be created |
`publicKey` | [PublicKey](_utils_key_pair_.publickey.md) | The public key from the masterAccount used to create this account |

**Returns:** *Promise‹void›*
