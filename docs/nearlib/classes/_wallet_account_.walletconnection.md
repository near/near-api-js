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

**Parameters:**

Name | Type |
------ | ------ |
`near` | [Near](_near_.near.md) |
`appKeyPrefix` | string &#124; null |

**Returns:** *[WalletConnection](_wallet_account_.walletconnection.md)*

## Properties

###  _authData

• **_authData**: *any*

___

###  _authDataKey

• **_authDataKey**: *string*

___

###  _connectedAccount

• **_connectedAccount**: *[ConnectedWalletAccount](_wallet_account_.connectedwalletaccount.md)*

___

###  _keyStore

• **_keyStore**: *[KeyStore](_key_stores_keystore_.keystore.md)*

___

###  _near

• **_near**: *[Near](_near_.near.md)*

___

###  _networkId

• **_networkId**: *string*

___

###  _walletBaseUrl

• **_walletBaseUrl**: *string*

## Methods

###  _completeSignInWithAccessKey

▸ **_completeSignInWithAccessKey**(): *Promise‹void›*

Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.

**Returns:** *Promise‹void›*

___

###  _moveKeyFromTempToPermanent

▸ **_moveKeyFromTempToPermanent**(`accountId`: string, `publicKey`: string): *Promise‹void›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`accountId` | string | The NEAR account owning the given public key |
`publicKey` | string | The public key being set to the key store  |

**Returns:** *Promise‹void›*

___

###  account

▸ **account**(): *[ConnectedWalletAccount](_wallet_account_.connectedwalletaccount.md)‹›*

Returns the current connected wallet account

**Returns:** *[ConnectedWalletAccount](_wallet_account_.connectedwalletaccount.md)‹›*

___

###  getAccountId

▸ **getAccountId**(): *any*

Returns authorized Account ID.

**`example`** 
walletAccount.getAccountId();

**Returns:** *any*

___

###  isSignedIn

▸ **isSignedIn**(): *boolean*

Returns true, if this WalletAccount is authorized with the wallet.

**`example`** 
walletAccount.isSignedIn();

**Returns:** *boolean*

___

###  requestSignIn

▸ **requestSignIn**(`contractId`: string, `title`: string, `successUrl`: string, `failureUrl`: string): *Promise‹void›*

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

Requests the user to quickly sign for a transaction or batch of transactions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`transactions` | [Transaction](_transaction_.transaction.md)[] | Array of Transaction objects that will be requested to sign |
`callbackUrl?` | string | The url to navigate to after the user is prompted to sign  |

**Returns:** *Promise‹void›*

___

###  signOut

▸ **signOut**(): *void*

Sign out from the current account

**`example`** 
walletAccount.signOut();

**Returns:** *void*
