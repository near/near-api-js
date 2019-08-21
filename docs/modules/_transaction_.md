

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

### Object literals

* [SCHEMA](_transaction_.md#schema)

---

# Functions

<a id="addkey-1"></a>

##  addKey

▸ **addKey**(publicKey: *`string`*, accessKey: *[AccessKey](../classes/_transaction_.accesskey.md)*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:88](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L88)*

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

*Defined in [transaction.ts:68](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L68)*

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="deleteaccount-1"></a>

##  deleteAccount

▸ **deleteAccount**(beneficiaryId: *`string`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:96](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L96)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| beneficiaryId | `string` |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="deletekey-1"></a>

##  deleteKey

▸ **deleteKey**(publicKey: *`string`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:92](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L92)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `string` |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="deploycontract-1"></a>

##  deployContract

▸ **deployContract**(code: *`Uint8Array`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:72](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L72)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| code | `Uint8Array` |

**Returns:** [Action](../classes/_transaction_.action.md)

___
<a id="fullaccesskey"></a>

##  fullAccessKey

▸ **fullAccessKey**(): [AccessKey](../classes/_transaction_.accesskey.md)

*Defined in [transaction.ts:49](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L49)*

**Returns:** [AccessKey](../classes/_transaction_.accesskey.md)

___
<a id="functioncall-1"></a>

##  functionCall

▸ **functionCall**(methodName: *`string`*, args: *`Uint8Array`*, gas: *`number`*, deposit: *`BN`*): [Action](../classes/_transaction_.action.md)

*Defined in [transaction.ts:76](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L76)*

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

*Defined in [transaction.ts:53](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L53)*

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

*Defined in [transaction.ts:193](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L193)*

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

*Defined in [transaction.ts:84](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L84)*

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

*Defined in [transaction.ts:80](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L80)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| deposit | `BN` |

**Returns:** [Action](../classes/_transaction_.action.md)

___

# Object literals

<a id="schema"></a>

## `<Const>` SCHEMA

**SCHEMA**: *`object`*

*Defined in [transaction.ts:152](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L152)*

<a id="schema.accesskey-1"></a>

###  AccessKey

**AccessKey**: *`object`*

*Defined in [transaction.ts:159](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L159)*

<a id="schema.accesskey-1.fields"></a>

###  fields

**● fields**: *(`string` \| [AccessKeyPermission](../classes/_transaction_.accesskeypermission.md))[][]* =  [
        ['nonce', 'u64'],
        ['permission', AccessKeyPermission],
    ]

*Defined in [transaction.ts:159](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L159)*

___
<a id="schema.accesskey-1.kind"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:159](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L159)*

___

___
<a id="schema.accesskeypermission-1"></a>

###  AccessKeyPermission

**AccessKeyPermission**: *`object`*

*Defined in [transaction.ts:163](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L163)*

<a id="schema.accesskeypermission-1.field"></a>

###  field

**● field**: *`string`* = "enum"

*Defined in [transaction.ts:163](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L163)*

___
<a id="schema.accesskeypermission-1.kind-1"></a>

###  kind

**● kind**: *`string`* = "enum"

*Defined in [transaction.ts:163](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L163)*

___
<a id="schema.accesskeypermission-1.values"></a>

###  values

**● values**: *(`string` \| [FullAccessPermission](../classes/_transaction_.fullaccesspermission.md))[][]* =  [
        ['functionCall', FunctionCallPermission],
        ['fullAccess', FullAccessPermission],
    ]

*Defined in [transaction.ts:163](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L163)*

___

___
<a id="schema.action-1"></a>

###  Action

**Action**: *`object`*

*Defined in [transaction.ts:173](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L173)*

<a id="schema.action-1.field-1"></a>

###  field

**● field**: *`string`* = "enum"

*Defined in [transaction.ts:173](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L173)*

___
<a id="schema.action-1.kind-2"></a>

###  kind

**● kind**: *`string`* = "enum"

*Defined in [transaction.ts:173](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L173)*

___
<a id="schema.action-1.values-1"></a>

###  values

**● values**: *((`string` \| [CreateAccount](../classes/_transaction_.createaccount.md))[] \| (`string` \| [functionCall](_transaction_.md#functioncall-1))[] \| (`string` \| [stake](_transaction_.md#stake-1))[] \| (`string` \| [addKey](_transaction_.md#addkey-1))[])[]* =  [
        ['createAccount', CreateAccount],
        ['deployContract', DeployContract],
        ['functionCall', functionCall],
        ['transfer', transfer],
        ['stake', stake],
        ['addKey', addKey],
        ['deleteKey', deleteKey],
        ['deleteAccount', deleteAccount],
    ]

*Defined in [transaction.ts:173](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L173)*

___

___
<a id="schema.addkey-2"></a>

###  AddKey

**AddKey**: *`object`*

*Defined in [transaction.ts:188](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L188)*

<a id="schema.addkey-2.fields-1"></a>

###  fields

**● fields**: *((`string` \| [PublicKey](../classes/_transaction_.publickey.md))[] \| (`string` \| [AccessKey](../classes/_transaction_.accesskey.md))[])[]* =  [['publicKey', PublicKey], ['accessKey', AccessKey]]

*Defined in [transaction.ts:188](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L188)*

___
<a id="schema.addkey-2.kind-3"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:188](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L188)*

___

___
<a id="schema.createaccount-2"></a>

###  CreateAccount

**CreateAccount**: *`object`*

*Defined in [transaction.ts:183](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L183)*

<a id="schema.createaccount-2.fields-2"></a>

###  fields

**● fields**: *`undefined`[]* =  []

*Defined in [transaction.ts:183](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L183)*

___
<a id="schema.createaccount-2.kind-4"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:183](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L183)*

___

___
<a id="schema.deleteaccount-2"></a>

###  DeleteAccount

**DeleteAccount**: *`object`*

*Defined in [transaction.ts:190](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L190)*

<a id="schema.deleteaccount-2.fields-3"></a>

###  fields

**● fields**: *`string`[][]* =  [['beneficiaryId', 'string']]

*Defined in [transaction.ts:190](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L190)*

___
<a id="schema.deleteaccount-2.kind-5"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:190](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L190)*

___

___
<a id="schema.deletekey-2"></a>

###  DeleteKey

**DeleteKey**: *`object`*

*Defined in [transaction.ts:189](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L189)*

<a id="schema.deletekey-2.fields-4"></a>

###  fields

**● fields**: *(`string` \| [PublicKey](../classes/_transaction_.publickey.md))[][]* =  [['publicKey', PublicKey]]

*Defined in [transaction.ts:189](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L189)*

___
<a id="schema.deletekey-2.kind-6"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:189](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L189)*

___

___
<a id="schema.deploycontract-2"></a>

###  DeployContract

**DeployContract**: *`object`*

*Defined in [transaction.ts:184](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L184)*

<a id="schema.deploycontract-2.fields-5"></a>

###  fields

**● fields**: *(`string` \| `string`[])[][]* =  [['code', ['u8']]]

*Defined in [transaction.ts:184](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L184)*

___
<a id="schema.deploycontract-2.kind-7"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:184](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L184)*

___

___
<a id="schema.fullaccesspermission-1"></a>

###  FullAccessPermission

**FullAccessPermission**: *`object`*

*Defined in [transaction.ts:172](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L172)*

<a id="schema.fullaccesspermission-1.fields-6"></a>

###  fields

**● fields**: *`undefined`[]* =  []

*Defined in [transaction.ts:172](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L172)*

___
<a id="schema.fullaccesspermission-1.kind-8"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:172](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L172)*

___

___
<a id="schema.functioncall-2"></a>

###  FunctionCall

**FunctionCall**: *`object`*

*Defined in [transaction.ts:185](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L185)*

<a id="schema.functioncall-2.fields-7"></a>

###  fields

**● fields**: *(`string` \| `string`[])[][]* =  [['methodName', 'string'], ['args', ['u8']], ['gas', 'u64'], ['deposit', 'u128']]

*Defined in [transaction.ts:185](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L185)*

___
<a id="schema.functioncall-2.kind-9"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:185](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L185)*

___

___
<a id="schema.functioncallpermission-1"></a>

###  FunctionCallPermission

**FunctionCallPermission**: *`object`*

*Defined in [transaction.ts:167](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L167)*

<a id="schema.functioncallpermission-1.fields-8"></a>

###  fields

**● fields**: *((`string` \| `object`)[] \| (`string` \| `string`[])[])[]* =  [
        ['allowance', {kind: 'option', type: 'u128'}],
        ['receiverId', 'string'],
        ['methodNames', ['string']],
    ]

*Defined in [transaction.ts:167](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L167)*

___
<a id="schema.functioncallpermission-1.kind-10"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:167](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L167)*

___

___
<a id="schema.publickey-1"></a>

###  PublicKey

**PublicKey**: *`object`*

*Defined in [transaction.ts:157](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L157)*

<a id="schema.publickey-1.fields-9"></a>

###  fields

**● fields**: *(`string` \| `number`[])[][]* =  [['keyType', 'u8'], ['data', [32]]]

*Defined in [transaction.ts:158](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L158)*

___
<a id="schema.publickey-1.kind-11"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:158](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L158)*

___

___
<a id="schema.signature-1"></a>

###  Signature

**Signature**: *`object`*

*Defined in [transaction.ts:153](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L153)*

<a id="schema.signature-1.fields-10"></a>

###  fields

**● fields**: *(`string` \| `number`[])[][]* =  [['keyType', 'u8'], ['data', [32]]]

*Defined in [transaction.ts:153](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L153)*

___
<a id="schema.signature-1.kind-12"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:153](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L153)*

___

___
<a id="schema.signedtransaction-1"></a>

###  SignedTransaction

**SignedTransaction**: *`object`*

*Defined in [transaction.ts:154](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L154)*

<a id="schema.signedtransaction-1.fields-11"></a>

###  fields

**● fields**: *((`string` \| [Transaction](../classes/_transaction_.transaction.md))[] \| (`string` \| [Signature](../classes/_transaction_.signature.md))[])[]* =  [['transaction', Transaction], ['signature', Signature]]

*Defined in [transaction.ts:154](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L154)*

___
<a id="schema.signedtransaction-1.kind-13"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:154](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L154)*

___

___
<a id="schema.stake-2"></a>

###  Stake

**Stake**: *`object`*

*Defined in [transaction.ts:187](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L187)*

<a id="schema.stake-2.fields-12"></a>

###  fields

**● fields**: *(`string` \| [PublicKey](../classes/_transaction_.publickey.md))[][]* =  [['stake', 'u128'], ['publicKey', PublicKey]]

*Defined in [transaction.ts:187](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L187)*

___
<a id="schema.stake-2.kind-14"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:187](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L187)*

___

___
<a id="schema.transaction-1"></a>

###  Transaction

**Transaction**: *`object`*

*Defined in [transaction.ts:155](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L155)*

<a id="schema.transaction-1.fields-13"></a>

###  fields

**● fields**: *((`string` \| [PublicKey](../classes/_transaction_.publickey.md))[] \| (`string` \| [Action](../classes/_transaction_.action.md)[])[])[]* =  [['signerId', 'string'], ['publicKey', PublicKey], ['nonce', 'u64'], ['receiverId', 'string'], ['actions', [Action]]]

*Defined in [transaction.ts:156](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L156)*

___
<a id="schema.transaction-1.kind-15"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:156](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L156)*

___

___
<a id="schema.transfer-2"></a>

###  Transfer

**Transfer**: *`object`*

*Defined in [transaction.ts:186](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L186)*

<a id="schema.transfer-2.fields-14"></a>

###  fields

**● fields**: *`string`[][]* =  [['deposit', 'u128']]

*Defined in [transaction.ts:186](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L186)*

___
<a id="schema.transfer-2.kind-16"></a>

###  kind

**● kind**: *`string`* = "struct"

*Defined in [transaction.ts:186](https://github.com/nearprotocol/nearlib/blob/01b260c/src.ts/transaction.ts#L186)*

___

___

___

