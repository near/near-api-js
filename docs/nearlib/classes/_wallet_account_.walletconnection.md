---
id: "_wallet_account_.walletconnection"
title: "WalletConnection"
sidebar_label: "WalletConnection"
---

## Hierarchy

* **WalletConnection**

## Index

### Constructors

* [constructor](_wallet_account_.walletconnection.md#constructor)

### Properties

* [_authData](_wallet_account_.walletconnection.md#_authdata)
* [_authDataKey](_wallet_account_.walletconnection.md#_authdatakey)
* [_connectedAccount](_wallet_account_.walletconnection.md#_connectedaccount)
* [_keyStore](_wallet_account_.walletconnection.md#_keystore)
* [_near](_wallet_account_.walletconnection.md#_near)
* [_networkId](_wallet_account_.walletconnection.md#_networkid)
* [_walletBaseUrl](_wallet_account_.walletconnection.md#_walletbaseurl)

### Methods

* [_completeSignInWithAccessKey](_wallet_account_.walletconnection.md#_completesigninwithaccesskey)
* [_moveKeyFromTempToPermanent](_wallet_account_.walletconnection.md#_movekeyfromtemptopermanent)
* [account](_wallet_account_.walletconnection.md#account)
* [getAccountId](_wallet_account_.walletconnection.md#getaccountid)
* [isSignedIn](_wallet_account_.walletconnection.md#issignedin)
* [requestSignIn](_wallet_account_.walletconnection.md#requestsignin)
* [requestSignTransactions](_wallet_account_.walletconnection.md#requestsigntransactions)
* [signOut](_wallet_account_.walletconnection.md#signout)

## Constructors

###  constructor

\+ **new WalletConnection**(`near`: [Near](_near_.near.md), `appKeyPrefix`: string | null): *[WalletConnection](_wallet_account_.walletconnection.md)*

*Defined in [src.ts/wallet-account.ts:26](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`near` | [Near](_near_.near.md) |
`appKeyPrefix` | string &#124; null |

**Returns:** *[WalletConnection](_wallet_account_.walletconnection.md)*

## Properties

###  _authData

• **_authData**: *any*

*Defined in [src.ts/wallet-account.ts:22](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L22)*

___

###  _authDataKey

• **_authDataKey**: *string*

*Defined in [src.ts/wallet-account.ts:20](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L20)*

___

###  _connectedAccount

• **_connectedAccount**: *[ConnectedWalletAccount](_wallet_account_.connectedwalletaccount.md)*

*Defined in [src.ts/wallet-account.ts:26](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L26)*

___

###  _keyStore

• **_keyStore**: *[KeyStore](_key_stores_keystore_.keystore.md)*

*Defined in [src.ts/wallet-account.ts:21](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L21)*

___

###  _near

• **_near**: *[Near](_near_.near.md)*

*Defined in [src.ts/wallet-account.ts:25](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L25)*

___

###  _networkId

• **_networkId**: *string*

*Defined in [src.ts/wallet-account.ts:23](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L23)*

___

###  _walletBaseUrl

• **_walletBaseUrl**: *string*

*Defined in [src.ts/wallet-account.ts:19](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L19)*

## Methods

###  _completeSignInWithAccessKey

▸ **_completeSignInWithAccessKey**(): *Promise‹void›*

*Defined in [src.ts/wallet-account.ts:108](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L108)*

Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.

**Returns:** *Promise‹void›*

___

###  _moveKeyFromTempToPermanent

▸ **_moveKeyFromTempToPermanent**(`accountId`: string, `publicKey`: string): *Promise‹void›*

*Defined in [src.ts/wallet-account.ts:128](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`accountId` | string |
`publicKey` | string |

**Returns:** *Promise‹void›*

___

###  account

▸ **account**(): *[ConnectedWalletAccount](_wallet_account_.connectedwalletaccount.md)‹›*

*Defined in [src.ts/wallet-account.ts:144](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L144)*

**Returns:** *[ConnectedWalletAccount](_wallet_account_.connectedwalletaccount.md)‹›*

___

###  getAccountId

▸ **getAccountId**(): *any*

*Defined in [src.ts/wallet-account.ts:57](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L57)*

Returns authorized Account ID.

**`example`** 
walletAccount.getAccountId();

**Returns:** *any*

___

###  isSignedIn

▸ **isSignedIn**(): *boolean*

*Defined in [src.ts/wallet-account.ts:48](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L48)*

Returns true, if this WalletAccount is authorized with the wallet.

**`example`** 
walletAccount.isSignedIn();

**Returns:** *boolean*

___

###  requestSignIn

▸ **requestSignIn**(`contractId`: string, `title`: string, `successUrl`: string, `failureUrl`: string): *Promise‹void›*

*Defined in [src.ts/wallet-account.ts:74](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L74)*

Redirects current page to the wallet authentication page.

**`example`** 
  walletAccount.requestSignIn(
    myContractId,
    title,
    onSuccessHref,
    onFailureHref);

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`contractId` | string | contract ID of the application |
`title` | string | name of the application |
`successUrl` | string | url to redirect on success |
`failureUrl` | string | url to redirect on failure |

**Returns:** *Promise‹void›*

___

###  requestSignTransactions

▸ **requestSignTransactions**(`transactions`: [Transaction](_transaction_.transaction.md)[], `callbackUrl?`: string): *Promise‹void›*

*Defined in [src.ts/wallet-account.ts:92](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`transactions` | [Transaction](_transaction_.transaction.md)[] |
`callbackUrl?` | string |

**Returns:** *Promise‹void›*

___

###  signOut

▸ **signOut**(): *void*

*Defined in [src.ts/wallet-account.ts:139](https://github.com/nearprotocol/nearlib/blob/213b318/src.ts/wallet-account.ts#L139)*

Sign out from the current account

**`example`** 
walletAccount.signOut();

**Returns:** *void*
