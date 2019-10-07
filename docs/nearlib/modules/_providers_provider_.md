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

### Functions

* [adaptTransactionResult](_providers_provider_.md#adapttransactionresult)
* [fixLegacyBasicExecutionOutcomeFailure](_providers_provider_.md#fixlegacybasicexecutionoutcomefailure)
* [getTransactionLastResult](_providers_provider_.md#gettransactionlastresult)
* [mapLegacyTransactionLog](_providers_provider_.md#maplegacytransactionlog)

## Functions

###  adaptTransactionResult

▸ **adaptTransactionResult**(`txResult`: [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md) | [LegacyFinalTransactionResult](../interfaces/_providers_provider_.legacyfinaltransactionresult.md)): *[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)*

*Defined in [providers/provider.ts:160](https://github.com/nearprotocol/nearlib/blob/9123455/src.ts/providers/provider.ts#L160)*

**Parameters:**

Name | Type |
------ | ------ |
`txResult` | [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md) &#124; [LegacyFinalTransactionResult](../interfaces/_providers_provider_.legacyfinaltransactionresult.md) |

**Returns:** *[FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)*

___

###  fixLegacyBasicExecutionOutcomeFailure

▸ **fixLegacyBasicExecutionOutcomeFailure**(`t`: [ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)): *[ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)*

*Defined in [providers/provider.ts:147](https://github.com/nearprotocol/nearlib/blob/9123455/src.ts/providers/provider.ts#L147)*

**Parameters:**

Name | Type |
------ | ------ |
`t` | [ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md) |

**Returns:** *[ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)*

___

###  getTransactionLastResult

▸ **getTransactionLastResult**(`txResult`: [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md)): *any*

*Defined in [providers/provider.ts:218](https://github.com/nearprotocol/nearlib/blob/9123455/src.ts/providers/provider.ts#L218)*

**Parameters:**

Name | Type |
------ | ------ |
`txResult` | [FinalExecutionOutcome](../interfaces/_providers_provider_.finalexecutionoutcome.md) |

**Returns:** *any*

___

###  mapLegacyTransactionLog

▸ **mapLegacyTransactionLog**(`tl`: [LegacyTransactionLog](../interfaces/_providers_provider_.legacytransactionlog.md)): *[ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)*

*Defined in [providers/provider.ts:125](https://github.com/nearprotocol/nearlib/blob/9123455/src.ts/providers/provider.ts#L125)*

**Parameters:**

Name | Type |
------ | ------ |
`tl` | [LegacyTransactionLog](../interfaces/_providers_provider_.legacytransactionlog.md) |

**Returns:** *[ExecutionOutcomeWithId](../interfaces/_providers_provider_.executionoutcomewithid.md)*
