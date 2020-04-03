---
id: "_utils_serialize_.borsherror"
title: "BorshError"
sidebar_label: "BorshError"
---

## Hierarchy

* [Error](_utils_serialize_.borsherror.md#static-error)

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

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *[BorshError](_utils_serialize_.borsherror.md)*

## Properties

###  fieldPath

• **fieldPath**: *string[]* = []

___

###  message

• **message**: *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[message](_utils_serialize_.borsherror.md#message)*

___

###  name

• **name**: *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[name](_utils_serialize_.borsherror.md#name)*

___

###  originalMessage

• **originalMessage**: *string*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [BorshError](_utils_serialize_.borsherror.md).[stack](_utils_serialize_.borsherror.md#optional-stack)*

___

### `Static` Error

▪ **Error**: *ErrorConstructor*

## Methods

###  addToFieldPath

▸ **addToFieldPath**(`fieldName`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`fieldName` | string |

**Returns:** *void*
