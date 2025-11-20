# NEAR JavaScript API

NEAR JavaScript API is a complete library to interact with the NEAR blockchain. You can use it in the browser, or in Node.js runtime.

## Installation

```bash
npm install near-api-js
```

## Import Patterns

The library now supports clean subpath exports for commonly used modules:

```javascript
// Main package
import { connect, keyStores } from 'near-api-js';

// Providers
import { JsonRpcProvider, FailoverRpcProvider } from 'near-api-js/providers';

// Keystores
import { InMemoryKeyStore, UnencryptedFileSystemKeyStore } from 'near-api-js/keystores';

// Signers
import { Signer, KeyPairSigner } from 'near-api-js/signers';

// Utils
import { KeyPair, PublicKey } from 'near-api-js/utils';

// Transactions
import { createTransaction, signTransaction } from 'near-api-js/transactions';

// Account, Contract, Connection
import { Account } from 'near-api-js/account';
import { Contract } from 'near-api-js/contract';
import { Connection } from 'near-api-js/connection';

// Other utilities
import { connect } from 'near-api-js/connect';
import { Near } from 'near-api-js/near';
```

### Available Subpath Exports

- `near-api-js` - Main entry point
- `near-api-js/providers` - Provider classes (JsonRpcProvider, FailoverRpcProvider, etc.)
- `near-api-js/keystores` - KeyStore classes (InMemoryKeyStore, UnencryptedFileSystemKeyStore, etc.)
- `near-api-js/signers` - Signer classes
- `near-api-js/utils` - Utility functions (KeyPair, PublicKey, serialize, format, etc.)
- `near-api-js/transactions` - Transaction utilities
- `near-api-js/account` - Account class
- `near-api-js/contract` - Contract class
- `near-api-js/connection` - Connection class
- `near-api-js/validators` - Validator functions
- `near-api-js/account-creator` - Account creator utilities
- `near-api-js/connect` - Connect function
- `near-api-js/constants` - Constants
- `near-api-js/near` - Near class

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
