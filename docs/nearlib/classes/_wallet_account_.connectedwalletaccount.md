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

### Accessors

* [ready](_wallet_account_.connectedwalletaccount.md#protected-ready)

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
* [signAndSendTransaction](_wallet_account_.connectedwalletaccount.md#protected-signandsendtransaction)
* [stake](_wallet_account_.connectedwalletaccount.md#stake)
* [state](_wallet_account_.connectedwalletaccount.md#state)
* [viewFunction](_wallet_account_.connectedwalletaccount.md#viewfunction)

## Constructors

###  constructor

\+ **new ConnectedWalletAccount**(`walletConnection`: [WalletConnection](_wallet_account_.walletconnection.md), `connection`: [Connection](_connection_.connection.md), `accountId`: string): *[ConnectedWalletAccount](_wallet_account_.connectedwalletaccount.md)*

*Overrides [Account](_account_.account.md).[constructor](_account_.account.md#constructor)*

*Defined in [src.ts/wallet-account.ts:158](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L158)*

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

*Defined in [src.ts/account.ts:43](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L43)*

___

###  connection

• **connection**: *[Connection](_connection_.connection.md)*

*Inherited from [Account](_account_.account.md).[connection](_account_.account.md#connection)*

*Defined in [src.ts/account.ts:42](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L42)*

___

###  walletConnection

• **walletConnection**: *[WalletConnection](_wallet_account_.walletconnection.md)*

*Defined in [src.ts/wallet-account.ts:158](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L158)*

## Accessors

### `Protected` ready

• **get ready**(): *Promise‹void›*

*Inherited from [Account](_account_.account.md).[ready](_account_.account.md#protected-ready)*

*Defined in [src.ts/account.ts:47](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L47)*

**Returns:** *Promise‹void›*

## Methods

###  accessKeyForTransaction

▸ **accessKeyForTransaction**(`receiverId`: string, `actions`: [Action](_transaction_.action.md)[], `localKey?`: [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹any›*

*Defined in [src.ts/wallet-account.ts:228](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L228)*

**Parameters:**

Name | Type |
------ | ------ |
`receiverId` | string |
`actions` | [Action](_transaction_.action.md)[] |
`localKey?` | [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** *Promise‹any›*

___

###  accessKeyMatchesTransaction

▸ **accessKeyMatchesTransaction**(`accessKey`: any, `receiverId`: string, `actions`: [Action](_transaction_.action.md)[]): *Promise‹boolean›*

*Defined in [src.ts/wallet-account.ts:207](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L207)*

**Parameters:**

Name | Type |
------ | ------ |
`accessKey` | any |
`receiverId` | string |
`actions` | [Action](_transaction_.action.md)[] |

**Returns:** *Promise‹boolean›*

___

###  addKey

▸ **addKey**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `contractId?`: string, `methodName?`: string, `amount?`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[addKey](_account_.account.md#addkey)*

*Defined in [src.ts/account.ts:182](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L182)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |
`contractId?` | string |
`methodName?` | string |
`amount?` | BN |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  createAccount

▸ **createAccount**(`newAccountId`: string, `publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `amount`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[createAccount](_account_.account.md#createaccount)*

*Defined in [src.ts/account.ts:162](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L162)*

**Parameters:**

Name | Type |
------ | ------ |
`newAccountId` | string |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |
`amount` | BN |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  createAndDeployContract

▸ **createAndDeployContract**(`contractId`: string, `publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `data`: Uint8Array, `amount`: BN): *Promise‹[Account](_account_.account.md)›*

*Inherited from [Account](_account_.account.md).[createAndDeployContract](_account_.account.md#createanddeploycontract)*

*Defined in [src.ts/account.ts:151](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L151)*

**Parameters:**

Name | Type |
------ | ------ |
`contractId` | string |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |
`data` | Uint8Array |
`amount` | BN |

**Returns:** *Promise‹[Account](_account_.account.md)›*

___

###  deleteAccount

▸ **deleteAccount**(`beneficiaryId`: string): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[deleteAccount](_account_.account.md#deleteaccount)*

*Defined in [src.ts/account.ts:167](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L167)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiaryId` | string |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  deleteKey

▸ **deleteKey**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[deleteKey](_account_.account.md#deletekey)*

*Defined in [src.ts/account.ts:192](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L192)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  deployContract

▸ **deployContract**(`data`: Uint8Array): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[deployContract](_account_.account.md#deploycontract)*

*Defined in [src.ts/account.ts:171](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L171)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | Uint8Array |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  fetchState

▸ **fetchState**(): *Promise‹void›*

*Inherited from [Account](_account_.account.md).[fetchState](_account_.account.md#fetchstate)*

*Defined in [src.ts/account.ts:56](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L56)*

**Returns:** *Promise‹void›*

___

###  functionCall

▸ **functionCall**(`contractId`: string, `methodName`: string, `args`: any, `gas?`: BN, `amount?`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[functionCall](_account_.account.md#functioncall)*

*Defined in [src.ts/account.ts:175](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L175)*

**Parameters:**

Name | Type |
------ | ------ |
`contractId` | string |
`methodName` | string |
`args` | any |
`gas?` | BN |
`amount?` | BN |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  getAccessKeys

▸ **getAccessKeys**(): *Promise‹any›*

*Inherited from [Account](_account_.account.md).[getAccessKeys](_account_.account.md#getaccesskeys)*

*Defined in [src.ts/account.ts:217](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L217)*

**Returns:** *Promise‹any›*

___

###  getAccountDetails

▸ **getAccountDetails**(): *Promise‹any›*

*Inherited from [Account](_account_.account.md).[getAccountDetails](_account_.account.md#getaccountdetails)*

*Defined in [src.ts/account.ts:228](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L228)*

**Returns:** *Promise‹any›*

___

###  sendMoney

▸ **sendMoney**(`receiverId`: string, `amount`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[sendMoney](_account_.account.md#sendmoney)*

*Defined in [src.ts/account.ts:158](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L158)*

**Parameters:**

Name | Type |
------ | ------ |
`receiverId` | string |
`amount` | BN |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

### `Protected` signAndSendTransaction

▸ **signAndSendTransaction**(`receiverId`: string, `actions`: [Action](_transaction_.action.md)[]): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Overrides [Account](_account_.account.md).[signAndSendTransaction](_account_.account.md#protected-signandsendtransaction)*

*Defined in [src.ts/wallet-account.ts:167](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L167)*

**Parameters:**

Name | Type |
------ | ------ |
`receiverId` | string |
`actions` | [Action](_transaction_.action.md)[] |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  stake

▸ **stake**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `amount`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Inherited from [Account](_account_.account.md).[stake](_account_.account.md#stake)*

*Defined in [src.ts/account.ts:196](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L196)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |
`amount` | BN |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  state

▸ **state**(): *Promise‹[AccountState](../interfaces/_account_.accountstate.md)›*

*Inherited from [Account](_account_.account.md).[state](_account_.account.md#state)*

*Defined in [src.ts/account.ts:60](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L60)*

**Returns:** *Promise‹[AccountState](../interfaces/_account_.accountstate.md)›*

___

###  viewFunction

▸ **viewFunction**(`contractId`: string, `methodName`: string, `args`: any): *Promise‹any›*

*Inherited from [Account](_account_.account.md).[viewFunction](_account_.account.md#viewfunction)*

*Defined in [src.ts/account.ts:206](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L206)*

**Parameters:**

Name | Type |
------ | ------ |
`contractId` | string |
`methodName` | string |
`args` | any |

**Returns:** *Promise‹any›*
