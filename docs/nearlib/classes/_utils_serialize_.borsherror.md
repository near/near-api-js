---
id: "_utils_serialize_.borsherror"
title: "BorshError"
sidebar_label: "BorshError"
---

## Hierarchy

* Error

  ↳ **BorshError**

## Index

### Constructors

* [constructor](_utils_serialize_.borsherror.md#constructor)

### Properties

* [fieldPath](_utils_serialize_.borsherror.md#fieldpath)
* [message](_utils_serialize_.borsherror.md#message)
* [name](_utils_serialize_.borsherror.md#name)
* [originalMessage](_utils_serialize_.borsherror.md#originalmessage)
* [stack](_utils_serialize_.borsherror.md#optional-stack)
* [Error](_utils_serialize_.borsherror.md#static-error)

### Methods

* [addToFieldPath](_utils_serialize_.borsherror.md#addtofieldpath)

## Constructors

###  constructor

\+ **new BorshError**(`message`: string): *[BorshError](_utils_serialize_.borsherror.md)*

*Defined in [src.ts/utils/serialize.ts:28](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *[BorshError](_utils_serialize_.borsherror.md)*

## Properties

###  fieldPath

• **fieldPath**: *string[]* =  []

*Defined in [src.ts/utils/serialize.ts:28](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L28)*

___

###  message

• **message**: *string*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:974

___

###  name

• **name**: *string*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:973

___

###  originalMessage

• **originalMessage**: *string*

*Defined in [src.ts/utils/serialize.ts:27](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L27)*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from void*

*Overrides void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:975

___

### `Static` Error

▪ **Error**: *ErrorConstructor*

Defined in node_modules/typescript/lib/lib.es5.d.ts:984

## Methods

###  addToFieldPath

▸ **addToFieldPath**(`fieldName`: string): *void*

*Defined in [src.ts/utils/serialize.ts:35](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/serialize.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`fieldName` | string |

**Returns:** *void*
