

# Hierarchy

**Provider**

↳  [JsonRpcProvider](_providers_json_rpc_provider_.jsonrpcprovider.md)

# Methods

<a id="getnetwork"></a>

## `<Abstract>` getNetwork

▸ **getNetwork**(): `Promise`<[Network](../modules/_utils_network_.md#network)>

*Defined in [providers/provider.ts:33](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/providers/provider.ts#L33)*

**Returns:** `Promise`<[Network](../modules/_utils_network_.md#network)>

___
<a id="query"></a>

## `<Abstract>` query

▸ **query**(path: *`string`*, data: *`string`*): `Promise`<[QueryResult](../modules/_providers_provider_.md#queryresult)>

*Defined in [providers/provider.ts:36](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/providers/provider.ts#L36)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |
| data | `string` |

**Returns:** `Promise`<[QueryResult](../modules/_providers_provider_.md#queryresult)>

___
<a id="sendtransaction"></a>

## `<Abstract>` sendTransaction

▸ **sendTransaction**(signedTransaction: *`SignedTransaction`*): `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

*Defined in [providers/provider.ts:35](https://github.com/nearprotocol/nearlib/blob/da418fd/src.ts/providers/provider.ts#L35)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| signedTransaction | `SignedTransaction` |

**Returns:** `Promise`<[FinalTransactionResult](../modules/_providers_provider_.md#finaltransactionresult)>

___

