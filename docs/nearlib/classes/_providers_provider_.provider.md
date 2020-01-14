---
id: "_providers_provider_.provider"
title: "Provider"
sidebar_label: "Provider"
---

## Hierarchy

* **Provider**

  ↳ [JsonRpcProvider](_providers_json_rpc_provider_.jsonrpcprovider.md)

## Index

### Methods

* [block](_providers_provider_.provider.md#abstract-block)
* [chunk](_providers_provider_.provider.md#abstract-chunk)
* [getNetwork](_providers_provider_.provider.md#abstract-getnetwork)
* [query](_providers_provider_.provider.md#abstract-query)
* [sendTransaction](_providers_provider_.provider.md#abstract-sendtransaction)
* [status](_providers_provider_.provider.md#abstract-status)
* [txStatus](_providers_provider_.provider.md#abstract-txstatus)

## Methods

### `Abstract` block

▸ **block**(`blockId`: [BlockId](../modules/_providers_provider_.md#blockid)): *Promise‹[BlockResult](../interfaces/_providers_provider_.blockresult.md)›*

*Defined in [src.ts/providers/provider.ts:145](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`blockId` | [BlockId](../modules/_providers_provider_.md#blockid) |

**Returns:** *Promise‹[BlockResult](../interfaces/_providers_provider_.blockresult.md)›*

___

### `Abstract` chunk

▸ **chunk**(`chunkId`: [ChunkId](../modules/_providers_provider_.md#chunkid)): *Promise‹[ChunkResult](../interfaces/_providers_provider_.chunkresult.md)›*

*Defined in [src.ts/providers/provider.ts:146](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L146)*

**Parameters:**

Name | Type |
------ | ------ |
`chunkId` | [ChunkId](../modules/_providers_provider_.md#chunkid) |

**Returns:** *Promise‹[ChunkResult](../interfaces/_providers_provider_.chunkresult.md)›*

___

### `Abstract` getNetwork

▸ **getNetwork**(): *Promise‹[Network](../interfaces/_utils_network_.network.md)›*

*Defined in [src.ts/providers/provider.ts:139](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L139)*

**Returns:** *Promise‹[Network](../interfaces/_utils_network_.network.md)›*

___

### `Abstract` query

▸ **query**(`path`: string, `data`: string): *Promise‹any›*

*Defined in [src.ts/providers/provider.ts:144](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L144)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`data` | string |

**Returns:** *Promise‹any›*

___

### `Abstract` sendTransaction

▸ **sendTransaction**(`signedTransaction`: [SignedTransaction](_transaction_.signedtransaction.md)): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/providers/provider.ts:142](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`signedTransaction` | [SignedTransaction](_transaction_.signedtransaction.md) |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

___

### `Abstract` status

▸ **status**(): *Promise‹[NodeStatusResult](../interfaces/_providers_provider_.nodestatusresult.md)›*

*Defined in [src.ts/providers/provider.ts:140](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L140)*

**Returns:** *Promise‹[NodeStatusResult](../interfaces/_providers_provider_.nodestatusresult.md)›*

___

### `Abstract` txStatus

▸ **txStatus**(`txHash`: Uint8Array, `accountId`: string): *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*

*Defined in [src.ts/providers/provider.ts:143](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L143)*

**Parameters:**

Name | Type |
------ | ------ |
`txHash` | Uint8Array |
`accountId` | string |

**Returns:** *Promise‹[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)›*
