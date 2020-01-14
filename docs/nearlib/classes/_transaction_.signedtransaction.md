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

*Defined in [src.ts/utils/enums.ts:17](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/enums.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`properties` | any |

**Returns:** *[SignedTransaction](_transaction_.signedtransaction.md)*

## Properties

###  signature

• **signature**: *[Signature](_transaction_.signature.md)*

*Defined in [src.ts/transaction.ts:104](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L104)*

___

###  transaction

• **transaction**: *[Transaction](_transaction_.transaction.md)*

*Defined in [src.ts/transaction.ts:103](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L103)*

## Methods

###  encode

▸ **encode**(): *Uint8Array*

*Defined in [src.ts/transaction.ts:106](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L106)*

**Returns:** *Uint8Array*

___

### `Static` decode

▸ **decode**(`bytes`: Buffer): *[SignedTransaction](_transaction_.signedtransaction.md)*

*Defined in [src.ts/transaction.ts:110](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/transaction.ts#L110)*

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Buffer |

**Returns:** *[SignedTransaction](_transaction_.signedtransaction.md)*
