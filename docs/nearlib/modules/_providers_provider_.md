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

### Classes

* [ExecutionStatus](../classes/_providers_provider_.executionstatus.md)
* [FinalExecutionStatus](../classes/_providers_provider_.finalexecutionstatus.md)
* [Provider](../classes/_providers_provider_.provider.md)

### Interfaces

* [BlockHeader](../interfaces/_providers_provider_.blockheader.md)
* [BlockResult](../interfaces/_providers_provider_.blockresult.md)
* [ExecutionOutcome](../interfaces/_providers_provider_.executionoutcome.md)
* [ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)
* [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)
* [LegacyFinalTransactionResult](../interfaces/_providers_provider_.legacyfinaltransactionresult.md)
* [LegacyTransactionLog](../interfaces/_providers_provider_.legacytransactionlog.md)
* [LegacyTransactionResult](../interfaces/_providers_provider_.legacytransactionresult.md)
* [NodeStatusResult](../interfaces/_providers_provider_.nodestatusresult.md)
* [SyncInfo](../interfaces/_providers_provider_.syncinfo.md)
* [TotalWeight](../interfaces/_providers_provider_.totalweight.md)
* [Transaction](../interfaces/_providers_provider_.transaction.md)

### Functions

* [adaptTransactionResult](_providers_provider_.md#adapttransactionresult)
* [getTransactionLastResult](_providers_provider_.md#gettransactionlastresult)
* [mapLegacyTransactionLog](_providers_provider_.md#maplegacytransactionlog)

## Functions

###  adaptTransactionResult

▸ **adaptTransactionResult**(`txResult`: [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md) | [LegacyFinalTransactionResult](../interfaces/_providers_provider_.legacyfinaltransactionresult.md)): *[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)*

*Defined in [providers/provider.ts:124](https://github.com/nearprotocol/nearlib/blob/be6b150/src.ts/providers/provider.ts#L124)*

**Parameters:**

Name | Type |
------ | ------ |
`txResult` | [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md) &#124; [LegacyFinalTransactionResult](../interfaces/_providers_provider_.legacyfinaltransactionresult.md) |

**Returns:** *[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)*

___

###  getTransactionLastResult

▸ **getTransactionLastResult**(`txResult`: [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)): *any*

*Defined in [providers/provider.ts:167](https://github.com/nearprotocol/nearlib/blob/be6b150/src.ts/providers/provider.ts#L167)*

**Parameters:**

Name | Type |
------ | ------ |
`txResult` | [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md) |

**Returns:** *any*

___

###  mapLegacyTransactionLog

▸ **mapLegacyTransactionLog**(`tl`: [LegacyTransactionLog](../interfaces/_providers_provider_.legacytransactionlog.md)): *[ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)*

*Defined in [providers/provider.ts:112](https://github.com/nearprotocol/nearlib/blob/be6b150/src.ts/providers/provider.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`tl` | [LegacyTransactionLog](../interfaces/_providers_provider_.legacytransactionlog.md) |

**Returns:** *[ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)*
