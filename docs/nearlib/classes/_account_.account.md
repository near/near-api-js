---
id: "_account_.account"
title: "Account"
sidebar_label: "Account"
---

## Hierarchy

* **Account**

## Index

### Constructors

* [constructor](_account_.account.md#constructor)

### Properties

* [_accessKey](_account_.account.md#private-_accesskey)
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
* [functionCall](_account_.account.md#functioncall)
* [getAccessKeys](_account_.account.md#getaccesskeys)
* [getAccountDetails](_account_.account.md#getaccountdetails)
* [printLogs](_account_.account.md#private-printlogs)
* [retryTxResult](_account_.account.md#private-retrytxresult)
* [sendMoney](_account_.account.md#sendmoney)
* [signAndSendTransaction](_account_.account.md#private-signandsendtransaction)
* [stake](_account_.account.md#stake)
* [state](_account_.account.md#state)
* [viewFunction](_account_.account.md#viewfunction)

## Constructors

###  constructor

\+ **new Account**(`connection`: [Connection](_connection_.connection.md), `accountId`: string): *[Account](_account_.account.md)*

*Defined in [src.ts/account.ts:46](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`connection` | [Connection](_connection_.connection.md) |
`accountId` | string |

**Returns:** *[Account](_account_.account.md)*

## Properties

### `Private` _accessKey

• **_accessKey**: *[AccessKey](_transaction_.accesskey.md)*

*Defined in [src.ts/account.ts:41](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L41)*

___

### `Private` _ready

• **_ready**: *Promise‹void›*

*Defined in [src.ts/account.ts:43](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L43)*

___

### `Private` _state

• **_state**: *[AccountState](../interfaces/_account_.accountstate.md)*

*Defined in [src.ts/account.ts:40](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L40)*

___

###  accountId

• **accountId**: *string*

*Defined in [src.ts/account.ts:39](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L39)*

___

###  connection

• **connection**: *[Connection](_connection_.connection.md)*

*Defined in [src.ts/account.ts:38](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L38)*

## Accessors

### `Protected` ready

• **get ready**(): *Promise‹void›*

*Defined in [src.ts/account.ts:44](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L44)*

**Returns:** *Promise‹void›*

## Methods

###  addKey

▸ **addKey**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `contractId?`: string, `methodName?`: string, `amount?`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:161](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L161)*

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

*Defined in [src.ts/account.ts:140](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L140)*

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

*Defined in [src.ts/account.ts:129](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L129)*

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

*Defined in [src.ts/account.ts:145](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiaryId` | string |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  deleteKey

▸ **deleteKey**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:171](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L171)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  deployContract

▸ **deployContract**(`data`: Uint8Array): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:149](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L149)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | Uint8Array |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  fetchState

▸ **fetchState**(): *Promise‹void›*

*Defined in [src.ts/account.ts:53](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L53)*

**Returns:** *Promise‹void›*

___

###  functionCall

▸ **functionCall**(`contractId`: string, `methodName`: string, `args`: any, `gas`: number, `amount?`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:153](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L153)*

**Parameters:**

Name | Type |
------ | ------ |
`contractId` | string |
`methodName` | string |
`args` | any |
`gas` | number |
`amount?` | BN |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  getAccessKeys

▸ **getAccessKeys**(): *Promise‹any›*

*Defined in [src.ts/account.ts:188](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L188)*

**Returns:** *Promise‹any›*

___

###  getAccountDetails

▸ **getAccountDetails**(): *Promise‹any›*

*Defined in [src.ts/account.ts:193](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L193)*

**Returns:** *Promise‹any›*

___

### `Private` printLogs

▸ **printLogs**(`contractId`: string, `logs`: string[]): *void*

*Defined in [src.ts/account.ts:71](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L71)*

**Parameters:**

Name | Type |
------ | ------ |
`contractId` | string |
`logs` | string[] |

**Returns:** *void*

___

### `Private` retryTxResult

▸ **retryTxResult**(`txHash`: Uint8Array, `accountId`: string): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:77](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`txHash` | Uint8Array |
`accountId` | string |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  sendMoney

▸ **sendMoney**(`receiverId`: string, `amount`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:136](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L136)*

**Parameters:**

Name | Type |
------ | ------ |
`receiverId` | string |
`amount` | BN |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

### `Private` signAndSendTransaction

▸ **signAndSendTransaction**(`receiverId`: string, `actions`: [Action](_transaction_.action.md)[]): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:93](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L93)*

**Parameters:**

Name | Type |
------ | ------ |
`receiverId` | string |
`actions` | [Action](_transaction_.action.md)[] |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  stake

▸ **stake**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `amount`: BN): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:175](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L175)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |
`amount` | BN |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  state

▸ **state**(): *Promise‹[AccountState](../interfaces/_account_.accountstate.md)›*

*Defined in [src.ts/account.ts:66](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L66)*

**Returns:** *Promise‹[AccountState](../interfaces/_account_.accountstate.md)›*

___

###  viewFunction

▸ **viewFunction**(`contractId`: string, `methodName`: string, `args`: any): *Promise‹any›*

*Defined in [src.ts/account.ts:179](https://github.com/nearprotocol/nearlib/blob/2987fdb/src.ts/account.ts#L179)*

**Parameters:**

Name | Type |
------ | ------ |
`contractId` | string |
`methodName` | string |
`args` | any |

**Returns:** *Promise‹any›*
