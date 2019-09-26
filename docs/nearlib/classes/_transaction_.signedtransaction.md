---
id: "_transaction_.signedtransaction"
title: "SignedTransaction"
sidebar_label: "SignedTransaction"
---

## Hierarchy

* [Assignable](_transaction_.assignable.md)

  ↳ **SignedTransaction**

## Index

### Constructors

* [constructor](_transaction_.signedtransaction.md#constructor)

### Properties

* [signature](_transaction_.signedtransaction.md#signature)
* [transaction](_transaction_.signedtransaction.md#transaction)

### Methods

* [encode](_transaction_.signedtransaction.md#encode)

## Constructors

###  constructor

\+ **new SignedTransaction**(`properties`: any): *[SignedTransaction](_transaction_.signedtransaction.md)*

*Inherited from [Assignable](_transaction_.assignable.md).[constructor](_transaction_.assignable.md#constructor)*

*Defined in [transaction.ts:24](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/transaction.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`properties` | any |

**Returns:** *[SignedTransaction](_transaction_.signedtransaction.md)*

## Properties

###  signature

• **signature**: *[Signature](_transaction_.signature.md)*

*Defined in [transaction.ts:122](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/transaction.ts#L122)*

___

###  transaction

• **transaction**: *[Transaction](_transaction_.transaction.md)*

*Defined in [transaction.ts:121](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/transaction.ts#L121)*

## Methods

###  encode

▸ **encode**(): *Uint8Array*

*Defined in [transaction.ts:124](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/transaction.ts#L124)*

**Returns:** *Uint8Array*
