

# Type aliases

<a id="alltransactions"></a>

##  AllTransactions

**Ƭ AllTransactions**: *`SendMoneyTransaction` \| `CreateAccountTransaction` \| `DeployContractTransaction` \| `FunctionCallTransaction` \| `StakeTransaction` \| `SwapKeyTransaction` \| `AddKeyTransaction` \| `DeleteKeyTransaction`*

*Defined in [transaction.ts:25](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L25)*

___

# Variables

<a id="transaction_field_map"></a>

## `<Const>` TRANSACTION_FIELD_MAP

**● TRANSACTION_FIELD_MAP**: *`Map`<`Function`, `string`>* =  new Map<Function, string>([
    [CreateAccountTransaction, 'createAccount'],
    [DeployContractTransaction, 'deployContract'],
    [FunctionCallTransaction, 'functionCall'],
    [SendMoneyTransaction, 'sendMoney'],
    [StakeTransaction, 'stake'],
    [SwapKeyTransaction, 'swapKey'],
    [AddKeyTransaction, 'addKey'],
    [DeleteKeyTransaction, 'deleteKey'],
])

*Defined in [transaction.ts:14](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L14)*

___

# Functions

<a id="addkey"></a>

##  addKey

▸ **addKey**(nonce: *`number`*, originator: *`string`*, newKey: *`string`*, accessKey: *`AccessKey`*): `AddKeyTransaction`

*Defined in [transaction.ts:69](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L69)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| originator | `string` |
| newKey | `string` |
| accessKey | `AccessKey` |

**Returns:** `AddKeyTransaction`

___
<a id="bigint"></a>

##  bigInt

▸ **bigInt**(num: *`BN`*): `Uint128`

*Defined in [transaction.ts:27](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L27)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| num | `BN` |

**Returns:** `Uint128`

___
<a id="createaccesskey"></a>

##  createAccessKey

▸ **createAccessKey**(contractId?: *`string`*, methodName?: *`string`*, balanceOwner?: *`string`*, amount?: *`BN`*): `AccessKey`

*Defined in [transaction.ts:60](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L60)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` contractId | `string` |
| `Optional` methodName | `string` |
| `Optional` balanceOwner | `string` |
| `Optional` amount | `BN` |

**Returns:** `AccessKey`

___
<a id="createaccount"></a>

##  createAccount

▸ **createAccount**(nonce: *`number`*, originator: *`string`*, newAccountId: *`string`*, publicKey: *`string`*, amount: *`BN`*): `CreateAccountTransaction`

*Defined in [transaction.ts:36](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L36)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| originator | `string` |
| newAccountId | `string` |
| publicKey | `string` |
| amount | `BN` |

**Returns:** `CreateAccountTransaction`

___
<a id="deletekey"></a>

##  deleteKey

▸ **deleteKey**(nonce: *`number`*, originator: *`string`*, curKey: *`string`*): `DeleteKeyTransaction`

*Defined in [transaction.ts:73](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| originator | `string` |
| curKey | `string` |

**Returns:** `DeleteKeyTransaction`

___
<a id="deploycontract"></a>

##  deployContract

▸ **deployContract**(nonce: *`number`*, contractId: *`string`*, wasmByteArray: *`Uint8Array`*): `DeployContractTransaction`

*Defined in [transaction.ts:40](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L40)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| contractId | `string` |
| wasmByteArray | `Uint8Array` |

**Returns:** `DeployContractTransaction`

___
<a id="fromuint128"></a>

##  fromUint128

▸ **fromUint128**(num: *`string`*): `BN`

*Defined in [transaction.ts:32](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| num | `string` |

**Returns:** `BN`

___
<a id="functioncall"></a>

##  functionCall

▸ **functionCall**(nonce: *`number`*, originator: *`string`*, contractId: *`string`*, methodName: *`string`*, args: *`Uint8Array`*, amount: *`BN`*): `FunctionCallTransaction`

*Defined in [transaction.ts:44](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L44)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| originator | `string` |
| contractId | `string` |
| methodName | `string` |
| args | `Uint8Array` |
| amount | `BN` |

**Returns:** `FunctionCallTransaction`

___
<a id="sendmoney"></a>

##  sendMoney

▸ **sendMoney**(nonce: *`number`*, originator: *`string`*, receiver: *`string`*, amount: *`BN`*): `SendMoneyTransaction`

*Defined in [transaction.ts:48](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L48)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| originator | `string` |
| receiver | `string` |
| amount | `BN` |

**Returns:** `SendMoneyTransaction`

___
<a id="signtransaction"></a>

##  signTransaction

▸ **signTransaction**(signer: *[Signer](../classes/_signer_.signer.md)*, transaction: *`any`*, accountId?: *`string`*, networkId?: *`string`*): `Promise`<[`Uint8Array`, `SignedTransaction`]>

*Defined in [transaction.ts:86](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L86)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| signer | [Signer](../classes/_signer_.signer.md) |
| transaction | `any` |
| `Optional` accountId | `string` |
| `Optional` networkId | `string` |

**Returns:** `Promise`<[`Uint8Array`, `SignedTransaction`]>

___
<a id="signedtransaction"></a>

##  signedTransaction

▸ **signedTransaction**(transaction: *[AllTransactions](_transaction_.md#alltransactions)*, signature: *[Signature](../interfaces/_utils_key_pair_.signature.md)*): `SignedTransaction`

*Defined in [transaction.ts:77](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L77)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transaction | [AllTransactions](_transaction_.md#alltransactions) |
| signature | [Signature](../interfaces/_utils_key_pair_.signature.md) |

**Returns:** `SignedTransaction`

___
<a id="stake"></a>

##  stake

▸ **stake**(nonce: *`number`*, originator: *`string`*, amount: *`BN`*, publicKey: *`string`*): `StakeTransaction`

*Defined in [transaction.ts:52](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L52)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| originator | `string` |
| amount | `BN` |
| publicKey | `string` |

**Returns:** `StakeTransaction`

___
<a id="swapkey"></a>

##  swapKey

▸ **swapKey**(nonce: *`number`*, originator: *`string`*, curKey: *`string`*, newKey: *`string`*): `SwapKeyTransaction`

*Defined in [transaction.ts:56](https://github.com/nearprotocol/nearlib/blob/56541eb/src.ts/transaction.ts#L56)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| originator | `string` |
| curKey | `string` |
| newKey | `string` |

**Returns:** `SwapKeyTransaction`

___

