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

\+ **new LocalAccountCreator**(`masterAccount`: [Account](_account_.account.md), `initialBalance`: [BN](../modules/_utils_format_.md#const-bn)): *[LocalAccountCreator](_account_creator_.localaccountcreator.md)*

*Defined in [src.ts/account_creator.ts:16](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account_creator.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`masterAccount` | [Account](_account_.account.md) |
`initialBalance` | [BN](../modules/_utils_format_.md#const-bn) |

**Returns:** *[LocalAccountCreator](_account_creator_.localaccountcreator.md)*

## Properties

###  initialBalance

• **initialBalance**: *[BN](../modules/_utils_format_.md#const-bn)*

*Defined in [src.ts/account_creator.ts:16](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account_creator.ts#L16)*

___

###  masterAccount

• **masterAccount**: *[Account](_account_.account.md)*

*Defined in [src.ts/account_creator.ts:15](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account_creator.ts#L15)*

## Methods

###  createAccount

▸ **createAccount**(`newAccountId`: string, `publicKey`: [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹void›*

*Overrides [AccountCreator](_account_creator_.accountcreator.md).[createAccount](_account_creator_.accountcreator.md#abstract-createaccount)*

*Defined in [src.ts/account_creator.ts:24](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account_creator.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`newAccountId` | string |
`publicKey` | [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** *Promise‹void›*
