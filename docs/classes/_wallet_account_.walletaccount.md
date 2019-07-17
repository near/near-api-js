

# Hierarchy

**WalletAccount**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new WalletAccount**(near: *[Near](_near_.near.md)*, appKeyPrefix: *`string` \| `null`*): [WalletAccount](_wallet_account_.walletaccount.md)

*Defined in [wallet-account.ts:18](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/wallet-account.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| near | [Near](_near_.near.md) |
| appKeyPrefix | `string` \| `null` |

**Returns:** [WalletAccount](_wallet_account_.walletaccount.md)

___

# Properties

<a id="_authdata"></a>

##  _authData

**● _authData**: *`any`*

*Defined in [wallet-account.ts:17](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/wallet-account.ts#L17)*

___
<a id="_authdatakey"></a>

##  _authDataKey

**● _authDataKey**: *`string`*

*Defined in [wallet-account.ts:15](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/wallet-account.ts#L15)*

___
<a id="_keystore"></a>

##  _keyStore

**● _keyStore**: *[KeyStore](_key_stores_keystore_.keystore.md)*

*Defined in [wallet-account.ts:16](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/wallet-account.ts#L16)*

___
<a id="_networkid"></a>

##  _networkId

**● _networkId**: *`string`*

*Defined in [wallet-account.ts:18](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/wallet-account.ts#L18)*

___
<a id="_walletbaseurl"></a>

##  _walletBaseUrl

**● _walletBaseUrl**: *`string`*

*Defined in [wallet-account.ts:14](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/wallet-account.ts#L14)*

___

# Methods

<a id="_completesigninwithaccesskey"></a>

##  _completeSignInWithAccessKey

▸ **_completeSignInWithAccessKey**(): `Promise`<`void`>

*Defined in [wallet-account.ts:84](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/wallet-account.ts#L84)*

Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.

**Returns:** `Promise`<`void`>

___
<a id="_movekeyfromtemptopermanent"></a>

##  _moveKeyFromTempToPermanent

▸ **_moveKeyFromTempToPermanent**(accountId: *`string`*, publicKey: *`string`*): `Promise`<`void`>

*Defined in [wallet-account.ts:97](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/wallet-account.ts#L97)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| accountId | `string` |
| publicKey | `string` |

**Returns:** `Promise`<`void`>

___
<a id="getaccountid"></a>

##  getAccountId

▸ **getAccountId**(): `any`

*Defined in [wallet-account.ts:46](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/wallet-account.ts#L46)*

Returns authorized Account ID.

*__example__*: walletAccount.getAccountId();

**Returns:** `any`

___
<a id="issignedin"></a>

##  isSignedIn

▸ **isSignedIn**(): `boolean`

*Defined in [wallet-account.ts:37](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/wallet-account.ts#L37)*

Returns true, if this WalletAccount is authorized with the wallet.

*__example__*: walletAccount.isSignedIn();

**Returns:** `boolean`

___
<a id="requestsignin"></a>

##  requestSignIn

▸ **requestSignIn**(contractId: *`string`*, title: *`string`*, successUrl: *`string`*, failureUrl: *`string`*): `Promise`<`void`>

*Defined in [wallet-account.ts:63](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/wallet-account.ts#L63)*

Redirects current page to the wallet authentication page.

*__example__*: walletAccount.requestSignIn( myContractId, title, onSuccessHref, onFailureHref);

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| contractId | `string` |  contract ID of the application |
| title | `string` |  name of the application |
| successUrl | `string` |  url to redirect on success |
| failureUrl | `string` |  url to redirect on failure |

**Returns:** `Promise`<`void`>

___
<a id="signout"></a>

##  signOut

▸ **signOut**(): `void`

*Defined in [wallet-account.ts:108](https://github.com/nearprotocol/nearlib/blob/7880ebf/src.ts/wallet-account.ts#L108)*

Sign out from the current account

*__example__*: walletAccount.signOut();

**Returns:** `void`

___

