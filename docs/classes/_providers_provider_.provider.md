

# Hierarchy

**Provider**

↳  [JsonRpcProvider](_providers_json_rpc_provider_.jsonrpcprovider.md)

# Methods

<a id="getnetwork"></a>

## `<Abstract>` getNetwork

▸ **getNetwork**(): `Promise`<[Network](../interfaces/_utils_network_.network.md)>

*Defined in [providers/provider.ts:26](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/providers/provider.ts#L26)*

**Returns:** `Promise`<[Network](../interfaces/_utils_network_.network.md)>

___
<a id="query"></a>

## `<Abstract>` query

▸ **query**(path: *`string`*, data: *`string`*): `Promise`<`any`>

*Defined in [providers/provider.ts:30](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/providers/provider.ts#L30)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |
| data | `string` |

**Returns:** `Promise`<`any`>

___
<a id="sendtransaction"></a>

## `<Abstract>` sendTransaction

▸ **sendTransaction**(signedTransaction: *`SignedTransaction`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [providers/provider.ts:28](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/providers/provider.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| signedTransaction | `SignedTransaction` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="txstatus"></a>

## `<Abstract>` txStatus

▸ **txStatus**(txHash: *`Uint8Array`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Defined in [providers/provider.ts:29](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/providers/provider.ts#L29)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| txHash | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___

