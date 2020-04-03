---
id: "_wallet_account_.connectedwalletaccount"
title: "ConnectedWalletAccount"
sidebar_label: "ConnectedWalletAccount"
---

[Account](_account_.account.md) implementation which redirects to wallet using (@link WalletConnection) when no local key is available.

## Hierarchy

* [Account](_account_.account.md)

  ↳ **ConnectedWalletAccount**

## Index

### Constructors

* [constructor](_wallet_account_.connectedwalletaccount.md#constructor)

### Properties

* [accountId](_wallet_account_.connectedwalletaccount.md#accountid)
* [connection](_wallet_account_.connectedwalletaccount.md#connection)
* [walletConnection](_wallet_account_.connectedwalletaccount.md#walletconnection)

### Methods

* [accessKeyForTransaction](_wallet_account_.connectedwalletaccount.md#accesskeyfortransaction)
* [accessKeyMatchesTransaction](_wallet_account_.connectedwalletaccount.md#accesskeymatchestransaction)
* [addKey](_wallet_account_.connectedwalletaccount.md#addkey)
* [createAccount](_wallet_account_.connectedwalletaccount.md#createaccount)
* [createAndDeployContract](_wallet_account_.connectedwalletaccount.md#createanddeploycontract)
* [deleteAccount](_wallet_account_.connectedwalletaccount.md#deleteaccount)
* [deleteKey](_wallet_account_.connectedwalletaccount.md#deletekey)
* [deployContract](_wallet_account_.connectedwalletaccount.md#deploycontract)
* [fetchState](_wallet_account_.connectedwalletaccount.md#fetchstate)
* [functionCall](_wallet_account_.connectedwalletaccount.md#functioncall)
* [getAccessKeys](_wallet_account_.connectedwalletaccount.md#getaccesskeys)
* [getAccountDetails](_wallet_account_.connectedwalletaccount.md#getaccountdetails)
* [sendMoney](_wallet_account_.connectedwalletaccount.md#sendmoney)
* [stake](_wallet_account_.connectedwalletaccount.md#stake)
* [state](_wallet_account_.connectedwalletaccount.md#state)
* [viewFunction](_wallet_account_.connectedwalletaccount.md#viewfunction)

## Constructors

###  constructor

\+ **new ConnectedWalletAccount**(`walletConnection`: [WalletConnection](_wallet_account_.walletconnection.md), `connection`: [Connection](_connection_.connection.md), `accountId`: string): *[ConnectedWalletAccount](_wallet_account_.connectedwalletaccount.md)*

*Overrides [Account](_account_.account.md).[constructor](_account_.account.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`walletConnection` | [WalletConnection](_wallet_account_.walletconnection.md) |
`connection` | [Connection](_connection_.connection.md) |
`accountId` | string |

**Returns:** *[ConnectedWalletAccount](_wallet_account_.connectedwalletaccount.md)*

## Properties

###  accountId

• **accountId**: *string*

*Inherited from [Account](_account_.account.md).[accountId](_account_.account.md#accountid)*

___

###  connection

• **connection**: *[Connection](_connection_.connection.md)*

*Inherited from [Account](_account_.account.md).[connection](_account_.account.md#connection)*

___

###  walletConnection

• **walletConnection**: *[WalletConnection](_wallet_account_.walletconnection.md)*

## Methods

###  accessKeyForTransaction

▸ **accessKeyForTransaction**(`receiverId`: string, `actions`: [Action](_transaction_.action.md)[], `localKey?`: [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹any›*

Helper function returning the access key (if it exists) to the receiver that grants the designated permission

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`receiverId` | string | The NEAR account seeking the access key for a transaction |
`actions` | [Action](_transaction_.action.md)[] | The action(s) sought to gain access to |
`localKey?` | [PublicKey](_utils_key_pair_.publickey.md) | A local public key provided to check for access |

**Returns:** *Promise‹any›*

Promise<any>

___

###  accessKeyMatchesTransaction

▸ **accessKeyMatchesTransaction**(`accessKey`: any, `receiverId`: string, `actions`: [Action](_transaction_.action.md)[]): *Promise‹boolean›*

Check if given access key allows the function call or method attempted in transaction

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`accessKey` | any | Array of {access_key: AccessKey, public_key: PublicKey} items |
`receiverId` | string | The NEAR account attempting to have access |
`actions` | [Action](_transaction_.action.md)[] | The action(s) needed to be checked for access  |

**Returns:** *Promise‹boolean›*

___

###  addKey

▸ **addKey**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `contractId?`: string, `methodName?`: string, `amount?`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[addKey](_account_.account.md#addkey)*

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

*Inherited from [Account](_account_.account.md).[createAccount](_account_.account.md#createaccount)*

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

*Inherited from [Account](_account_.account.md).[createAndDeployContract](_account_.account.md#createanddeploycontract)*

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

*Inherited from [Account](_account_.account.md).[deleteAccount](_account_.account.md#deleteaccount)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`beneficiaryId` | string | The NEAR account that will receive the remaining Ⓝ balance from the account being deleted |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

void

___

###  deleteKey

▸ **deleteKey**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[deleteKey](_account_.account.md#deletekey)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) | The public key to be deleted |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  deployContract

▸ **deployContract**(`data`: Uint8Array): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[deployContract](_account_.account.md#deploycontract)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The compiled contract code |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  fetchState

▸ **fetchState**(): *Promise‹void›*

*Inherited from [Account](_account_.account.md).[fetchState](_account_.account.md#fetchstate)*

Helper function when getting the state of a NEAR account

**Returns:** *Promise‹void›*

Promise<void>

___

###  functionCall

▸ **functionCall**(`contractId`: string, `methodName`: string, `args`: any, `gas?`: BN, `amount?`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[functionCall](_account_.account.md#functioncall)*

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

*Inherited from [Account](_account_.account.md).[getAccessKeys](_account_.account.md#getaccesskeys)*

**Returns:** *Promise‹any›*

array of {access_key: AccessKey, public_key: PublicKey} items.

___

###  getAccountDetails

▸ **getAccountDetails**(): *Promise‹any›*

*Inherited from [Account](_account_.account.md).[getAccountDetails](_account_.account.md#getaccountdetails)*

Returns account details in terms of authorized apps and transactions

**Returns:** *Promise‹any›*

___

###  sendMoney

▸ **sendMoney**(`receiverId`: string, `amount`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[sendMoney](_account_.account.md#sendmoney)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`receiverId` | string | NEAR account receiving Ⓝ |
`amount` | BN | Amount to send in yoctoⓃ |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  stake

▸ **stake**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `amount`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[stake](_account_.account.md#stake)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) | The public key for the account that's staking |
`amount` | BN | The account to stake in yoctoⓃ |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  state

▸ **state**(): *Promise‹[AccountState](../interfaces/_account_.accountstate.md)›*

*Inherited from [Account](_account_.account.md).[state](_account_.account.md#state)*

Returns the state of a NEAR account

**Returns:** *Promise‹[AccountState](../interfaces/_account_.accountstate.md)›*

___

###  viewFunction

▸ **viewFunction**(`contractId`: string, `methodName`: string, `args`: any): *Promise‹any›*

*Inherited from [Account](_account_.account.md).[viewFunction](_account_.account.md#viewfunction)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`contractId` | string | NEAR account where the contract is deployed |
`methodName` | string | The view-only method (no state mutations) name on the contract as it is written in the contract code |
`args` | any | Any arguments to the view contract method, wrapped in JSON |

**Returns:** *Promise‹any›*
