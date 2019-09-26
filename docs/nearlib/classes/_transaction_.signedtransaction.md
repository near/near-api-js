---
id: "_transaction_.signedtransaction"
title: "SignedTransaction"
sidebar_label: "SignedTransaction"
---

## Hierarchy

* [Assignable](_utils_enums_.assignable.md)

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

*Inherited from [Assignable](_utils_enums_.assignable.md).[constructor](_utils_enums_.assignable.md#constructor)*

*Defined in [utils/enums.ts:17](https://github.com/nearprotocol/nearlib/blob/f222a4e/src.ts/utils/enums.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`properties` | any |

**Returns:** *[SignedTransaction](_transaction_.signedtransaction.md)*

## Properties

###  signature

• **signature**: *[Signature](_transaction_.signature.md)*

*Defined in [transaction.ts:101](https://github.com/nearprotocol/nearlib/blob/f222a4e/src.ts/transaction.ts#L101)*

___

###  transaction

• **transaction**: *[Transaction](_transaction_.transaction.md)*

*Defined in [transaction.ts:100](https://github.com/nearprotocol/nearlib/blob/f222a4e/src.ts/transaction.ts#L100)*

## Methods

###  encode

▸ **encode**(): *Uint8Array*

*Defined in [transaction.ts:103](https://github.com/nearprotocol/nearlib/blob/f222a4e/src.ts/transaction.ts#L103)*

**Returns:** *Uint8Array*
