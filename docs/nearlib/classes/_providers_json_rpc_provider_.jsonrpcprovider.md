---
id: "_providers_json_rpc_provider_.jsonrpcprovider"
title: "JsonRpcProvider"
sidebar_label: "JsonRpcProvider"
---

## Hierarchy

* [Provider](_providers_provider_.provider.md)

  ↳ **JsonRpcProvider**

## Index

### Constructors

* [constructor](_providers_json_rpc_provider_.jsonrpcprovider.md#constructor)

### Properties

* [connection](_providers_json_rpc_provider_.jsonrpcprovider.md#connection)

### Methods

* [block](_providers_json_rpc_provider_.jsonrpcprovider.md#block)
* [getNetwork](_providers_json_rpc_provider_.jsonrpcprovider.md#getnetwork)
* [query](_providers_json_rpc_provider_.jsonrpcprovider.md#query)
* [sendJsonRpc](_providers_json_rpc_provider_.jsonrpcprovider.md#private-sendjsonrpc)
* [sendTransaction](_providers_json_rpc_provider_.jsonrpcprovider.md#sendtransaction)
* [status](_providers_json_rpc_provider_.jsonrpcprovider.md#status)
* [txStatus](_providers_json_rpc_provider_.jsonrpcprovider.md#txstatus)

## Constructors

###  constructor

\+ **new JsonRpcProvider**(`url?`: string, `network?`: [Network](../interfaces/_utils_network_.network.md)): *[JsonRpcProvider](_providers_json_rpc_provider_.jsonrpcprovider.md)*

*Defined in [providers/json-rpc-provider.ts:21](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/providers/json-rpc-provider.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`url?` | string |
`network?` | [Network](../interfaces/_utils_network_.network.md) |

**Returns:** *[JsonRpcProvider](_providers_json_rpc_provider_.jsonrpcprovider.md)*

## Properties

###  connection

• **connection**: *[ConnectionInfo](../interfaces/_utils_web_.connectioninfo.md)*

*Defined in [providers/json-rpc-provider.ts:21](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/providers/json-rpc-provider.ts#L21)*

## Methods

###  block

▸ **block**(`height`: number): *Promise‹[BlockResult](../interfaces/_providers_provider_.blockresult.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[block](_providers_provider_.provider.md#abstract-block)*

*Defined in [providers/json-rpc-provider.ts:58](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/providers/json-rpc-provider.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`height` | number |

**Returns:** *Promise‹[BlockResult](../interfaces/_providers_provider_.blockresult.md)›*

___

###  getNetwork

▸ **getNetwork**(): *Promise‹[Network](../interfaces/_utils_network_.network.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[getNetwork](_providers_provider_.provider.md#abstract-getnetwork)*

*Defined in [providers/json-rpc-provider.ts:30](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/providers/json-rpc-provider.ts#L30)*

**Returns:** *Promise‹[Network](../interfaces/_utils_network_.network.md)›*

___

###  query

▸ **query**(`path`: string, `data`: string): *Promise‹any›*

*Overrides [Provider](_providers_provider_.provider.md).[query](_providers_provider_.provider.md#abstract-query)*

*Defined in [providers/json-rpc-provider.ts:50](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/providers/json-rpc-provider.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`data` | string |

**Returns:** *Promise‹any›*

___

### `Private` sendJsonRpc

▸ **sendJsonRpc**(`method`: string, `params`: any[]): *Promise‹any›*

*Defined in [providers/json-rpc-provider.ts:62](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/providers/json-rpc-provider.ts#L62)*

**Parameters:**

Name | Type |
------ | ------ |
`method` | string |
`params` | any[] |

**Returns:** *Promise‹any›*

___

###  sendTransaction

▸ **sendTransaction**(`signedTransaction`: [SignedTransaction](_transaction_.signedtransaction.md)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[sendTransaction](_providers_provider_.provider.md#abstract-sendtransaction)*

*Defined in [providers/json-rpc-provider.ts:41](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/providers/json-rpc-provider.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`signedTransaction` | [SignedTransaction](_transaction_.signedtransaction.md) |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  status

▸ **status**(): *Promise‹[NodeStatusResult](../interfaces/_providers_provider_.nodestatusresult.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[status](_providers_provider_.provider.md#abstract-status)*

*Defined in [providers/json-rpc-provider.ts:37](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/providers/json-rpc-provider.ts#L37)*

**Returns:** *Promise‹[NodeStatusResult](../interfaces/_providers_provider_.nodestatusresult.md)›*

___

###  txStatus

▸ **txStatus**(`txHash`: Uint8Array): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[txStatus](_providers_provider_.provider.md#abstract-txstatus)*

*Defined in [providers/json-rpc-provider.ts:46](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/providers/json-rpc-provider.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`txHash` | Uint8Array |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*
