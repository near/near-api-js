---
id: "_generated_rpc_error_types_.invalidtxerror"
title: "InvalidTxError"
sidebar_label: "InvalidTxError"
---

## Hierarchy

  ↳ [TxExecutionError](_generated_rpc_error_types_.txexecutionerror.md)

  ↳ **InvalidTxError**

  ↳ [InvalidAccessKey](_generated_rpc_error_types_.invalidaccesskey.md)

  ↳ [InvalidReceiverId](_generated_rpc_error_types_.invalidreceiverid.md)

  ↳ [RentUnpaid](_generated_rpc_error_types_.rentunpaid.md)

  ↳ [Expired](_generated_rpc_error_types_.expired.md)

  ↳ [InvalidSignature](_generated_rpc_error_types_.invalidsignature.md)

  ↳ [InvalidChain](_generated_rpc_error_types_.invalidchain.md)

  ↳ [InvalidSignerId](_generated_rpc_error_types_.invalidsignerid.md)

  ↳ [CostOverflow](_generated_rpc_error_types_.costoverflow.md)

  ↳ [NotEnoughBalance](_generated_rpc_error_types_.notenoughbalance.md)

  ↳ [InvalidNonce](_generated_rpc_error_types_.invalidnonce.md)

  ↳ [SignerDoesNotExist](_generated_rpc_error_types_.signerdoesnotexist.md)

## Index

### Constructors

* [constructor](_generated_rpc_error_types_.invalidtxerror.md#constructor)

### Properties

* [message](_generated_rpc_error_types_.invalidtxerror.md#message)
* [name](_generated_rpc_error_types_.invalidtxerror.md#name)
* [stack](_generated_rpc_error_types_.invalidtxerror.md#optional-stack)
* [type](_generated_rpc_error_types_.invalidtxerror.md#type)

## Constructors

###  constructor

\+ **new InvalidTxError**(`message?`: string, `type?`: string): *[InvalidTxError](_generated_rpc_error_types_.invalidtxerror.md)*

*Inherited from [TypedError](_utils_errors_.typederror.md).[constructor](_utils_errors_.typederror.md#constructor)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/errors.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`message?` | string |
`type?` | string |

**Returns:** *[InvalidTxError](_generated_rpc_error_types_.invalidtxerror.md)*

## Properties

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

### `Optional` stack

• **stack**? : *string*

*Inherited from void*

*Overrides void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:975

___

###  type

• **type**: *string*

*Inherited from [TypedError](_utils_errors_.typederror.md).[type](_utils_errors_.typederror.md#type)*

*Defined in [src.ts/utils/errors.ts:14](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/utils/errors.ts#L14)*
