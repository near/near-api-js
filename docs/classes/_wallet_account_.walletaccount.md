

# Hierarchy

**WalletAccount**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new WalletAccount**(networkId: *`string`*, appKeyPrefix: *`string`*, walletBaseUrl?: *`string`*, keyStore?: *[KeyStore](_key_stores_keystore_.keystore.md)*): [WalletAccount](_wallet_account_.walletaccount.md)

*Defined in [wallet-account.ts:16](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/wallet-account.ts#L16)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| networkId | `string` | - |
| appKeyPrefix | `string` | - |
| `Default value` walletBaseUrl | `string` | &quot;https://wallet.nearprotocol.com&quot; |
| `Default value` keyStore | [KeyStore](_key_stores_keystore_.keystore.md) |  new BrowserLocalStorageKeyStore() |

**Returns:** [WalletAccount](_wallet_account_.walletaccount.md)

___

# Properties

<a id="_authdata"></a>

##  _authData

**● _authData**: *`any`*

*Defined in [wallet-account.ts:15](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/wallet-account.ts#L15)*

___
<a id="_authdatakey"></a>

##  _authDataKey

**● _authDataKey**: *`string`*

*Defined in [wallet-account.ts:13](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/wallet-account.ts#L13)*

___
<a id="_keystore"></a>

##  _keyStore

**● _keyStore**: *[KeyStore](_key_stores_keystore_.keystore.md)*

*Defined in [wallet-account.ts:14](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/wallet-account.ts#L14)*

___
<a id="_networkid"></a>

##  _networkId

**● _networkId**: *`string`*

*Defined in [wallet-account.ts:16](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/wallet-account.ts#L16)*

___
<a id="_walletbaseurl"></a>

##  _walletBaseUrl

**● _walletBaseUrl**: *`string`*

*Defined in [wallet-account.ts:12](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/wallet-account.ts#L12)*

___

# Methods

<a id="_completesigninwithaccesskey"></a>

##  _completeSignInWithAccessKey

▸ **_completeSignInWithAccessKey**(): `void`

*Defined in [wallet-account.ts:80](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/wallet-account.ts#L80)*

Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.

**Returns:** `void`

___
<a id="_movekeyfromtemptopermanent"></a>

##  _moveKeyFromTempToPermanent

▸ **_moveKeyFromTempToPermanent**(accountId: *`string`*, publicKey: *`string`*): `Promise`<`void`>

*Defined in [wallet-account.ts:93](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/wallet-account.ts#L93)*

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

*Defined in [wallet-account.ts:44](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/wallet-account.ts#L44)*

Returns authorized Account ID.

*__example__*: walletAccount.getAccountId();

**Returns:** `any`

___
<a id="issignedin"></a>

##  isSignedIn

▸ **isSignedIn**(): `boolean`

*Defined in [wallet-account.ts:35](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/wallet-account.ts#L35)*

Returns true, if this WalletAccount is authorized with the wallet.

*__example__*: walletAccount.isSignedIn();

**Returns:** `boolean`

___
<a id="requestsignin"></a>

##  requestSignIn

▸ **requestSignIn**(contract_id: *`string`*, title: *`string`*, success_url: *`string`*, failure_url: *`string`*): `void`

*Defined in [wallet-account.ts:61](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/wallet-account.ts#L61)*

Redirects current page to the wallet authentication page.

*__example__*: walletAccount.requestSignIn( myContractId, title, onSuccessHref, onFailureHref);

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| contract_id | `string` |  contract ID of the application |
| title | `string` |  name of the application |
| success_url | `string` |  url to redirect on success |
| failure_url | `string` |  url to redirect on failure |

**Returns:** `void`

___
<a id="signout"></a>

##  signOut

▸ **signOut**(): `void`

*Defined in [wallet-account.ts:104](https://github.com/nearprotocol/nearlib/blob/18d2703/src.ts/wallet-account.ts#L104)*

Sign out from the current account

*__example__*: walletAccount.signOut();

**Returns:** `void`

___

