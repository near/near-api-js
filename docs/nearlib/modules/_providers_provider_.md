---
id: "_providers_provider_"
title: "providers/provider"
sidebar_label: "providers/provider"
---

## Index

### Enumerations

* [ExecutionStatusBasic](../enums/_providers_provider_.executionstatusbasic.md)
* [FinalExecutionStatusBasic](../enums/_providers_provider_.finalexecutionstatusbasic.md)

### Classes

* [Provider](../classes/_providers_provider_.provider.md)

### Interfaces

* [BlockHeader](../interfaces/_providers_provider_.blockheader.md)
* [BlockResult](../interfaces/_providers_provider_.blockresult.md)
* [ChunkHeader](../interfaces/_providers_provider_.chunkheader.md)
* [ChunkResult](../interfaces/_providers_provider_.chunkresult.md)
* [ExecutionError](../interfaces/_providers_provider_.executionerror.md)
* [ExecutionOutcome](../interfaces/_providers_provider_.executionoutcome.md)
* [ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)
* [ExecutionStatus](../interfaces/_providers_provider_.executionstatus.md)
* [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)
* [FinalExecutionStatus](../interfaces/_providers_provider_.finalexecutionstatus.md)
* [NodeStatusResult](../interfaces/_providers_provider_.nodestatusresult.md)
* [SyncInfo](../interfaces/_providers_provider_.syncinfo.md)
* [TotalWeight](../interfaces/_providers_provider_.totalweight.md)
* [Transaction](../interfaces/_providers_provider_.transaction.md)
* [Version](../interfaces/_providers_provider_.version.md)

### Type aliases

* [BlockHash](_providers_provider_.md#blockhash)
* [BlockHeight](_providers_provider_.md#blockheight)
* [BlockId](_providers_provider_.md#blockid)
* [BlockShardId](_providers_provider_.md#blockshardid)
* [ChunkHash](_providers_provider_.md#chunkhash)
* [ChunkId](_providers_provider_.md#chunkid)
* [ShardId](_providers_provider_.md#shardid)

### Functions

* [adaptTransactionResult](_providers_provider_.md#adapttransactionresult)
* [getTransactionLastResult](_providers_provider_.md#gettransactionlastresult)

## Type aliases

###  BlockHash

Ƭ **BlockHash**: *string*

*Defined in [src.ts/providers/provider.ts:27](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L27)*

___

###  BlockHeight

Ƭ **BlockHeight**: *number*

*Defined in [src.ts/providers/provider.ts:28](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L28)*

___

###  BlockId

Ƭ **BlockId**: *[BlockHash](_providers_provider_.md#blockhash) | [BlockHeight](_providers_provider_.md#blockheight)*

*Defined in [src.ts/providers/provider.ts:29](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L29)*

___

###  BlockShardId

Ƭ **BlockShardId**: *[[BlockId](_providers_provider_.md#blockid), [ShardId](_providers_provider_.md#shardid)]*

*Defined in [src.ts/providers/provider.ts:96](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L96)*

___

###  ChunkHash

Ƭ **ChunkHash**: *string*

*Defined in [src.ts/providers/provider.ts:94](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L94)*

___

###  ChunkId

Ƭ **ChunkId**: *[ChunkHash](_providers_provider_.md#chunkhash) | [BlockShardId](_providers_provider_.md#blockshardid)*

*Defined in [src.ts/providers/provider.ts:97](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L97)*

___

###  ShardId

Ƭ **ShardId**: *number*

*Defined in [src.ts/providers/provider.ts:95](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L95)*

## Functions

###  adaptTransactionResult

▸ **adaptTransactionResult**(`txResult`: any): *[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)*

*Defined in [src.ts/providers/provider.ts:161](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L161)*

**Parameters:**

Name | Type |
------ | ------ |
`txResult` | any |

**Returns:** *[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)*

___

###  getTransactionLastResult

▸ **getTransactionLastResult**(`txResult`: [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)): *any*

*Defined in [src.ts/providers/provider.ts:149](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/providers/provider.ts#L149)*

**Parameters:**

Name | Type |
------ | ------ |
`txResult` | [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md) |

**Returns:** *any*
