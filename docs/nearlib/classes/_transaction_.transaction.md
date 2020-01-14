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

*Defined in [src.ts/utils/enums.ts:17](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/enums.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`properties` | any |

**Returns:** *[Transaction](_transaction_.transaction.md)*

## Properties

###  actions

• **actions**: *[Action](_transaction_.action.md)[]*

*Defined in [src.ts/transaction.ts:90](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L90)*

___

###  blockHash

• **blockHash**: *Uint8Array*

*Defined in [src.ts/transaction.ts:91](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L91)*

___

###  nonce

• **nonce**: *number*

*Defined in [src.ts/transaction.ts:88](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L88)*

___

###  publicKey

• **publicKey**: *[PublicKey](_utils_key_pair_.publickey.md)*

*Defined in [src.ts/transaction.ts:87](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L87)*

___

###  receiverId

• **receiverId**: *string*

*Defined in [src.ts/transaction.ts:89](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L89)*

___

###  signerId

• **signerId**: *string*

*Defined in [src.ts/transaction.ts:86](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L86)*

## Methods

###  encode

▸ **encode**(): *Uint8Array*

*Defined in [src.ts/transaction.ts:93](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L93)*

**Returns:** *Uint8Array*

___

### `Static` decode

▸ **decode**(`bytes`: Buffer): *[Transaction](_transaction_.transaction.md)*

*Defined in [src.ts/transaction.ts:97](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L97)*

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Buffer |

**Returns:** *[Transaction](_transaction_.transaction.md)*
