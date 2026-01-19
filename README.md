# NEAR JavaScript API

NEAR JavaScript API is a complete library to interact with the NEAR blockchain. You can use it in the browser, or in Node.js runtime.

## Installation

```bash
npm install near-api-js
# or
yarn add near-api-js
# or
pnpm add near-api-js
```

## Why near-api-js?

Previously, NEAR JavaScript functionality was split across multiple `@near-js/*` packages. While this modular approach is great for tree-shaking, it made it difficult for developers to know which packages they needed.

**near-api-js v7** goes back to be a single package that includes all NEAR JavaScript functionality, making it easier to get started and use NEAR in your projects:
- ✅ Simple installation - just one package
- ✅ Easy imports - everything in one place
- ✅ Full TypeScript support
- ✅ Works in browser and Node.js

## Quick Start

### Basic Example

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

### Working with Contracts

```typescript
import { Contract } from 'near-api-js';

const contract = new Contract(
  account, // the account object that is connecting
  'contract-id.testnet',
  {
    viewMethods: ['get_status'],
    changeMethods: ['set_status'],
  }
);

// Call methods
const status = await contract.get_status();
await contract.set_status({ message: 'Hello NEAR!' });
```

## What's Included

near-api-js includes all NEAR JavaScript functionality:

- **Accounts** - Account management and contract interactions
- **Crypto** - Key pair generation, signing, and verification
- **Transactions** - Transaction creation and signing
- **Providers** - RPC providers with failover support
- **Keystores** - Secure key storage for browser and Node.js
- **Signers** - Transaction signing interfaces
- **Types** - Full TypeScript type definitions
- **Utils** - Formatting, parsing, and helper functions
- **Tokens** - FT and NFT standard support
- **Biometric Auth** - WebAuthn support for passwordless auth
- **IFrame RPC** - Wallet integration helpers

## Documentation

- [Learn how to use](https://docs.near.org/tools/near-api-js/quick-reference) the library in your project
- Read the [TypeDoc API](https://near.github.io/near-api-js/) documentation
- [Cookbook](https://github.com/near/near-api-js/blob/master/packages/cookbook/README.md) with common use cases
- To quickly get started with integrating NEAR in a _web browser_, read our [Web Frontend integration](https://docs.near.org/develop/integrate/frontend) article

## Migration from @near-js/* packages

If you were previously using individual `@near-js/*` packages, migration is straightforward:

**Before:**
```typescript
import { Account } from '@near-js/accounts';
import { KeyPair } from '@near-js/crypto';
import { JsonRpcProvider } from '@near-js/providers';
```

**After:**
```typescript
import { Account, KeyPair, JsonRpcProvider } from 'near-api-js';
```

All exports remain the same - just change the import source!

## Advanced Usage

### Custom RPC Provider

```typescript
import { JsonRpcProvider, FailoverRpcProvider } from 'near-api-js';

const provider = new FailoverRpcProvider([
  new JsonRpcProvider({ url: 'https://rpc.mainnet.near.org' }),
  new JsonRpcProvider({ url: 'https://rpc.mainnet.pagoda.co' }),
]);
```

### Transaction Building

```typescript
import {
  actions as actionCreators,
  createTransaction,
  signTransaction
} from 'near-api-js';

const { transfer, functionCall } = actionCreators;

const actions = [
  transfer(BigInt('1000000000000000000000000')), // 1 NEAR
  functionCall('method_name', { arg: 'value' }, BigInt('30000000000000'), BigInt('0'))
];

const transaction = createTransaction(
  'sender.near',
  publicKey,
  'receiver.near',
  nonce,
  actions,
  blockHash
);

const signedTx = await signTransaction(transaction, signer, 'sender.near', networkId);
```

## TypeScript Support

near-api-js is written in TypeScript and includes full type definitions:

```typescript
import type {
  AccountView,
  BlockReference,
  Action,
  SignedTransaction
} from 'near-api-js';
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

### Publish

Prepare `dist` version by running:

    pnpm dist

### Integration Test

Start the node by following instructions from [nearcore](https://github.com/nearprotocol/nearcore), then

    pnpm test

Tests use sample contract from `near-hello` npm package, see https://github.com/nearprotocol/near-hello

## License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](https://github.com/near/near-api-js/blob/master/LICENSE) and [LICENSE-APACHE](https://github.com/near/near-api-js/blob/master/LICENSE-APACHE) for details.
