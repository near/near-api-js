

# Hierarchy

 [Provider](_providers_provider_.provider.md)

**↳ JsonRpcProvider**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new JsonRpcProvider**(url?: *`string`*, network?: *[Network](../interfaces/_utils_network_.network.md)*): [JsonRpcProvider](_providers_json_rpc_provider_.jsonrpcprovider.md)

*Defined in [providers/json-rpc-provider.ts:13](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/providers/json-rpc-provider.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` url | `string` |
| `Optional` network | [Network](../interfaces/_utils_network_.network.md) |

**Returns:** [JsonRpcProvider](_providers_json_rpc_provider_.jsonrpcprovider.md)

___

# Properties

<a id="connection"></a>

##  connection

**● connection**: *[ConnectionInfo](../interfaces/_utils_web_.connectioninfo.md)*

*Defined in [providers/json-rpc-provider.ts:13](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/providers/json-rpc-provider.ts#L13)*

___

# Methods

<a id="getnetwork"></a>

##  getNetwork

▸ **getNetwork**(): `Promise`<[Network](../interfaces/_utils_network_.network.md)>

*Overrides [Provider](_providers_provider_.provider.md).[getNetwork](_providers_provider_.provider.md#getnetwork)*

*Defined in [providers/json-rpc-provider.ts:22](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/providers/json-rpc-provider.ts#L22)*

**Returns:** `Promise`<[Network](../interfaces/_utils_network_.network.md)>

___
<a id="query"></a>

##  query

▸ **query**(path: *`string`*, data: *`string`*): `Promise`<`any`>

*Overrides [Provider](_providers_provider_.provider.md).[query](_providers_provider_.provider.md#query)*

*Defined in [providers/json-rpc-provider.ts:38](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/providers/json-rpc-provider.ts#L38)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |
| data | `string` |

**Returns:** `Promise`<`any`>

___
<a id="sendjsonrpc"></a>

## `<Private>` sendJsonRpc

▸ **sendJsonRpc**(method: *`string`*, params: *`any`[]*): `Promise`<`any`>

*Defined in [providers/json-rpc-provider.ts:46](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/providers/json-rpc-provider.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| method | `string` |
| params | `any`[] |

**Returns:** `Promise`<`any`>

___
<a id="sendtransaction"></a>

##  sendTransaction

▸ **sendTransaction**(signedTransaction: *`SignedTransaction`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Overrides [Provider](_providers_provider_.provider.md).[sendTransaction](_providers_provider_.provider.md#sendtransaction)*

*Defined in [providers/json-rpc-provider.ts:29](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/providers/json-rpc-provider.ts#L29)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| signedTransaction | `SignedTransaction` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___
<a id="txstatus"></a>

##  txStatus

▸ **txStatus**(txHash: *`Uint8Array`*): `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

*Overrides [Provider](_providers_provider_.provider.md).[txStatus](_providers_provider_.provider.md#txstatus)*

*Defined in [providers/json-rpc-provider.ts:34](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/providers/json-rpc-provider.ts#L34)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| txHash | `Uint8Array` |

**Returns:** `Promise`<[FinalTransactionResult](../interfaces/_providers_provider_.finaltransactionresult.md)>

___

