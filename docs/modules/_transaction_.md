

# Type aliases

<a id="alltransactions"></a>

##  AllTransactions

**Ƭ AllTransactions**: *`SendMoneyTransaction` \| `CreateAccountTransaction` \| `DeployContractTransaction` \| `FunctionCallTransaction` \| `StakeTransaction` \| `SwapKeyTransaction` \| `AddKeyTransaction` \| `DeleteKeyTransaction`*

*Defined in [transaction.ts:26](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L26)*

___

# Functions

<a id="addkey"></a>

##  addKey

▸ **addKey**(nonce: *`number`*, originator: *`string`*, newKey: *`string`*, accessKey: *`AccessKey`*): `AddKeyTransaction`

*Defined in [transaction.ts:70](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L70)*

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

▸ **bigInt**(num: *`bigint`*): `Uint128`

*Defined in [transaction.ts:28](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| num | `bigint` |

**Returns:** `Uint128`

___
<a id="createaccesskey"></a>

##  createAccessKey

▸ **createAccessKey**(contractId?: *`string`*, methodName?: *`string`*, balanceOwner?: *`string`*, amount?: *`bigint`*): `AccessKey`

*Defined in [transaction.ts:61](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` contractId | `string` |
| `Optional` methodName | `string` |
| `Optional` balanceOwner | `string` |
| `Optional` amount | `bigint` |

**Returns:** `AccessKey`

___
<a id="createaccount"></a>

##  createAccount

▸ **createAccount**(nonce: *`number`*, originator: *`string`*, newAccountId: *`string`*, publicKey: *`string`*, amount: *`bigint`*): `CreateAccountTransaction`

*Defined in [transaction.ts:37](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L37)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| originator | `string` |
| newAccountId | `string` |
| publicKey | `string` |
| amount | `bigint` |

**Returns:** `CreateAccountTransaction`

___
<a id="deletekey"></a>

##  deleteKey

▸ **deleteKey**(nonce: *`number`*, originator: *`string`*, curKey: *`string`*): `DeleteKeyTransaction`

*Defined in [transaction.ts:74](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L74)*

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

*Defined in [transaction.ts:41](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L41)*

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

▸ **fromUint128**(num: *`string`*): `bigint`

*Defined in [transaction.ts:33](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L33)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| num | `string` |

**Returns:** `bigint`

___
<a id="functioncall"></a>

##  functionCall

▸ **functionCall**(nonce: *`number`*, originator: *`string`*, contractId: *`string`*, methodName: *`string`*, args: *`Uint8Array`*, amount: *`bigint`*): `FunctionCallTransaction`

*Defined in [transaction.ts:45](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L45)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| originator | `string` |
| contractId | `string` |
| methodName | `string` |
| args | `Uint8Array` |
| amount | `bigint` |

**Returns:** `FunctionCallTransaction`

___
<a id="sendmoney"></a>

##  sendMoney

▸ **sendMoney**(nonce: *`number`*, originator: *`string`*, receiver: *`string`*, amount: *`bigint`*): `SendMoneyTransaction`

*Defined in [transaction.ts:49](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| originator | `string` |
| receiver | `string` |
| amount | `bigint` |

**Returns:** `SendMoneyTransaction`

___
<a id="signtransaction"></a>

##  signTransaction

▸ **signTransaction**(signer: *[Signer](../classes/_signer_.signer.md)*, transaction: *`any`*, accountId?: *`string`*, networkId?: *`string`*): `Promise`<[`Uint8Array`, `SignedTransaction`]>

*Defined in [transaction.ts:87](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L87)*

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

▸ **signedTransaction**(transaction: *[AllTransactions](_transaction_.md#alltransactions)*, signature: *[Signature](_utils_key_pair_.md#signature)*): `SignedTransaction`

*Defined in [transaction.ts:78](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L78)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transaction | [AllTransactions](_transaction_.md#alltransactions) |
| signature | [Signature](_utils_key_pair_.md#signature) |

**Returns:** `SignedTransaction`

___
<a id="stake"></a>

##  stake

▸ **stake**(nonce: *`number`*, originator: *`string`*, amount: *`bigint`*, publicKey: *`string`*): `StakeTransaction`

*Defined in [transaction.ts:53](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L53)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| originator | `string` |
| amount | `bigint` |
| publicKey | `string` |

**Returns:** `StakeTransaction`

___
<a id="swapkey"></a>

##  swapKey

▸ **swapKey**(nonce: *`number`*, originator: *`string`*, curKey: *`string`*, newKey: *`string`*): `SwapKeyTransaction`

*Defined in [transaction.ts:57](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L57)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| nonce | `number` |
| originator | `string` |
| curKey | `string` |
| newKey | `string` |

**Returns:** `SwapKeyTransaction`

___

# Object literals

<a id="transaction_field_map"></a>

## `<Const>` TRANSACTION_FIELD_MAP

**TRANSACTION_FIELD_MAP**: *`object`*

*Defined in [transaction.ts:15](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L15)*

<a id="transaction_field_map.__computed"></a>

###  __computed

**● __computed**: *`string`* = "deleteKey"

*Defined in [transaction.ts:16](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L16)*
*Defined in [transaction.ts:17](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L17)*
*Defined in [transaction.ts:18](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L18)*
*Defined in [transaction.ts:19](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L19)*
*Defined in [transaction.ts:20](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L20)*
*Defined in [transaction.ts:21](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L21)*
*Defined in [transaction.ts:22](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L22)*
*Defined in [transaction.ts:23](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/transaction.ts#L23)*

___

___

