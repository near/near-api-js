---
id: "_account_.account"
title: "Account"
sidebar_label: "Account"
---

More information on [the Account spec](https://nomicon.io/DataStructures/Account.html)

## Hierarchy

* **Account**

  ↳ [ConnectedWalletAccount](_wallet_account_.connectedwalletaccount.md)

## Index

### Constructors

* [constructor](_account_.account.md#constructor)

### Properties

* [accountId](_account_.account.md#accountid)
* [connection](_account_.account.md#connection)

### Methods

* [addKey](_account_.account.md#addkey)
* [createAccount](_account_.account.md#createaccount)
* [createAndDeployContract](_account_.account.md#createanddeploycontract)
* [deleteAccount](_account_.account.md#deleteaccount)
* [deleteKey](_account_.account.md#deletekey)
* [deployContract](_account_.account.md#deploycontract)
* [fetchState](_account_.account.md#fetchstate)
* [functionCall](_account_.account.md#functioncall)
* [getAccessKeys](_account_.account.md#getaccesskeys)
* [getAccountDetails](_account_.account.md#getaccountdetails)
* [sendMoney](_account_.account.md#sendmoney)
* [stake](_account_.account.md#stake)
* [state](_account_.account.md#state)
* [viewFunction](_account_.account.md#viewfunction)

## Constructors

###  constructor

\+ **new Account**(`connection`: [Connection](_connection_.connection.md), `accountId`: string): *[Account](_account_.account.md)*

**Parameters:**

Name | Type |
------ | ------ |
`connection` | [Connection](_connection_.connection.md) |
`accountId` | string |

**Returns:** *[Account](_account_.account.md)*

## Properties

###  accountId

• **accountId**: *string*

___

###  connection

• **connection**: *[Connection](_connection_.connection.md)*

## Methods

###  addKey

▸ **addKey**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `contractId?`: string, `methodName?`: string, `amount?`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) | A public key to be associated with the contract |
`contractId?` | string | NEAR account where the contract is deployed |
`methodName?` | string | The method name on the contract as it is written in the contract code |
`amount?` | BN | Payment in yoctoⓃ that is sent to the contract during this function call |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

TODO: expand this API to support more options.

___

###  createAccount

▸ **createAccount**(`newAccountId`: string, `publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `amount`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`newAccountId` | string | NEAR account name to be created |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) | A public key created from the masterAccount |
`amount` | BN | - |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  createAndDeployContract

▸ **createAndDeployContract**(`contractId`: string, `publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `data`: Uint8Array, `amount`: BN): *Promise‹[Account](_account_.account.md)›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`contractId` | string | NEAR account where the contract is deployed |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) | The public key to add while signing and sending the transaction |
`data` | Uint8Array | The compiled contract code |
`amount` | BN | - |

**Returns:** *Promise‹[Account](_account_.account.md)›*

___

###  deleteAccount

▸ **deleteAccount**(`beneficiaryId`: string): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`beneficiaryId` | string | The NEAR account that will receive the remaining Ⓝ balance from the account being deleted |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

void

___

###  deleteKey

▸ **deleteKey**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) | The public key to be deleted |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  deployContract

▸ **deployContract**(`data`: Uint8Array): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The compiled contract code |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  fetchState

▸ **fetchState**(): *Promise‹void›*

Helper function when getting the state of a NEAR account

**Returns:** *Promise‹void›*

Promise<void>

___

###  functionCall

▸ **functionCall**(`contractId`: string, `methodName`: string, `args`: any, `gas?`: BN, `amount?`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`contractId` | string | NEAR account where the contract is deployed |
`methodName` | string | The method name on the contract as it is written in the contract code |
`args` | any | Any arguments to the contract method, wrapped in JSON |
`gas?` | BN | An amount of yoctoⓃ attached to cover the gas cost of this function call |
`amount?` | BN | Payment in yoctoⓃ that is sent to the contract during this function call |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  getAccessKeys

▸ **getAccessKeys**(): *Promise‹any›*

**Returns:** *Promise‹any›*

array of {access_key: AccessKey, public_key: PublicKey} items.

___

###  getAccountDetails

▸ **getAccountDetails**(): *Promise‹any›*

Returns account details in terms of authorized apps and transactions

**Returns:** *Promise‹any›*

___

###  sendMoney

▸ **sendMoney**(`receiverId`: string, `amount`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`receiverId` | string | NEAR account receiving Ⓝ |
`amount` | BN | Amount to send in yoctoⓃ |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  stake

▸ **stake**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `amount`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) | The public key for the account that's staking |
`amount` | BN | The account to stake in yoctoⓃ |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  state

▸ **state**(): *Promise‹[AccountState](../interfaces/_account_.accountstate.md)›*

Returns the state of a NEAR account

**Returns:** *Promise‹[AccountState](../interfaces/_account_.accountstate.md)›*

___

###  viewFunction

▸ **viewFunction**(`contractId`: string, `methodName`: string, `args`: any): *Promise‹any›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`contractId` | string | NEAR account where the contract is deployed |
`methodName` | string | The view-only method (no state mutations) name on the contract as it is written in the contract code |
`args` | any | Any arguments to the view contract method, wrapped in JSON |

**Returns:** *Promise‹any›*
