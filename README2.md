# NEAR JavaScript API

NEAR JavaScript API is a complete library to interact with the NEAR blockchain. You can use it in the browser, or in Node.js runtime.

## Installation

```bash
npm install near-api-js
# or
yarn add near-api-js
# or
bun add near-api-js
```

## Why near-api-js?

Previously, NEAR JavaScript functionality was split across multiple `@near-js/*` packages. While this modular approach is great for tree-shaking, it made it difficult for developers to know which packages they needed.

**near-api-js** solves this by providing a single package that includes everything you need, while still maintaining full tree-shakeability. You get the best of both worlds:
- ✅ Simple installation - just one package
- ✅ Easy imports - everything in one place
- ✅ Tree-shakeable - only bundle what you use
- ✅ Full TypeScript support
- ✅ Works in browser and Node.js

## Quick Start

### Basic Example

```typescript
import { connect, keyStores, KeyPair } from 'near-api-js';

// Create a keystore
const keyStore = new keyStores.InMemoryKeyStore();
const keyPair = KeyPair.fromRandom('ed25519');
await keyStore.setKey('testnet', 'example-account.testnet', keyPair);

// Connect to NEAR
const near = await connect({
  networkId: 'testnet',
  keyStore,
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://testnet.mynearwallet.com/',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://testnet.nearblocks.io',
});

// Get account
const account = await near.account('example-account.testnet');
const balance = await account.getAccountBalance();
console.log(balance);
```

### Tree-Shakeable Imports

Import only what you need - unused code will be automatically removed by your bundler:

```typescript
import {
  Account,
  Contract,
  KeyPair,
  JsonRpcProvider,
  InMemorySigner
} from 'near-api-js';

// Your bundler will only include these specific exports
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

### Using Keystores

```typescript
import { keyStores } from 'near-api-js';

// In-memory keystore (for development)
const inMemoryKeyStore = new keyStores.InMemoryKeyStore();

// Browser keystore (uses localStorage)
const browserKeyStore = new keyStores.BrowserLocalStorageKeyStore();

// Node.js filesystem keystore
const homeDir = require('os').homedir();
const keyStorePath = require('path').join(homeDir, '.near-credentials');
const fileSystemKeyStore = new keyStores.UnencryptedFileSystemKeyStore(keyStorePath);
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
  actionCreators,
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

## License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](https://github.com/near/near-api-js/blob/master/LICENSE) and [LICENSE-APACHE](https://github.com/near/near-api-js/blob/master/LICENSE-APACHE) for details.
