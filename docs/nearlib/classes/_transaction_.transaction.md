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

### Methods

* [encode](_transaction_.transaction.md#encode)
* [decode](_transaction_.transaction.md#static-decode)

## Constructors

###  constructor

\+ **new Transaction**(`properties`: any): *[Transaction](_transaction_.transaction.md)*

*Inherited from [Assignable](_utils_enums_.assignable.md).[constructor](_utils_enums_.assignable.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`properties` | any |

**Returns:** *[Transaction](_transaction_.transaction.md)*

## Properties

###  actions

• **actions**: *[Action](_transaction_.action.md)[]*

___

###  blockHash

• **blockHash**: *Uint8Array*

___

###  nonce

• **nonce**: *number*

___

###  publicKey

• **publicKey**: *[PublicKey](_utils_key_pair_.publickey.md)*

___

###  receiverId

• **receiverId**: *string*

___

###  signerId

• **signerId**: *string*

## Methods

###  encode

▸ **encode**(): *Uint8Array*

**Returns:** *Uint8Array*

___

### `Static` decode

▸ **decode**(`bytes`: Buffer): *[Transaction](_transaction_.transaction.md)*

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Buffer |

**Returns:** *[Transaction](_transaction_.transaction.md)*
