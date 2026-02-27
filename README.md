# NEAR JavaScript API

NEAR JavaScript API is a complete library to interact with the NEAR blockchain. You can use it in the browser, or in Node.js runtime.

> [!IMPORTANT]  
> `near-api-js` is ideal to build backend services, CLIs, and scripts that interact with NEAR. For frontend development please check the official [web login docs](https://docs.near.org/web3-apps/concepts/web-login)

## Why near-api-js?

**near-api-js v7** is a single package that helps you to easily integrate NEAR blockchain into your JavaScript/TypeScript applications.

It includes all the functionality you need, including account management, transaction building, key management, interacting with smart contracts, making RPC calls, and more.

- ✅ Simple - just one package
- ✅ Batteries included - everything you need to build scripts and backend services
- ✅ Friendly - multiple helpers to make your life easier
- ✅ Full TypeScript support
- ✅ Works in browser and Node.js

## Quick Start

Add `near-api-js` to your project using your favorite package manager:

```bash
npm install near-api-js
# or
yarn add near-api-js
# or
pnpm add near-api-js
```

Start using it!

```ts
import { Account, JsonRpcProvider, teraToGas, KeyPairString, nearToYocto } from "near-api-js";

// Create a testnet provider
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// For read only calls, you can use the provider directly
const messages = await provider.callFunction({
  contractId: 'guestbook.near-examples.testnet',
  method: "get_messages",
  args: {},
});

console.log(messages);

// To modify state, you need an account to sign the transaction
const accountId: string = 'example.testnet';
const privateKey = 'ed25519:5nM...' as KeyPairString;
const account = new Account(accountId, provider, privateKey);

// Call the contract
await account.callFunction({
  contractId: 'guestbook.near-examples.testnet',
  methodName: "add_message",
  args: { text: "Hello!" },
  gas: teraToGas('30'),
  deposit: nearToYocto('0.1'),
});
```

## Documentation

- [Learn how to use](https://docs.near.org/tools/near-api) the library in your project
- See it in action in our [API Examples](https://github.com/near-examples/near-api-examples/tree/main/near-api-js)
- Read the [TypeDoc API](https://near.github.io/near-api-js/) documentation

## Migration from @near-js/* packages

Check out the [migration guide](MIGRATION.md) to help you move from the old `@near-js/*` packages to `near-api-js`.

## Features

`near-api-js` includes some advanced features to help you build robust applications.

### Simple Units Conversions

You can easily convert between NEAR and yoctoNEAR, and between gas units:

```typescript
import { nearToYocto, yoctoToNear, teraToGas, gigaToGas } from 'near-api-js';

await account.callFunction({
  contractId: 'example.testnet',
  methodName: 'some_method',
  args: {},
  gas: teraToGas('30'),         // 30 TeraGas
  deposit: nearToYocto('0.1'),  // 0.1 NEAR
});

// balance in NEAR with 2 decimals
const balance = yoctoToNear(await account.getBalance(), 2);

```

### Parallel Transactions
`near-api-js` can send transactions in parallel by rotating multiple keys for an account.

`nonce` collisions are automatically handled by retrying with incremented nonce.

```typescript
import { Account, actions, JsonRpcProvider, KeyPair, MultiKeySigner } from "near-api-js"
import { NEAR } from "near-api-js/tokens"

const privateKey = ... // 
const accountId = ... // 

// Create a connection to testnet RPC
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
})

// Create an account object
const account = new Account(accountId, provider, privateKey)

// create 10 keys and add them to the account
const keys = []
const txActions = []
for (let j = 0; j < 10; j++) {
  const newKeyPair = KeyPair.fromRandom('ed25519')
  keys.push(newKeyPair)
  txActions.push(
    actions.addFullAccessKey(newKeyPair.getPublicKey())
  )
}

await account.signAndSendTransaction({
  receiverId: accountId,
  actions: txActions
})

console.log(`Added ${keys.length} keys to account ${accountId}`)

// ------- Send NEAR tokens using multiple keys -------
const multiKeySigner = new MultiKeySigner(keys)
const multiAccount = new Account(accountId, provider, multiKeySigner)

const transfers = []

for (let i = 0; i < 100; i++) {
  transfers.push(
    multiAccount.transfer(
      {
        token: NEAR,
        amount: NEAR.toUnits("0.001"),
        receiverId: "influencer.testnet"
      }
    ))
}

const sendNearTokensResults = await Promise.all(transfers)
sendNearTokensResults.forEach(result => console.log(result))
```

### Typescript Support

`near-api-js` is written in `TypeScript` and includes full type definitions:

```typescript
import type {
  AccountView,
  BlockReference,
  Action,
  SignedTransaction
} from 'near-api-js';
```

### Typed Function Calls

You can even type the expected results from contract function calls:

```typescript
const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});
const account = new Account("accountId", provider, "privateKey");

await provider.callFunction<T>()
await account.callFunction<T>()
```

### Failover RPC Provider

You can easily define multiple RPC endpoints to connect to  NEAR network, if one fails the next one will be used automatically.

```typescript
import { JsonRpcProvider, FailoverRpcProvider } from 'near-api-js';

const provider = new FailoverRpcProvider([
  new JsonRpcProvider({ url: 'https://rpc.mainnet.near.org' }),
  new JsonRpcProvider({ url: 'https://rpc.mainnet.pagoda.co' }),
]);
```

### Decoupled Transaction Signing
You can separately build transactions, sign them, and broadcast them to the network.

This is useful in scenarios where signing and sending need to be decoupled, such as offline signing

```typescript
import { JsonRpcProvider, Account, KeyPairSigner, actions, nearToYocto, KeyPairString } from "near-api-js";

const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

// You can create a transaction only knowing the accountId and public key
const publicKey = '';
const accountId = '';
const account = new Account(accountId, provider);

const transaction = await account.createTransaction({
  receiverId: "receiver-account.testnet",
  actions: [actions.transfer(nearToYocto("0.1"))],
  publicKey: publicKey
});

// Whoever holds the private key can sign the transaction
const signer = KeyPairSigner.fromSecretKey(privateKey as KeyPairString);
const signResult = await signer.signTransaction(transaction);
console.log(signResult.signedTransaction);

// Anybody can send the signed transaction to the network
const sendTransactionResult = await provider.sendTransaction(signResult.signedTransaction);
console.log(sendTransactionResult);
```

## Browser and Node.js Support

- ✅ **Node.js** - Full support for Node.js 18+
- ✅ **Browsers** - Works in all modern browsers
- ✅ **ESM** - Native ES modules support
- ✅ **CommonJS** - For legacy Node.js projects
- ✅ **TypeScript** - Full type definitions included

## Contributing

Contributions are welcome! Please check out the [contributing guidelines](https://github.com/near/near-api-js/blob/master/CONTRIBUTING.md).

1. Install dependencies

       pnpm install

2. Run continuous build with:

       pnpm -r compile -w

### Integration Test

Simply run:

    pnpm test

## License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](https://github.com/near/near-api-js/blob/master/LICENSE) and [LICENSE-APACHE](https://github.com/near/near-api-js/blob/master/LICENSE-APACHE) for details.
