---
id: "_account_.account"
title: "Account"
sidebar_label: "Account"
---

## Hierarchy

* **Account**

  ↳ [ConnectedWalletAccount](_wallet_account_.connectedwalletaccount.md)

## Index

### Constructors

* [constructor](_account_.account.md#constructor)

### Properties

* [_ready](_account_.account.md#private-_ready)
* [_state](_account_.account.md#private-_state)
* [accountId](_account_.account.md#accountid)
* [connection](_account_.account.md#connection)

### Accessors

* [ready](_account_.account.md#protected-ready)

### Methods

* [addKey](_account_.account.md#addkey)
* [createAccount](_account_.account.md#createaccount)
* [createAndDeployContract](_account_.account.md#createanddeploycontract)
* [deleteAccount](_account_.account.md#deleteaccount)
* [deleteKey](_account_.account.md#deletekey)
* [deployContract](_account_.account.md#deploycontract)
* [fetchState](_account_.account.md#fetchstate)
* [findAccessKey](_account_.account.md#private-findaccesskey)
* [functionCall](_account_.account.md#functioncall)
* [getAccessKeys](_account_.account.md#getaccesskeys)
* [getAccountDetails](_account_.account.md#getaccountdetails)
* [printLogs](_account_.account.md#private-printlogs)
* [retryTxResult](_account_.account.md#private-retrytxresult)
* [sendMoney](_account_.account.md#sendmoney)
* [signAndSendTransaction](_account_.account.md#protected-signandsendtransaction)
* [stake](_account_.account.md#stake)
* [state](_account_.account.md#state)
* [validateArgs](_account_.account.md#private-validateargs)
* [viewFunction](_account_.account.md#viewfunction)

## Constructors

###  constructor

\+ **new Account**(`connection`: [Connection](_connection_.connection.md), `accountId`: string): *[Account](_account_.account.md)*

*Defined in [src.ts/account.ts:49](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`connection` | [Connection](_connection_.connection.md) |
`accountId` | string |

**Returns:** *[Account](_account_.account.md)*

## Properties

### `Private` _ready

• **_ready**: *Promise‹void›*

*Defined in [src.ts/account.ts:46](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L46)*

___

### `Private` _state

• **_state**: *[AccountState](../interfaces/_account_.accountstate.md)*

*Defined in [src.ts/account.ts:44](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L44)*

___

###  accountId

• **accountId**: *string*

*Defined in [src.ts/account.ts:43](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L43)*

___

###  connection

• **connection**: *[Connection](_connection_.connection.md)*

*Defined in [src.ts/account.ts:42](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L42)*

## Accessors

### `Protected` ready

• **get ready**(): *Promise‹void›*

*Defined in [src.ts/account.ts:47](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L47)*

**Returns:** *Promise‹void›*

## Methods

###  addKey

▸ **addKey**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `contractId?`: string, `methodName?`: string, `amount?`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

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

*Defined in [src.ts/account.ts:167](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L167)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiaryId` | string |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  deleteKey

▸ **deleteKey**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:192](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L192)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  deployContract

▸ **deployContract**(`data`: Uint8Array): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:171](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L171)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | Uint8Array |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  fetchState

▸ **fetchState**(): *Promise‹void›*

*Defined in [src.ts/account.ts:56](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L56)*

**Returns:** *Promise‹void›*

___

### `Private` findAccessKey

▸ **findAccessKey**(): *Promise‹[AccessKey](_transaction_.accesskey.md)›*

*Defined in [src.ts/account.ts:131](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L131)*

**Returns:** *Promise‹[AccessKey](_transaction_.accesskey.md)›*

___

###  functionCall

▸ **functionCall**(`contractId`: string, `methodName`: string, `args`: any, `gas?`: BN, `amount?`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

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

*Defined in [src.ts/account.ts:217](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L217)*

**Returns:** *Promise‹any›*

___

###  getAccountDetails

▸ **getAccountDetails**(): *Promise‹any›*

*Defined in [src.ts/account.ts:228](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L228)*

**Returns:** *Promise‹any›*

___

### `Private` printLogs

▸ **printLogs**(`contractId`: string, `logs`: string[]): *void*

*Defined in [src.ts/account.ts:65](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`contractId` | string |
`logs` | string[] |

**Returns:** *void*

___

### `Private` retryTxResult

▸ **retryTxResult**(`txHash`: Uint8Array, `accountId`: string): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:71](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L71)*

**Parameters:**

Name | Type |
------ | ------ |
`txHash` | Uint8Array |
`accountId` | string |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  sendMoney

▸ **sendMoney**(`receiverId`: string, `amount`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

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

*Defined in [src.ts/account.ts:87](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L87)*

**Parameters:**

Name | Type |
------ | ------ |
`receiverId` | string |
`actions` | [Action](_transaction_.action.md)[] |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  stake

▸ **stake**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `amount`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

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

*Defined in [src.ts/account.ts:60](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L60)*

**Returns:** *Promise‹[AccountState](../interfaces/_account_.accountstate.md)›*

___

### `Private` validateArgs

▸ **validateArgs**(`args`: any): *void*

*Defined in [src.ts/account.ts:200](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L200)*

**Parameters:**

Name | Type |
------ | ------ |
`args` | any |

**Returns:** *void*

___

###  viewFunction

▸ **viewFunction**(`contractId`: string, `methodName`: string, `args`: any): *Promise‹any›*

*Defined in [src.ts/account.ts:206](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/account.ts#L206)*

**Parameters:**

Name | Type |
------ | ------ |
`contractId` | string |
`methodName` | string |
`args` | any |

**Returns:** *Promise‹any›*
