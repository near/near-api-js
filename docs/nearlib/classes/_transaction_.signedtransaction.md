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
* [decode](_transaction_.signedtransaction.md#static-decode)

## Constructors

###  constructor

\+ **new SignedTransaction**(`properties`: any): *[SignedTransaction](_transaction_.signedtransaction.md)*

*Inherited from [Assignable](_utils_enums_.assignable.md).[constructor](_utils_enums_.assignable.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`properties` | any |

**Returns:** *[SignedTransaction](_transaction_.signedtransaction.md)*

## Properties

###  signature

• **signature**: *[Signature](_transaction_.signature.md)*

___

###  transaction

• **transaction**: *[Transaction](_transaction_.transaction.md)*

## Methods

###  encode

▸ **encode**(): *Uint8Array*

**Returns:** *Uint8Array*

___

### `Static` decode

▸ **decode**(`bytes`: Buffer): *[SignedTransaction](_transaction_.signedtransaction.md)*

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Buffer |

**Returns:** *[SignedTransaction](_transaction_.signedtransaction.md)*
