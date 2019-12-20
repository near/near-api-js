---
id: "_providers_provider_"
title: "providers/provider"
sidebar_label: "providers/provider"
---

## Index

### Enumerations

* [ExecutionStatusBasic](../enums/_providers_provider_.executionstatusbasic.md)
* [FinalExecutionStatusBasic](../enums/_providers_provider_.finalexecutionstatusbasic.md)
* [LegacyFinalTransactionStatus](../enums/_providers_provider_.legacyfinaltransactionstatus.md)
* [LegacyTransactionStatus](../enums/_providers_provider_.legacytransactionstatus.md)

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
* [LegacyFinalTransactionResult](../interfaces/_providers_provider_.legacyfinaltransactionresult.md)
* [LegacyTransactionLog](../interfaces/_providers_provider_.legacytransactionlog.md)
* [LegacyTransactionResult](../interfaces/_providers_provider_.legacytransactionresult.md)
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
* [fixLegacyBasicExecutionOutcomeFailure](_providers_provider_.md#fixlegacybasicexecutionoutcomefailure)
* [getTransactionLastResult](_providers_provider_.md#gettransactionlastresult)
* [mapLegacyTransactionLog](_providers_provider_.md#maplegacytransactionlog)

## Type aliases

###  BlockHash

Ƭ **BlockHash**: *string*

*Defined in [src.ts/providers/provider.ts:27](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/providers/provider.ts#L27)*

___

###  BlockHeight

Ƭ **BlockHeight**: *number*

*Defined in [src.ts/providers/provider.ts:28](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/providers/provider.ts#L28)*

___

###  BlockId

Ƭ **BlockId**: *[BlockHash](_providers_provider_.md#blockhash) | [BlockHeight](_providers_provider_.md#blockheight)*

*Defined in [src.ts/providers/provider.ts:29](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/providers/provider.ts#L29)*

___

###  BlockShardId

Ƭ **BlockShardId**: *[[BlockId](_providers_provider_.md#blockid), [ShardId](_providers_provider_.md#shardid)]*

*Defined in [src.ts/providers/provider.ts:95](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/providers/provider.ts#L95)*

___

###  ChunkHash

Ƭ **ChunkHash**: *string*

*Defined in [src.ts/providers/provider.ts:93](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/providers/provider.ts#L93)*

___

###  ChunkId

Ƭ **ChunkId**: *[ChunkHash](_providers_provider_.md#chunkhash) | [BlockShardId](_providers_provider_.md#blockshardid)*

*Defined in [src.ts/providers/provider.ts:96](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/providers/provider.ts#L96)*

___

###  ShardId

Ƭ **ShardId**: *number*

*Defined in [src.ts/providers/provider.ts:94](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/providers/provider.ts#L94)*

## Functions

###  adaptTransactionResult

▸ **adaptTransactionResult**(`txResult`: [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md) | [LegacyFinalTransactionResult](../interfaces/_providers_provider_.legacyfinaltransactionresult.md)): *[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)*

*Defined in [src.ts/providers/provider.ts:210](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/providers/provider.ts#L210)*

**Parameters:**

Name | Type |
------ | ------ |
`txResult` | [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md) &#124; [LegacyFinalTransactionResult](../interfaces/_providers_provider_.legacyfinaltransactionresult.md) |

**Returns:** *[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)*

___

###  fixLegacyBasicExecutionOutcomeFailure

▸ **fixLegacyBasicExecutionOutcomeFailure**(`t`: [ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)): *[ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)*

*Defined in [src.ts/providers/provider.ts:196](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/providers/provider.ts#L196)*

**Parameters:**

Name | Type |
------ | ------ |
`t` | [ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md) |

**Returns:** *[ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)*

___

###  getTransactionLastResult

▸ **getTransactionLastResult**(`txResult`: [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)): *any*

*Defined in [src.ts/providers/provider.ts:269](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/providers/provider.ts#L269)*

**Parameters:**

Name | Type |
------ | ------ |
`txResult` | [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md) |

**Returns:** *any*

___

###  mapLegacyTransactionLog

▸ **mapLegacyTransactionLog**(`tl`: [LegacyTransactionLog](../interfaces/_providers_provider_.legacytransactionlog.md)): *[ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)*

*Defined in [src.ts/providers/provider.ts:173](https://github.com/nearprotocol/nearlib/blob/d578981/src.ts/providers/provider.ts#L173)*

**Parameters:**

Name | Type |
------ | ------ |
`tl` | [LegacyTransactionLog](../interfaces/_providers_provider_.legacytransactionlog.md) |

**Returns:** *[ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)*
