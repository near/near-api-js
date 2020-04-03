---
id: "_near_.near"
title: "Near"
sidebar_label: "Near"
---

## Hierarchy

* **Near**

## Index

### Constructors

* [constructor](_near_.near.md#constructor)

### Properties

* [accountCreator](_near_.near.md#accountcreator)
* [config](_near_.near.md#config)
* [connection](_near_.near.md#connection)

### Methods

* [account](_near_.near.md#account)
* [createAccount](_near_.near.md#createaccount)
* [loadContract](_near_.near.md#loadcontract)
* [sendTokens](_near_.near.md#sendtokens)

## Constructors

###  constructor

\+ **new Near**(`config`: any): *[Near](_near_.near.md)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |

**Returns:** *[Near](_near_.near.md)*

## Properties

###  accountCreator

• **accountCreator**: *[AccountCreator](_account_creator_.accountcreator.md)*

___

###  config

• **config**: *any*

___

###  connection

• **connection**: *[Connection](_connection_.connection.md)*

## Methods

###  account

▸ **account**(`accountId`: string): *Promise‹[Account](_account_.account.md)›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`accountId` | string | near accountId used to interact with the network.  |

**Returns:** *Promise‹[Account](_account_.account.md)›*

___

###  createAccount

▸ **createAccount**(`accountId`: string, `publicKey`: [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹[Account](_account_.account.md)›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`accountId` | string | - |
`publicKey` | [PublicKey](_utils_key_pair_.publickey.md) |   |

**Returns:** *Promise‹[Account](_account_.account.md)›*

___

###  loadContract

▸ **loadContract**(`contractId`: string, `options`: object): *Promise‹[Contract](_contract_.contract.md)›*

**`deprecated`** Use `new nearlib.Contract(yourAccount, contractId, { viewMethods, changeMethods })` instead.

**Parameters:**

▪ **contractId**: *string*

▪ **options**: *object*

Name | Type |
------ | ------ |
`changeMethods` | string[] |
`sender` | string |
`viewMethods` | string[] |

**Returns:** *Promise‹[Contract](_contract_.contract.md)›*

___

###  sendTokens

▸ **sendTokens**(`amount`: BN, `originator`: string, `receiver`: string): *Promise‹string›*

**`deprecated`** Use `yourAccount.sendMoney` instead.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`amount` | BN | - |
`originator` | string | - |
`receiver` | string |   |

**Returns:** *Promise‹string›*
