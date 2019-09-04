

# Index

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
    [Signature, {kind: 'struct', fields: [
        ['keyType', 'u8'],
        ['data', [32]]
    ]}],
    [SignedTransaction, {kind: 'struct', fields: [
        ['transaction', Transaction],
        ['signature', Signature]
    ]}],
    [Transaction, { kind: 'struct', fields: [
        ['signerId', 'string'],
        ['publicKey', PublicKey],
        ['nonce', 'u64'],
        ['receiverId', 'string'],
        ['blockHash', [32]],
        ['actions', [Action]]
    ]}],
    [PublicKey, { kind: 'struct', fields: [
        ['keyType', 'u8'],
        ['data', [32]]
    ]}],
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
    [DeployContract, { kind: 'struct', fields: [
        ['code', ['u8']]
    ]}],
    [FunctionCall, { kind: 'struct', fields: [
        ['methodName', 'string'],
        ['args', ['u8']],
        ['gas', 'u64'],
        ['deposit', 'u128']
    ]}],
    [Transfer, { kind: 'struct', fields: [
        ['deposit', 'u128']
    ]}],
    [Stake, { kind: 'struct', fields: [
        ['stake', 'u128'],
        ['publicKey', PublicKey]
    ]}],
    [AddKey, { kind: 'struct', fields: [
        ['publicKey', PublicKey],
        ['accessKey', AccessKey]
    ]}],
    [DeleteKey, { kind: 'struct', fields: [
        ['publicKey', PublicKey]
    ]}],
    [DeleteAccount, { kind: 'struct', fields: [
        ['beneficiaryId', 'string']
    ]}],
])

*Defined in [transaction.ts:140](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/transaction.ts#L140)*

___

# Functions

<a id="addkey-1"></a>

##  addKey

▸ **addKey**(publicKey: *[PublicKey](../classes/_utils_key_pair_.publickey.md)*, accessKey: *[AccessKey](../classes/_transaction_.accesskey.md)*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:89](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/transaction.ts#L89)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | [PublicKey](../classes/_utils_key_pair_.publickey.md) |
| accessKey | [AccessKey](../classes/_transaction_.accesskey.md) |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="createaccount-1"></a>

##  createAccount

▸ **createAccount**(): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:69](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/transaction.ts#L69)*

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="deleteaccount-1"></a>

##  deleteAccount

▸ **deleteAccount**(beneficiaryId: *`string`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:97](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/transaction.ts#L97)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| beneficiaryId | `string` |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="deletekey-1"></a>

##  deleteKey

▸ **deleteKey**(publicKey: *[PublicKey](../classes/_utils_key_pair_.publickey.md)*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:93](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/transaction.ts#L93)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | [PublicKey](../classes/_utils_key_pair_.publickey.md) |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="deploycontract-1"></a>

##  deployContract

▸ **deployContract**(code: *`Uint8Array`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:73](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/transaction.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| code | `Uint8Array` |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="fullaccesskey"></a>

##  fullAccessKey

▸ **fullAccessKey**(): [AccessKey](../classes/_transaction_.accesskey.md)

*Defined in [transaction.ts:50](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/transaction.ts#L50)*

**Returns:** [AccessKey](../classes/_transaction_.accesskey.md)

___
<a id="functioncall-1"></a>

##  functionCall

▸ **functionCall**(methodName: *`string`*, args: *`Uint8Array`*, gas: *`number`*, deposit: *`BN`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:77](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/transaction.ts#L77)*

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

*Defined in [transaction.ts:54](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/transaction.ts#L54)*

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

▸ **signTransaction**(receiverId: *`string`*, nonce: *`number`*, actions: *[Action](../classes/_transaction_.action.md)[]*, blockHash: *`Uint8Array`*, signer: *[Signer](../classes/_signer_.signer.md)*, accountId?: *`string`*, networkId?: *`string`*): `Promise`<[`Uint8Array`, [SignedTransaction](../classes/_transaction_.signedtransaction.md)]>

*Defined in [transaction.ts:214](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/transaction.ts#L214)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| receiverId | `string` |
| nonce | `number` |
| actions | [Action](../classes/_transaction_.action.md)[] |
| blockHash | `Uint8Array` |
| signer | [Signer](../classes/_signer_.signer.md) |
| `Optional` accountId | `string` |
| `Optional` networkId | `string` |

**Returns:** `Promise`<[`Uint8Array`, [SignedTransaction](../classes/_transaction_.signedtransaction.md)]>

___
<a id="stake-1"></a>

##  stake

▸ **stake**(stake: *`BN`*, publicKey: *[PublicKey](../classes/_utils_key_pair_.publickey.md)*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:85](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/transaction.ts#L85)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| stake | `BN` |
| publicKey | [PublicKey](../classes/_utils_key_pair_.publickey.md) |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="transfer-1"></a>

##  transfer

▸ **transfer**(deposit: *`BN`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:81](https://github.com/nearprotocol/nearlib/blob/c7aee6f/src.ts/transaction.ts#L81)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| deposit | `BN` |

**Returns:** [Action](../classes/_transaction_.action.md)

___

