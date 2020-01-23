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
* [signAndSendTransaction](_account_.account.md#private-signandsendtransaction)
* [stake](_account_.account.md#stake)
* [state](_account_.account.md#state)
* [validateArgs](_account_.account.md#private-validateargs)
* [viewFunction](_account_.account.md#viewfunction)

## Constructors

###  constructor

\+ **new Account**(`connection`: [Connection](_connection_.connection.md), `accountId`: string): *[Account](_account_.account.md)*

*Defined in [src.ts/account.ts:47](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`connection` | [Connection](_connection_.connection.md) |
`accountId` | string |

**Returns:** *[Account](_account_.account.md)*

## Properties

### `Private` _ready

• **_ready**: *Promise‹void›*

*Defined in [src.ts/account.ts:44](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L44)*

___

### `Private` _state

• **_state**: *[AccountState](../interfaces/_account_.accountstate.md)*

*Defined in [src.ts/account.ts:42](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L42)*

___

###  accountId

• **accountId**: *string*

*Defined in [src.ts/account.ts:41](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L41)*

___

###  connection

• **connection**: *[Connection](_connection_.connection.md)*

*Defined in [src.ts/account.ts:40](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L40)*

## Accessors

### `Protected` ready

• **get ready**(): *Promise‹void›*

*Defined in [src.ts/account.ts:45](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L45)*

**Returns:** *Promise‹void›*

## Methods

###  addKey

▸ **addKey**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `contractId?`: string, `methodName?`: string, `amount?`: [BN](../modules/_utils_format_.md#const-bn)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:180](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L180)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |
`contractId?` | string |
`methodName?` | string |
`amount?` | [BN](../modules/_utils_format_.md#const-bn) |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  createAccount

▸ **createAccount**(`newAccountId`: string, `publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `amount`: [BN](../modules/_utils_format_.md#const-bn)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:160](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L160)*

**Parameters:**

Name | Type |
------ | ------ |
`newAccountId` | string |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |
`amount` | [BN](../modules/_utils_format_.md#const-bn) |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  createAndDeployContract

▸ **createAndDeployContract**(`contractId`: string, `publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `data`: Uint8Array, `amount`: [BN](../modules/_utils_format_.md#const-bn)): *Promise‹[Account](_account_.account.md)›*

*Defined in [src.ts/account.ts:149](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L149)*

**Parameters:**

Name | Type |
------ | ------ |
`contractId` | string |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |
`data` | Uint8Array |
`amount` | [BN](../modules/_utils_format_.md#const-bn) |

**Returns:** *Promise‹[Account](_account_.account.md)›*

___

###  deleteAccount

▸ **deleteAccount**(`beneficiaryId`: string): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:165](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L165)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiaryId` | string |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  deleteKey

▸ **deleteKey**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:190](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L190)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  deployContract

▸ **deployContract**(`data`: Uint8Array): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:169](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L169)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | Uint8Array |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  fetchState

▸ **fetchState**(): *Promise‹void›*

*Defined in [src.ts/account.ts:54](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L54)*

**Returns:** *Promise‹void›*

___

### `Private` findAccessKey

▸ **findAccessKey**(): *Promise‹[AccessKey](_transaction_.accesskey.md)›*

*Defined in [src.ts/account.ts:129](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L129)*

**Returns:** *Promise‹[AccessKey](_transaction_.accesskey.md)›*

___

###  functionCall

▸ **functionCall**(`contractId`: string, `methodName`: string, `args`: any, `gas`: number, `amount?`: [BN](../modules/_utils_format_.md#const-bn)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:173](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L173)*

**Parameters:**

Name | Type |
------ | ------ |
`contractId` | string |
`methodName` | string |
`args` | any |
`gas` | number |
`amount?` | [BN](../modules/_utils_format_.md#const-bn) |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  getAccessKeys

▸ **getAccessKeys**(): *Promise‹any›*

*Defined in [src.ts/account.ts:215](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L215)*

**Returns:** *Promise‹any›*

___

###  getAccountDetails

▸ **getAccountDetails**(): *Promise‹any›*

*Defined in [src.ts/account.ts:226](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L226)*

**Returns:** *Promise‹any›*

___

### `Private` printLogs

▸ **printLogs**(`contractId`: string, `logs`: string[]): *void*

*Defined in [src.ts/account.ts:63](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L63)*

**Parameters:**

Name | Type |
------ | ------ |
`contractId` | string |
`logs` | string[] |

**Returns:** *void*

___

### `Private` retryTxResult

▸ **retryTxResult**(`txHash`: Uint8Array, `accountId`: string): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:69](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L69)*

**Parameters:**

Name | Type |
------ | ------ |
`txHash` | Uint8Array |
`accountId` | string |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  sendMoney

▸ **sendMoney**(`receiverId`: string, `amount`: [BN](../modules/_utils_format_.md#const-bn)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:156](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L156)*

**Parameters:**

Name | Type |
------ | ------ |
`receiverId` | string |
`amount` | [BN](../modules/_utils_format_.md#const-bn) |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

### `Private` signAndSendTransaction

▸ **signAndSendTransaction**(`receiverId`: string, `actions`: [Action](_transaction_.action.md)[]): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:85](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`receiverId` | string |
`actions` | [Action](_transaction_.action.md)[] |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  stake

▸ **stake**(`publicKey`: string | [PublicKey](_utils_key_pair_.publickey.md), `amount`: [BN](../modules/_utils_format_.md#const-bn)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/account.ts:194](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L194)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | string &#124; [PublicKey](_utils_key_pair_.publickey.md) |
`amount` | [BN](../modules/_utils_format_.md#const-bn) |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  state

▸ **state**(): *Promise‹[AccountState](../interfaces/_account_.accountstate.md)›*

*Defined in [src.ts/account.ts:58](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L58)*

**Returns:** *Promise‹[AccountState](../interfaces/_account_.accountstate.md)›*

___

### `Private` validateArgs

▸ **validateArgs**(`args`: any): *void*

*Defined in [src.ts/account.ts:198](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L198)*

**Parameters:**

Name | Type |
------ | ------ |
`args` | any |

**Returns:** *void*

___

###  viewFunction

▸ **viewFunction**(`contractId`: string, `methodName`: string, `args`: any): *Promise‹any›*

*Defined in [src.ts/account.ts:204](https://github.com/nearprotocol/nearlib/blob/bf1ce09/src.ts/account.ts#L204)*

**Parameters:**

Name | Type |
------ | ------ |
`contractId` | string |
`methodName` | string |
`args` | any |

**Returns:** *Promise‹any›*
