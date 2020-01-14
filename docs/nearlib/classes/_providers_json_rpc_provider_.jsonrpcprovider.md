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
* [chunk](_providers_json_rpc_provider_.jsonrpcprovider.md#chunk)
* [getNetwork](_providers_json_rpc_provider_.jsonrpcprovider.md#getnetwork)
* [query](_providers_json_rpc_provider_.jsonrpcprovider.md#query)
* [sendJsonRpc](_providers_json_rpc_provider_.jsonrpcprovider.md#private-sendjsonrpc)
* [sendTransaction](_providers_json_rpc_provider_.jsonrpcprovider.md#sendtransaction)
* [status](_providers_json_rpc_provider_.jsonrpcprovider.md#status)
* [txStatus](_providers_json_rpc_provider_.jsonrpcprovider.md#txstatus)

## Constructors

###  constructor

\+ **new JsonRpcProvider**(`url?`: string, `network?`: [Network](../interfaces/_utils_network_.network.md)): *[JsonRpcProvider](_providers_json_rpc_provider_.jsonrpcprovider.md)*

*Defined in [src.ts/providers/json-rpc-provider.ts:20](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/json-rpc-provider.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`url?` | string |
`network?` | [Network](../interfaces/_utils_network_.network.md) |

**Returns:** *[JsonRpcProvider](_providers_json_rpc_provider_.jsonrpcprovider.md)*

## Properties

###  connection

• **connection**: *[ConnectionInfo](../interfaces/_utils_web_.connectioninfo.md)*

*Defined in [src.ts/providers/json-rpc-provider.ts:20](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/json-rpc-provider.ts#L20)*

## Methods

###  block

▸ **block**(`blockId`: [BlockId](../modules/_providers_provider_.md#blockid)): *Promise‹[BlockResult](../interfaces/_providers_provider_.blockresult.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[block](_providers_provider_.provider.md#abstract-block)*

*Defined in [src.ts/providers/json-rpc-provider.ts:57](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/json-rpc-provider.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`blockId` | [BlockId](../modules/_providers_provider_.md#blockid) |

**Returns:** *Promise‹[BlockResult](../interfaces/_providers_provider_.blockresult.md)›*

___

###  chunk

▸ **chunk**(`chunkId`: [ChunkId](../modules/_providers_provider_.md#chunkid)): *Promise‹[ChunkResult](../interfaces/_providers_provider_.chunkresult.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[chunk](_providers_provider_.provider.md#abstract-chunk)*

*Defined in [src.ts/providers/json-rpc-provider.ts:61](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/json-rpc-provider.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`chunkId` | [ChunkId](../modules/_providers_provider_.md#chunkid) |

**Returns:** *Promise‹[ChunkResult](../interfaces/_providers_provider_.chunkresult.md)›*

___

###  getNetwork

▸ **getNetwork**(): *Promise‹[Network](../interfaces/_utils_network_.network.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[getNetwork](_providers_provider_.provider.md#abstract-getnetwork)*

*Defined in [src.ts/providers/json-rpc-provider.ts:29](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/json-rpc-provider.ts#L29)*

**Returns:** *Promise‹[Network](../interfaces/_utils_network_.network.md)›*

___

###  query

▸ **query**(`path`: string, `data`: string): *Promise‹any›*

*Overrides [Provider](_providers_provider_.provider.md).[query](_providers_provider_.provider.md#abstract-query)*

*Defined in [src.ts/providers/json-rpc-provider.ts:49](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/json-rpc-provider.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`data` | string |

**Returns:** *Promise‹any›*

___

### `Private` sendJsonRpc

▸ **sendJsonRpc**(`method`: string, `params`: any[]): *Promise‹any›*

*Defined in [src.ts/providers/json-rpc-provider.ts:65](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/json-rpc-provider.ts#L65)*

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

*Defined in [src.ts/providers/json-rpc-provider.ts:40](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/json-rpc-provider.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`signedTransaction` | [SignedTransaction](_transaction_.signedtransaction.md) |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  status

▸ **status**(): *Promise‹[NodeStatusResult](../interfaces/_providers_provider_.nodestatusresult.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[status](_providers_provider_.provider.md#abstract-status)*

*Defined in [src.ts/providers/json-rpc-provider.ts:36](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/json-rpc-provider.ts#L36)*

**Returns:** *Promise‹[NodeStatusResult](../interfaces/_providers_provider_.nodestatusresult.md)›*

___

###  txStatus

▸ **txStatus**(`txHash`: Uint8Array, `accountId`: string): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[txStatus](_providers_provider_.provider.md#abstract-txstatus)*

*Defined in [src.ts/providers/json-rpc-provider.ts:45](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/json-rpc-provider.ts#L45)*

**Parameters:**

Name | Type |
------ | ------ |
`txHash` | Uint8Array |
`accountId` | string |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*
