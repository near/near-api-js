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
* [stake](_transaction_.md#stake)
* [transfer](_transaction_.md#transfer)

## Variables

### `Const` SCHEMA

• **SCHEMA**: *Map‹Function, any›* =  new Map<Function, any>([
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

*Defined in [src.ts/transaction.ts:126](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L126)*

## Functions

###  addKey

▸ **addKey**(`publicKey`: [PublicKey](../classes/_utils_key_pair_.publickey.md), `accessKey`: [AccessKey](../classes/_transaction_.accesskey.md)): *[Action](../classes/_transaction_.action.md)*

*Defined in [src.ts/transaction.ts:68](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | [PublicKey](../classes/_utils_key_pair_.publickey.md) |
`accessKey` | [AccessKey](../classes/_transaction_.accesskey.md) |

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  createAccount

▸ **createAccount**(): *[Action](../classes/_transaction_.action.md)*

*Defined in [src.ts/transaction.ts:48](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L48)*

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  createTransaction

▸ **createTransaction**(`signerId`: string, `publicKey`: [PublicKey](../classes/_utils_key_pair_.publickey.md), `receiverId`: string, `nonce`: number, `actions`: [Action](../classes/_transaction_.action.md)[], `blockHash`: Uint8Array): *[Transaction](../classes/_transaction_.transaction.md)*

*Defined in [src.ts/transaction.ts:200](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L200)*

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

*Defined in [src.ts/transaction.ts:76](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiaryId` | string |

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  deleteKey

▸ **deleteKey**(`publicKey`: [PublicKey](../classes/_utils_key_pair_.publickey.md)): *[Action](../classes/_transaction_.action.md)*

*Defined in [src.ts/transaction.ts:72](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | [PublicKey](../classes/_utils_key_pair_.publickey.md) |

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  deployContract

▸ **deployContract**(`code`: Uint8Array): *[Action](../classes/_transaction_.action.md)*

*Defined in [src.ts/transaction.ts:52](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`code` | Uint8Array |

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  fullAccessKey

▸ **fullAccessKey**(): *[AccessKey](../classes/_transaction_.accesskey.md)*

*Defined in [src.ts/transaction.ts:29](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L29)*

**Returns:** *[AccessKey](../classes/_transaction_.accesskey.md)*

___

###  functionCall

▸ **functionCall**(`methodName`: string, `args`: Uint8Array, `gas`: number, `deposit`: BN): *[Action](../classes/_transaction_.action.md)*

*Defined in [src.ts/transaction.ts:56](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`methodName` | string |
`args` | Uint8Array |
`gas` | number |
`deposit` | BN |

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  functionCallAccessKey

▸ **functionCallAccessKey**(`receiverId`: string, `methodNames`: String[], `allowance?`: BN): *[AccessKey](../classes/_transaction_.accesskey.md)*

*Defined in [src.ts/transaction.ts:33](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`receiverId` | string |
`methodNames` | String[] |
`allowance?` | BN |

**Returns:** *[AccessKey](../classes/_transaction_.accesskey.md)*

___

###  signTransaction

▸ **signTransaction**(`receiverId`: string, `nonce`: number, `actions`: [Action](../classes/_transaction_.action.md)[], `blockHash`: Uint8Array, `signer`: [Signer](../classes/_signer_.signer.md), `accountId?`: string, `networkId?`: string): *Promise‹[Uint8Array, [SignedTransaction](../classes/_transaction_.signedtransaction.md)]›*

*Defined in [src.ts/transaction.ts:204](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L204)*

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

###  stake

▸ **stake**(`stake`: BN, `publicKey`: [PublicKey](../classes/_utils_key_pair_.publickey.md)): *[Action](../classes/_transaction_.action.md)*

*Defined in [src.ts/transaction.ts:64](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L64)*

**Parameters:**

Name | Type |
------ | ------ |
`stake` | BN |
`publicKey` | [PublicKey](../classes/_utils_key_pair_.publickey.md) |

**Returns:** *[Action](../classes/_transaction_.action.md)*

___

###  transfer

▸ **transfer**(`deposit`: BN): *[Action](../classes/_transaction_.action.md)*

*Defined in [src.ts/transaction.ts:60](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L60)*

**Parameters:**

Name | Type |
------ | ------ |
`deposit` | BN |

**Returns:** *[Action](../classes/_transaction_.action.md)*
