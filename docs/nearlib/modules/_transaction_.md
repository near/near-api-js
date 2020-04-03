---
id: "_transaction_"
title: "transaction"
sidebar_label: "transaction"
---

## Index

### Classes

* [AccessKey](../classes/_transaction_.accesskey.md)
* [AccessKeyPermission](../classes/_transaction_.accesskeypermission.md)
* [Action](../classes/_transaction_.action.md)
* [AddKey](../classes/_transaction_.addkey.md)
* [CreateAccount](../classes/_transaction_.createaccount.md)
* [DeleteAccount](../classes/_transaction_.deleteaccount.md)
* [DeleteKey](../classes/_transaction_.deletekey.md)
* [DeployContract](../classes/_transaction_.deploycontract.md)
* [FullAccessPermission](../classes/_transaction_.fullaccesspermission.md)
* [FunctionCall](../classes/_transaction_.functioncall.md)
* [FunctionCallPermission](../classes/_transaction_.functioncallpermission.md)
* [IAction](../classes/_transaction_.iaction.md)
* [Signature](../classes/_transaction_.signature.md)
* [SignedTransaction](../classes/_transaction_.signedtransaction.md)
* [Stake](../classes/_transaction_.stake.md)
* [Transaction](../classes/_transaction_.transaction.md)
* [Transfer](../classes/_transaction_.transfer.md)

### Variables

* [SCHEMA](_transaction_.md#const-schema)

### Functions

* [addKey](_transaction_.md#addkey)
* [createAccount](_transaction_.md#createaccount)
* [createTransaction](_transaction_.md#createtransaction)
* [deleteAccount](_transaction_.md#deleteaccount)
* [deleteKey](_transaction_.md#deletekey)
* [deployContract](_transaction_.md#deploycontract)
* [fullAccessKey](_transaction_.md#fullaccesskey)
* [functionCall](_transaction_.md#functioncall)
* [functionCallAccessKey](_transaction_.md#functioncallaccesskey)
* [signTransaction](_transaction_.md#signtransaction)
* [signTransactionObject](_transaction_.md#signtransactionobject)
* [stake](_transaction_.md#stake)
* [transfer](_transaction_.md#transfer)

## Variables

### `Const` SCHEMA

• **SCHEMA**: *Map‹Function, any›* = new Map<Function, any>([
    [Signature, {kind: 'struct', fields: [
        ['keyType', 'u8'],
        ['data', [64]]
    ]}],
    [SignedTransaction, {kind: 'struct', fields: [
        ['transaction', Transaction],
        ['signature', Signature]
    ]}],
    [Transaction, { kind: 'struct', fields: [
        ['signerId', 'string'],
        ['publicKey', PublicKey],
        ['nonce', 'u64'],
        ['receiverId', 'string'],
        ['blockHash', [32]],
        ['actions', [Action]]
    ]}],
    [PublicKey, { kind: 'struct', fields: [
        ['keyType', 'u8'],
        ['data', [32]]
    ]}],
    [AccessKey, { kind: 'struct', fields: [
        ['nonce', 'u64'],
        ['permission', AccessKeyPermission],
    ]}],
    [AccessKeyPermission, {kind: 'enum', field: 'enum', values: [
        ['functionCall', FunctionCallPermission],
        ['fullAccess', FullAccessPermission],
    ]}],
    [FunctionCallPermission, {kind: 'struct', fields: [
        ['allowance', {kind: 'option', type: 'u128'}],
        ['receiverId', 'string'],
        ['methodNames', ['string']],
    ]}],
    [FullAccessPermission, {kind: 'struct', fields: []}],
    [Action, {kind: 'enum', field: 'enum', values: [
        ['createAccount', CreateAccount],
        ['deployContract', DeployContract],
        ['functionCall', FunctionCall],
        ['transfer', Transfer],
        ['stake', Stake],
        ['addKey', AddKey],
        ['deleteKey', DeleteKey],
        ['deleteAccount', DeleteAccount],
    ]}],
    [CreateAccount, { kind: 'struct', fields: [] }],
    [DeployContract, { kind: 'struct', fields: [
        ['code', ['u8']]
    ]}],
    [FunctionCall, { kind: 'struct', fields: [
        ['methodName', 'string'],
        ['args', ['u8']],
        ['gas', 'u64'],
        ['deposit', 'u128']
    ]}],
    [Transfer, { kind: 'struct', fields: [
        ['deposit', 'u128']
    ]}],
    [Stake, { kind: 'struct', fields: [
        ['stake', 'u128'],
        ['publicKey', PublicKey]
    ]}],
    [AddKey, { kind: 'struct', fields: [
        ['publicKey', PublicKey],
        ['accessKey', AccessKey]
    ]}],
    [DeleteKey, { kind: 'struct', fields: [
        ['publicKey', PublicKey]
    ]}],
    [DeleteAccount, { kind: 'struct', fields: [
        ['beneficiaryId', 'string']
    ]}],
])

## Functions

###  addKey

▸ **addKey**(`publicKey`: [PublicKey](../classes/_utils_key_pair_.publickey.md), `accessKey`: [AccessKey](../classes/_transaction_.accesskey.md)): *[Action](../classes/_transaction_.action.md)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | [PublicKey](../classes/_utils_key_pair_.publickey.md) |
`accessKey` | [AccessKey](../classes/_transaction_.accesskey.md) |

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  createAccount

▸ **createAccount**(): *[Action](../classes/_transaction_.action.md)*

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  createTransaction

▸ **createTransaction**(`signerId`: string, `publicKey`: [PublicKey](../classes/_utils_key_pair_.publickey.md), `receiverId`: string, `nonce`: number, `actions`: [Action](../classes/_transaction_.action.md)[], `blockHash`: Uint8Array): *[Transaction](../classes/_transaction_.transaction.md)*

**Parameters:**

Name | Type |
------ | ------ |
`signerId` | string |
`publicKey` | [PublicKey](../classes/_utils_key_pair_.publickey.md) |
`receiverId` | string |
`nonce` | number |
`actions` | [Action](../classes/_transaction_.action.md)[] |
`blockHash` | Uint8Array |

**Returns:** *[Transaction](../classes/_transaction_.transaction.md)*

___

###  deleteAccount

▸ **deleteAccount**(`beneficiaryId`: string): *[Action](../classes/_transaction_.action.md)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiaryId` | string |

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  deleteKey

▸ **deleteKey**(`publicKey`: [PublicKey](../classes/_utils_key_pair_.publickey.md)): *[Action](../classes/_transaction_.action.md)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | [PublicKey](../classes/_utils_key_pair_.publickey.md) |

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  deployContract

▸ **deployContract**(`code`: Uint8Array): *[Action](../classes/_transaction_.action.md)*

**Parameters:**

Name | Type |
------ | ------ |
`code` | Uint8Array |

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  fullAccessKey

▸ **fullAccessKey**(): *[AccessKey](../classes/_transaction_.accesskey.md)*

**Returns:** *[AccessKey](../classes/_transaction_.accesskey.md)*

___

###  functionCall

▸ **functionCall**(`methodName`: string, `args`: Uint8Array, `gas`: BN, `deposit`: BN): *[Action](../classes/_transaction_.action.md)*

**Parameters:**

Name | Type |
------ | ------ |
`methodName` | string |
`args` | Uint8Array |
`gas` | BN |
`deposit` | BN |

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  functionCallAccessKey

▸ **functionCallAccessKey**(`receiverId`: string, `methodNames`: String[], `allowance?`: BN): *[AccessKey](../classes/_transaction_.accesskey.md)*

**Parameters:**

Name | Type |
------ | ------ |
`receiverId` | string |
`methodNames` | String[] |
`allowance?` | BN |

**Returns:** *[AccessKey](../classes/_transaction_.accesskey.md)*

___

###  signTransaction

▸ **signTransaction**(`transaction`: [Transaction](../classes/_transaction_.transaction.md), `signer`: [Signer](../classes/_signer_.signer.md), `accountId?`: string, `networkId?`: string): *Promise‹[Uint8Array, [SignedTransaction](../classes/_transaction_.signedtransaction.md)]›*

**Parameters:**

Name | Type |
------ | ------ |
`transaction` | [Transaction](../classes/_transaction_.transaction.md) |
`signer` | [Signer](../classes/_signer_.signer.md) |
`accountId?` | string |
`networkId?` | string |

**Returns:** *Promise‹[Uint8Array, [SignedTransaction](../classes/_transaction_.signedtransaction.md)]›*

▸ **signTransaction**(`receiverId`: string, `nonce`: number, `actions`: [Action](../classes/_transaction_.action.md)[], `blockHash`: Uint8Array, `signer`: [Signer](../classes/_signer_.signer.md), `accountId?`: string, `networkId?`: string): *Promise‹[Uint8Array, [SignedTransaction](../classes/_transaction_.signedtransaction.md)]›*

**Parameters:**

Name | Type |
------ | ------ |
`receiverId` | string |
`nonce` | number |
`actions` | [Action](../classes/_transaction_.action.md)[] |
`blockHash` | Uint8Array |
`signer` | [Signer](../classes/_signer_.signer.md) |
`accountId?` | string |
`networkId?` | string |

**Returns:** *Promise‹[Uint8Array, [SignedTransaction](../classes/_transaction_.signedtransaction.md)]›*

___

###  signTransactionObject

▸ **signTransactionObject**(`transaction`: [Transaction](../classes/_transaction_.transaction.md), `signer`: [Signer](../classes/_signer_.signer.md), `accountId?`: string, `networkId?`: string): *Promise‹[Uint8Array, [SignedTransaction](../classes/_transaction_.signedtransaction.md)]›*

Signs a given transaction from an account with given keys, applied to the given network

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`transaction` | [Transaction](../classes/_transaction_.transaction.md) | The Transaction object to sign |
`signer` | [Signer](../classes/_signer_.signer.md) | The {Signer} object that assists with signing keys |
`accountId?` | string | The human-readable NEAR account name |
`networkId?` | string | The targeted network. (ex. default, devnet, betanet, etc…)  |

**Returns:** *Promise‹[Uint8Array, [SignedTransaction](../classes/_transaction_.signedtransaction.md)]›*

___

###  stake

▸ **stake**(`stake`: BN, `publicKey`: [PublicKey](../classes/_utils_key_pair_.publickey.md)): *[Action](../classes/_transaction_.action.md)*

**Parameters:**

Name | Type |
------ | ------ |
`stake` | BN |
`publicKey` | [PublicKey](../classes/_utils_key_pair_.publickey.md) |

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  transfer

▸ **transfer**(`deposit`: BN): *[Action](../classes/_transaction_.action.md)*

**Parameters:**

Name | Type |
------ | ------ |
`deposit` | BN |

**Returns:** *[Action](../classes/_transaction_.action.md)*
