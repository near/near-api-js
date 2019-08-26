

# Index

### Enumerations

* [KeyType](../enums/_transaction_.keytype.md)

### Classes

* [AccessKey](../classes/_transaction_.accesskey.md)
* [AccessKeyPermission](../classes/_transaction_.accesskeypermission.md)
* [Action](../classes/_transaction_.action.md)
* [AddKey](../classes/_transaction_.addkey.md)
* [Assignable](../classes/_transaction_.assignable.md)
* [CreateAccount](../classes/_transaction_.createaccount.md)
* [DeleteAccount](../classes/_transaction_.deleteaccount.md)
* [DeleteKey](../classes/_transaction_.deletekey.md)
* [DeployContract](../classes/_transaction_.deploycontract.md)
* [Enum](../classes/_transaction_.enum.md)
* [FullAccessPermission](../classes/_transaction_.fullaccesspermission.md)
* [FunctionCall](../classes/_transaction_.functioncall.md)
* [FunctionCallPermission](../classes/_transaction_.functioncallpermission.md)
* [IAction](../classes/_transaction_.iaction.md)
* [PublicKey](../classes/_transaction_.publickey.md)
* [Signature](../classes/_transaction_.signature.md)
* [SignedTransaction](../classes/_transaction_.signedtransaction.md)
* [Stake](../classes/_transaction_.stake.md)
* [Transaction](../classes/_transaction_.transaction.md)
* [Transfer](../classes/_transaction_.transfer.md)

### Variables

* [SCHEMA](_transaction_.md#schema)

### Functions

* [addKey](_transaction_.md#addkey-1)
* [createAccount](_transaction_.md#createaccount-1)
* [deleteAccount](_transaction_.md#deleteaccount-1)
* [deleteKey](_transaction_.md#deletekey-1)
* [deployContract](_transaction_.md#deploycontract-1)
* [fullAccessKey](_transaction_.md#fullaccesskey)
* [functionCall](_transaction_.md#functioncall-1)
* [functionCallAccessKey](_transaction_.md#functioncallaccesskey)
* [signTransaction](_transaction_.md#signtransaction)
* [stake](_transaction_.md#stake-1)
* [transfer](_transaction_.md#transfer-1)

---

# Variables

<a id="schema"></a>

## `<Const>` SCHEMA

**● SCHEMA**: *`Map`<`Function`, `any`>* =  new Map<Function, any>([
    [Signature, {kind: 'struct', fields: [['keyType', 'u8'], ['data', [32]]]}],
    [SignedTransaction, {kind: 'struct', fields: [['transaction', Transaction], ['signature', Signature]]}],
    [Transaction, { kind: 'struct', fields: [['signerId', 'string'], ['publicKey', PublicKey], ['nonce', 'u64'], ['receiverId', 'string'], ['actions', [Action]]] }],
    [PublicKey, {
            kind: 'struct', fields: [['keyType', 'u8'], ['data', [32]]] }],
    [AccessKey, { kind: 'struct', fields: [
        ['nonce', 'u64'],
        ['permission', AccessKeyPermission],
    ]}],
    [AccessKeyPermission, {kind: 'enum', field: 'enum', values: [
        ['functionCall', FunctionCallPermission],
        ['fullAccess', FullAccessPermission],
    ]}],
    [FunctionCallPermission, {kind: 'struct', fields: [
        ['allowance', {kind: 'option', type: 'u128'}],
        ['receiverId', 'string'],
        ['methodNames', ['string']],
    ]}],
    [FullAccessPermission, {kind: 'struct', fields: []}],
    [Action, {kind: 'enum', field: 'enum', values: [
        ['createAccount', CreateAccount],
        ['deployContract', DeployContract],
        ['functionCall', functionCall],
        ['transfer', transfer],
        ['stake', stake],
        ['addKey', addKey],
        ['deleteKey', deleteKey],
        ['deleteAccount', deleteAccount],
    ]}],
    [CreateAccount, { kind: 'struct', fields: [] }],
    [DeployContract, { kind: 'struct', fields: [['code', ['u8']]] }],
    [FunctionCall, { kind: 'struct', fields: [['methodName', 'string'], ['args', ['u8']], ['gas', 'u64'], ['deposit', 'u128']] }],
    [Transfer, { kind: 'struct', fields: [['deposit', 'u128']] }],
    [Stake, { kind: 'struct', fields: [['stake', 'u128'], ['publicKey', PublicKey]] }],
    [AddKey, { kind: 'struct', fields: [['publicKey', PublicKey], ['accessKey', AccessKey]] }],
    [DeleteKey, { kind: 'struct', fields: [['publicKey', PublicKey]] }],
    [DeleteAccount, { kind: 'struct', fields: [['beneficiaryId', 'string']] }],
])

*Defined in [transaction.ts:152](https://github.com/nearprotocol/nearlib/blob/b17214a/src.ts/transaction.ts#L152)*

___

# Functions

<a id="addkey-1"></a>

##  addKey

▸ **addKey**(publicKey: *`string`*, accessKey: *[AccessKey](../classes/_transaction_.accesskey.md)*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:88](https://github.com/nearprotocol/nearlib/blob/b17214a/src.ts/transaction.ts#L88)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |
| accessKey | [AccessKey](../classes/_transaction_.accesskey.md) |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="createaccount-1"></a>

##  createAccount

▸ **createAccount**(): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:68](https://github.com/nearprotocol/nearlib/blob/b17214a/src.ts/transaction.ts#L68)*

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="deleteaccount-1"></a>

##  deleteAccount

▸ **deleteAccount**(beneficiaryId: *`string`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:96](https://github.com/nearprotocol/nearlib/blob/b17214a/src.ts/transaction.ts#L96)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| beneficiaryId | `string` |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="deletekey-1"></a>

##  deleteKey

▸ **deleteKey**(publicKey: *`string`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:92](https://github.com/nearprotocol/nearlib/blob/b17214a/src.ts/transaction.ts#L92)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="deploycontract-1"></a>

##  deployContract

▸ **deployContract**(code: *`Uint8Array`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:72](https://github.com/nearprotocol/nearlib/blob/b17214a/src.ts/transaction.ts#L72)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| code | `Uint8Array` |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="fullaccesskey"></a>

##  fullAccessKey

▸ **fullAccessKey**(): [AccessKey](../classes/_transaction_.accesskey.md)

*Defined in [transaction.ts:49](https://github.com/nearprotocol/nearlib/blob/b17214a/src.ts/transaction.ts#L49)*

**Returns:** [AccessKey](../classes/_transaction_.accesskey.md)

___
<a id="functioncall-1"></a>

##  functionCall

▸ **functionCall**(methodName: *`string`*, args: *`Uint8Array`*, gas: *`number`*, deposit: *`BN`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:76](https://github.com/nearprotocol/nearlib/blob/b17214a/src.ts/transaction.ts#L76)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| methodName | `string` |
| args | `Uint8Array` |
| gas | `number` |
| deposit | `BN` |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="functioncallaccesskey"></a>

##  functionCallAccessKey

▸ **functionCallAccessKey**(receiverId: *`string`*, methodNames: *`String`[]*, allowance?: *`BN`*): [AccessKey](../classes/_transaction_.accesskey.md)

*Defined in [transaction.ts:53](https://github.com/nearprotocol/nearlib/blob/b17214a/src.ts/transaction.ts#L53)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| receiverId | `string` |
| methodNames | `String`[] |
| `Optional` allowance | `BN` |

**Returns:** [AccessKey](../classes/_transaction_.accesskey.md)

___
<a id="signtransaction"></a>

##  signTransaction

▸ **signTransaction**(receiverId: *`string`*, nonce: *`number`*, actions: *[Action](../classes/_transaction_.action.md)[]*, signer: *[Signer](../classes/_signer_.signer.md)*, accountId?: *`string`*, networkId?: *`string`*): `Promise`<[`Uint8Array`, [SignedTransaction](../classes/_transaction_.signedtransaction.md)]>

*Defined in [transaction.ts:192](https://github.com/nearprotocol/nearlib/blob/b17214a/src.ts/transaction.ts#L192)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| receiverId | `string` |
| nonce | `number` |
| actions | [Action](../classes/_transaction_.action.md)[] |
| signer | [Signer](../classes/_signer_.signer.md) |
| `Optional` accountId | `string` |
| `Optional` networkId | `string` |

**Returns:** `Promise`<[`Uint8Array`, [SignedTransaction](../classes/_transaction_.signedtransaction.md)]>

___
<a id="stake-1"></a>

##  stake

▸ **stake**(stake: *`BN`*, publicKey: *`string`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:84](https://github.com/nearprotocol/nearlib/blob/b17214a/src.ts/transaction.ts#L84)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| stake | `BN` |
| publicKey | `string` |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="transfer-1"></a>

##  transfer

▸ **transfer**(deposit: *`BN`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:80](https://github.com/nearprotocol/nearlib/blob/b17214a/src.ts/transaction.ts#L80)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| deposit | `BN` |

**Returns:** [Action](../classes/_transaction_.action.md)

___

