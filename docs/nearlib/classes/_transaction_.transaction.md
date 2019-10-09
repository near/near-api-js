---
id: "_transaction_.transaction"
title: "Transaction"
sidebar_label: "Transaction"
---

## Hierarchy

* [Assignable](_utils_enums_.assignable.md)

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

*Inherited from [Assignable](_utils_enums_.assignable.md).[constructor](_utils_enums_.assignable.md#constructor)*

*Defined in [utils/enums.ts:17](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/enums.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`properties` | any |

**Returns:** *[Transaction](_transaction_.transaction.md)*

## Properties

###  actions

• **actions**: *[Action](_transaction_.action.md)[]*

*Defined in [transaction.ts:95](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/transaction.ts#L95)*

___

###  blockHash

• **blockHash**: *Uint8Array*

*Defined in [transaction.ts:96](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/transaction.ts#L96)*

___

###  nonce

• **nonce**: *number*

*Defined in [transaction.ts:93](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/transaction.ts#L93)*

___

###  publicKey

• **publicKey**: *[PublicKey](_utils_key_pair_.publickey.md)*

*Defined in [transaction.ts:92](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/transaction.ts#L92)*

___

###  receiverId

• **receiverId**: *string*

*Defined in [transaction.ts:94](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/transaction.ts#L94)*

___

###  signerId

• **signerId**: *string*

*Defined in [transaction.ts:91](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/transaction.ts#L91)*
