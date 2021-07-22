# Quick Reference / Cheat Sheet

> Here is a collection of the most commonly used methods within [`near-api-js`](https://github.com/near/near-api-js/). For more in-depth look into this library, please reference the [TypeDocs](https://near.github.io/near-api-js/).

## Setup

### Install

```bash
npm i near-api-js
```

### Import

Browser:

```js
import * as nearAPI from "near-api-js";
```

Node:

```js
const nearAPI = require("near-api-js");
```


### Key Store

Browser:

```js
// creates keyStore using private key in local storage
// *** REQUIRES SignIn using walletConnection.requestSignIn() ***

const { keyStores } = nearAPI;
const keyStore = new keyStores.BrowserLocalStorageKeyStore();
```

Using a File:

```js
// creates keyStore from a provided file
// you will need to pass the location of the .json key pair

const { keyStores } = nearAPI;
const KEY_PATH = "~./near-credentials/testnet/example-account.json";
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(KEY_PATH);
```

Using private key string:

```js
// creates keyStore from a private key string
// you can define your key here or use an environment variable

const { keyStores, KeyPair } = nearAPI;
const keyStore = new keyStores.InMemoryKeyStore();
const PRIVATE_KEY =
  "by8kdJoJHu7uUkKfoaLd2J2Dp1q1TigeWMG123pHdu9UREqPcshCM223kWadm";
// creates a public / private key pair using the provided private key
const keyPair = KeyPair.fromString(PRIVATE_KEY);
// adds the keyPair you created to keyStore
await keyStore.setKey("testnet", "example-account.testnet", keyPair);
```

**Note:** Key store is **_not required_** if you are not signing transactions _(using view call methods on a contract)_

### Connect

Testnet:

```js
const { connect } = nearAPI;

const config = {
  networkId: "testnet",
  keyStore, // optional if not signing transactions
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};
const near = await connect(config);
```

Mainnet:

```js
const { connect } = nearAPI;

const config = {
  networkId: "mainnet",
  keyStore, // optional if not signing transactions
  nodeUrl: "https://rpc.mainnet.near.org",
  walletUrl: "https://wallet.mainnet.near.org",
  helperUrl: "https://helper.mainnet.near.org",
  explorerUrl: "https://explorer.mainnet.near.org",
};
const near = await connect(config);
```

Betanet:

```js
const { connect } = nearAPI;

const config = {
  networkId: "betanet",
  keyStore, // optional if not signing transactions
  nodeUrl: "https://rpc.betanet.near.org",
  walletUrl: "https://wallet.betanet.near.org",
  helperUrl: "https://helper.betanet.near.org",
  explorerUrl: "https://explorer.betanet.near.org",
};
const near = await connect(config);
```

Localnet:

```js
const { connect } = nearAPI;
const config = {
  networkId: "local",
  nodeUrl: "http://localhost:3030",
  walletUrl: "http://localhost:4000/wallet",
};
const near = await connect(config);
```

[`keyStore setup`](#key-store)

## Wallet

### Connection

Testnet:

```js
const { connect, keyStores, WalletConnection } = nearAPI;

const config = {
  networkId: "testnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};

// connect to NEAR
const near = await connect(config);

// create wallet connection
const wallet = new WalletConnection(near);
```

Mainnet:

```js
const { connect, keyStores, WalletConnection } = nearAPI;

const config = {
  networkId: "mainnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.mainnet.near.org",
  walletUrl: "https://wallet.mainnet.near.org",
  helperUrl: "https://helper.mainnet.near.org",
  explorerUrl: "https://explorer.mainnet.near.org",
};

// connect to NEAR
const near = await connect(config);

// create wallet connection
const wallet = new WalletConnection(near);
```

Betanet:

```js
const { connect, keyStores, WalletConnection } = nearAPI;

const config = {
  networkId: "betanet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.betanet.near.org",
  walletUrl: "https://wallet.betanet.near.org",
  helperUrl: "https://helper.betanet.near.org",
  explorerUrl: "https://explorer.betanet.near.org",
};

// connect to NEAR
const near = await connect(config);

// create wallet connection
const wallet = new WalletConnection(near);
```

### Sign In

```js
// redirects user to wallet to authorize your dApp
// this creates an access key that will be stored in the browser's local storage
// access key can then be used to connect to NEAR and sign transactions via keyStore

const signIn = () => {
    wallet.requestSignIn({
        contractId: 'example-contract.testnet', // optional, contract requesting access
        methodNames: ['hello', 'goodbye'], // optional
        successUrl: 'http://YOUR-URL.com/success', // optional
        failureUrl: 'http://YOUR-URL.com/fail' // optional
    });
};
```

**Note:** Sign In is **_not required_** if you are using an alternative key store to local storage **_or_** you are not signing transactions _(using view call methods on a contract)_

### Sign Out

```js
const signOut = () => {
  wallet.signOut();
};
```

### Check if Signed In

```js
if(wallet.isSignedIn()) => doSomething();
```

### Get Authorized Account Id

```js
// returns account Id as string
const walletAccountId = wallet.getAccountId();
```

### Get Authorized Account Object

```js
// returns account object for transaction signing
const walletAccountObj = wallet.account();
```

## Account

### Load Account

```js
const near = await connect(config);
const account = await near.account("example-account.testnet");
```

[`config setup`](#connect)

### Create Account

```js
// creates a new account using funds from the account used to create it
const near = await connect(config);
const account = await near.account("example-account.testnet");
await account.createAccount(
  "example-account2.testnet", // new account name
  "8hSHprDq2StXwMtNd43wDTXQYsjXcD4MJTXQYsjXcc", // public key for new account
  "10000000000000000000" // initial balance for new account in yoctoNEAR
);
```

[`config setup`](#connect)

### Delete Account

```js
// deletes account found in the `account` object
// transfers remaining account balance to the accountId passed as an argument
const near = await connect(config);
const account = await near.account("example-account.testnet");
await account.deleteAccount("beneficiary-account.testnet");
```

[`config setup`](#connect)

### Get Account Balance

```js
// gets account balance
const near = await connect(config);
const account = await near.account("example-account.testnet");
await account.getAccountBalance();
```

[`config setup`](#connect)

### Get Account details

```js
// gets account details in terms of authorized apps and transactions
const near = await connect(config);
const account = await near.account("example-account.testnet");
await account.getAccountDetails();
```

[`config setup`](#connect)

### Send Tokens

```js
// sends NEAR tokens
const near = await connect(config);
const account = await near.account("sender-account.testnet");
await account.sendMoney(
  "receiver-account.testnet", // receiver account
  "1000000000000000000000000" // amount in yoctoNEAR
);
```

[`config setup`](#connect)

### State

```js
// gets the state of the account
const near = await connect(config);
const account = await near.account("example-account.testnet");
const response = await account.state();
console.log(response);
```

[`config setup`](#connect)

### Deploy Contract

```js
const near = await connect(config);
const account = await near.account("example-account.testnet");
const response = await account.deployContract(fs.readFileSync('./wasm_files/status_message.wasm'));
console.log(response);
```

[`config setup`](#connect)

## Contract

### Load Contract

Standard:

```js
const contract = new nearAPI.Contract(
  account, // the account object that is connecting
  "example-contract.testnet",
  {
    // name of contract you're connecting to
    viewMethods: ["getMessages"], // view methods do not change state but usually return a value
    changeMethods: ["addMessage"], // change methods modify state
    sender: account, // account object to initialize and sign transactions.
  }
);
```

[`config setup`](#connect)

Using Wallet:

```js
const contract = new nearAPI.Contract(
  wallet.account(), // the account object that is connecting
  "example-contract.testnet",
  {
    // name of contract you're connecting to
    viewMethods: ["getMessages"], // view methods do not change state but usually return a value
    changeMethods: ["addMessage"], // change methods modify state
    sender: wallet.Account(), // account object to initialize and sign transactions.
  }
);
```

[`config setup`](#connect)


### Call Contract

Change Method:

```js
await contract.method_name(
  {
    arg_name: "value", // argument name and value - pass empty object if no args required
  },
  300000000000000, // attached GAS (optional)
  1000000000000000000000000 // attached deposit in yoctoNEAR (optional)
);
```

View Method:

```js
const response = await contract.view_method_name();
console.log(response);
```

View Method w/ Args:

```js
const response = await contract.view_method_name({ arg_name: "arg_value" });
console.log(response);
```

## Access Keys

### Add Full Access Key

```js
// takes public key as string for argument
const near = await connect(config);
const account = await near.account("example-account.testnet");
await account.addKey("8hSHprDq2StXwMtNd43wDTXQYsjXcD4MJTXQYsjXcc");
```

[`config setup`](#connect)

### Add Function Access Key

```js
// adds function access key
const near = await connect(config);
const account = await near.account("example-account.testnet");
await account.addKey(
  "8hSHprDq2StXwMtNd43wDTXQYsjXcD4MJTXQYsjXcc", // public key for new account
  "example-account.testnet", // contract this key is allowed to call (optional)
  "example_method", // methods this key is allowed to call (optional)
  "2500000000000" // allowance key can use to call methods (optional)
);
```

[`config setup`](#connect)

### Get All Access Keys

```js
// returns all access keys associated with an account
const near = await connect(config);
const account = await near.account("example-account.testnet");
await account.getAccessKeys();
```

[`config setup`](#connect)

### Delete Access Key

```js
// takes public key as string for argument
const near = await connect(config);
const account = await near.account("example-account.testnet");
await account.deleteKey("8hSHprDq2StXwMtNd43wDTXQYsjXcD4MJTXQYsjXcc");
```

[`config setup`](#connect)

## Utils

### NEAR => yoctoNEAR

```js
// converts NEAR amount into yoctoNEAR (10^-24)

const { utils } = nearAPI;
const amountInYocto = utils.format.parseNearAmount("1");
```

### YoctoNEAR => NEAR

```js
// converts yoctoNEAR (10^-24) amount into NEAR

const { utils } = nearAPI;
const amountInNEAR = utils.format.formatNearAmount("1000000000000000000000000");
```
