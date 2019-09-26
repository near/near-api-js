---
id: "_transaction_.transaction"
title: "Transaction"
sidebar_label: "Transaction"
---

## Hierarchy

* [Assignable](_transaction_.assignable.md)

  ↳ **Transaction**

## Index

### Constructors

* [constructor](_transaction_.transaction.md#constructor)

### Properties

* [actions](_transaction_.transaction.md#actions)
* [blockHash](_transaction_.transaction.md#blockhash)
* [nonce](_transaction_.transaction.md#nonce)
* [publicKey](_transaction_.transaction.md#publickey)
* [receiverId](_transaction_.transaction.md#receiverid)
* [signerId](_transaction_.transaction.md#signerid)

## Constructors

###  constructor

\+ **new Transaction**(`properties`: any): *[Transaction](_transaction_.transaction.md)*

*Inherited from [Assignable](_transaction_.assignable.md).[constructor](_transaction_.assignable.md#constructor)*

*Defined in [transaction.ts:24](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/transaction.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`properties` | any |

**Returns:** *[Transaction](_transaction_.transaction.md)*

## Properties

###  actions

• **actions**: *[Action](_transaction_.action.md)[]*

*Defined in [transaction.ts:116](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/transaction.ts#L116)*

___

###  blockHash

• **blockHash**: *Uint8Array*

*Defined in [transaction.ts:117](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/transaction.ts#L117)*

___

###  nonce

• **nonce**: *number*

*Defined in [transaction.ts:114](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/transaction.ts#L114)*

___

###  publicKey

• **publicKey**: *[PublicKey](_utils_key_pair_.publickey.md)*

*Defined in [transaction.ts:113](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/transaction.ts#L113)*

___

###  receiverId

• **receiverId**: *string*

*Defined in [transaction.ts:115](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/transaction.ts#L115)*

___

###  signerId

• **signerId**: *string*

*Defined in [transaction.ts:112](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/transaction.ts#L112)*
