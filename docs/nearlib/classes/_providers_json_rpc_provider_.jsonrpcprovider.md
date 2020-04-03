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
* [sendJsonRpc](_providers_json_rpc_provider_.jsonrpcprovider.md#sendjsonrpc)
* [sendTransaction](_providers_json_rpc_provider_.jsonrpcprovider.md#sendtransaction)
* [status](_providers_json_rpc_provider_.jsonrpcprovider.md#status)
* [txStatus](_providers_json_rpc_provider_.jsonrpcprovider.md#txstatus)

## Constructors

###  constructor

\+ **new JsonRpcProvider**(`url?`: string): *[JsonRpcProvider](_providers_json_rpc_provider_.jsonrpcprovider.md)*

**Parameters:**

Name | Type |
------ | ------ |
`url?` | string |

**Returns:** *[JsonRpcProvider](_providers_json_rpc_provider_.jsonrpcprovider.md)*

## Properties

###  connection

• **connection**: *[ConnectionInfo](../interfaces/_utils_web_.connectioninfo.md)*

## Methods

###  block

▸ **block**(`blockId`: [BlockId](../modules/_providers_provider_.md#blockid)): *Promise‹[BlockResult](../interfaces/_providers_provider_.blockresult.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[block](_providers_provider_.provider.md#abstract-block)*

Query for block info from the RPC
See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#block)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockId` | [BlockId](../modules/_providers_provider_.md#blockid) | Block hash or height |

**Returns:** *Promise‹[BlockResult](../interfaces/_providers_provider_.blockresult.md)›*

___

###  chunk

▸ **chunk**(`chunkId`: [ChunkId](../modules/_providers_provider_.md#chunkid)): *Promise‹[ChunkResult](../interfaces/_providers_provider_.chunkresult.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[chunk](_providers_provider_.provider.md#abstract-chunk)*

Queries for details of a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#chunk)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`chunkId` | [ChunkId](../modules/_providers_provider_.md#chunkid) | Hash of a chunk ID or shard ID |

**Returns:** *Promise‹[ChunkResult](../interfaces/_providers_provider_.chunkresult.md)›*

___

###  getNetwork

▸ **getNetwork**(): *Promise‹[Network](../interfaces/_utils_network_.network.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[getNetwork](_providers_provider_.provider.md#abstract-getnetwork)*

Get the current network (ex. test, beta, etc…)

**Returns:** *Promise‹[Network](../interfaces/_utils_network_.network.md)›*

___

###  query

▸ **query**(`path`: string, `data`: string): *Promise‹any›*

*Overrides [Provider](_providers_provider_.provider.md).[query](_providers_provider_.provider.md#abstract-query)*

Query the RPC as [shown in the docs](https://docs.nearprotocol.com/docs/interaction/rpc#query)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | string | Path parameter for the RPC (ex. "contract/my_token") |
`data` | string | Data parameter (ex. "", "AQ4", or whatever is needed)  |

**Returns:** *Promise‹any›*

___

###  sendJsonRpc

▸ **sendJsonRpc**(`method`: string, `params`: any[]): *Promise‹any›*

Directly call the RPC specifying the method and params

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`method` | string | RPC method |
`params` | any[] | Parameters to the method  |

**Returns:** *Promise‹any›*

___

###  sendTransaction

▸ **sendTransaction**(`signedTransaction`: [SignedTransaction](_transaction_.signedtransaction.md)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[sendTransaction](_providers_provider_.provider.md#abstract-sendtransaction)*

Sends a signed transaction to the RPC
See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#send-transaction-wait-until-done)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`signedTransaction` | [SignedTransaction](_transaction_.signedtransaction.md) | The signed transaction being sent |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

###  status

▸ **status**(): *Promise‹[NodeStatusResult](../interfaces/_providers_provider_.nodestatusresult.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[status](_providers_provider_.provider.md#abstract-status)*

Gets the RPC's status
See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#status)

**Returns:** *Promise‹[NodeStatusResult](../interfaces/_providers_provider_.nodestatusresult.md)›*

___

###  txStatus

▸ **txStatus**(`txHash`: Uint8Array, `accountId`: string): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Overrides [Provider](_providers_provider_.provider.md).[txStatus](_providers_provider_.provider.md#abstract-txstatus)*

Gets a transaction's status from the RPC
See [docs for more info](https://docs.nearprotocol.com/docs/interaction/rpc#status)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`txHash` | Uint8Array | The hash of the transaction |
`accountId` | string | The NEAR account that signed the transaction |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*
