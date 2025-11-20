# NEAR JavaScript API

NEAR JavaScript API is a complete library to interact with the NEAR blockchain. You can use it in the browser, or in Node.js runtime.

## Installation

```bash
npm install near-api-js
```

## Import Patterns

The library supports clean subpath exports for commonly used module groups:

```javascript
// Main package - includes Account, Contract, Connection, Near, connect, etc.
import { connect, keyStores, Account, Contract, Near } from 'near-api-js';

// Providers - Provider classes
import { JsonRpcProvider, FailoverRpcProvider } from 'near-api-js/providers';

// Keystores - KeyStore implementations
import { InMemoryKeyStore, UnencryptedFileSystemKeyStore } from 'near-api-js/keystores';

// Signers - Signer classes
import { Signer, KeyPairSigner } from 'near-api-js/signers';

// Utils - Utility functions and classes
import { KeyPair, PublicKey, format, serialize } from 'near-api-js/utils';

// Transactions - Transaction utilities and action creators
import { createTransaction, signTransaction, transfer } from 'near-api-js/transactions';
```

### Available Subpath Exports

- `near-api-js` - Main entry point (includes Account, Contract, Connection, Near, connect, validators, constants, etc.)
- `near-api-js/providers` - Provider classes (JsonRpcProvider, FailoverRpcProvider)
- `near-api-js/keystores` - KeyStore implementations (InMemoryKeyStore, UnencryptedFileSystemKeyStore, etc.)
- `near-api-js/signers` - Signer classes (Signer, KeyPairSigner)
- `near-api-js/utils` - Utility functions (KeyPair, PublicKey, serialize, format, etc.)
- `near-api-js/transactions` - Transaction utilities and action creators

### Backward Compatibility

The traditional import pattern continues to work:

```javascript
import * as nearAPI from 'near-api-js';
const { connect, keyStores, KeyPair } = nearAPI;
```

## Documentation

- [Learn how to use](https://docs.near.org/tools/near-api-js/quick-reference) the library in your project

- Read the [TypeDoc API](https://near.github.io/near-api-js/) documentation

- [Cookbook](https://github.com/near/near-api-js/blob/master/packages/cookbook/README.md) with common use cases

- To quickly get started with integrating NEAR in a _web browser_, read our [Web Frontend integration](https://docs.near.org/develop/integrate/frontend) article.

# License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](https://github.com/near/near-api-js/blob/master/LICENSE) and [LICENSE-APACHE](https://github.com/near/near-api-js/blob/master/LICENSE-APACHE) for details.
