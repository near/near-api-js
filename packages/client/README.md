# @near-js/client

This package provides a simple interface for interacting with the Near blockchain. As a modern, tree-shakeable package,
it is intended to replace usage of `near-api-js`.

### Installation
```shell
# npm
npm i -s @near-js/client

# pnpm
pnpm add @near-js/client
```

### Usage


### Dependency Initialization
This package uses a common interface for specifying dependencies for RPC providers and cryptographic signing, allowing
a more flexible approach to composing functionality.

#### RPC provider
RPC providers are required for any blockchain interaction, e.g. block queries, transaction publishing.

This interface makes use of the `FallbackRpcProvider`, making it configurable with multiple RPC endpoint URLs
which can be cycled through when the current URL returns an error.

Specifying by URL endpoints:
```ts
import { getProviderByEndpoints } from '@near-js/client';

const rpcProvider = getProviderByEndpoints('https://rpc.tld', 'https://fallback-rpc.tld');
```

Specifying by network (uses default RPC endpoints specified in code):
```ts
import { getProviderByNetwork } from '@near-js/client';

const rpcProvider = getProviderByNetwork('testnet');
```

Shortcut methods:
```ts
import { getTestnetRpcProvider } from '@near-js/client';

// equivalent to getProviderByNetwork('testnet');
const rpcProvider = getTestnetRpcProvider();
```

#### Message Signer
Implementers of the `MessageSigner` interface can be initialized from the existing `KeyStore` classes or using private keys. 

Using an existing keystore:
```ts
import { getSignerFromKeystore } from '@near-js/client';
import { BrowserLocalStorageKeyStore } from '@near-js/keystores-browser';

const keystore = new BrowserLocalStorageKeyStore();
const signer = getSignerFromKeystore('account.near', 'mainnet', keystore);
```


Using a private key string:
```ts
import { getSignerFromKeystore } from '@near-js/client';
import { BrowserLocalStorageKeyStore } from '@near-js/keystores-browser';

const signer = getSignerFromPrivateKey('ed25519:...');
```

An access key-based signer is also available. Initialized using a `MessageSigner` implementer, this signer caches the
access key record and maintains a local, auto-incremented value for its nonce:
```ts
import { getAccessKeySigner, getMainnetRpcProvider, getSignerFromPrivateKey } from '@near-js/client';
import { BrowserLocalStorageKeyStore } from '@near-js/keystores-browser';

const keystore = new BrowserLocalStorageKeyStore();
const signer = getSignerFromKeystore('account.near', 'mainnet', keystore);
const accessKeySigner = getAccessKeySigner({
  account: 'account.near',
  deps: {
    signer,
    rpcProvider: getMainnetRpcProvider(),
  },
});
```

### View Methods
Several functions are provided for working with builtin account methods and smart contract view methods.

Executing a view method on a smart contract and return the entire response:
```ts
import { callViewMethod, getTestnetRpcProvider } from '@near-js/client';

const response = await callViewMethod({
  account: 'guest-book.testnet',
  method: 'getMessages',
  deps: { rpcProvider: getTestnetRpcProvider() },
});
```

Shorthand function to call the method and return only the parsed value:
```ts
import { getTestnetRpcProvider, view } from '@near-js/client';

interface GuestBookMessage {
  premium: boolean;
  sender: string;
  text: string;
}

// parse the returned buffer and parse as JSON
const data = await view<GuestBookMessage[]>({
  account: 'guest-book.testnet',
  method: 'getMessages',
  deps: { rpcProvider: getTestnetRpcProvider() },
});
```

Client method for requesting access keys:
```ts
import { getAccessKeys, getTestnetRpcProvider } from '@near-js/client';

const { fullAccessKeys, functionCallAccessKeys } = await getAccessKeys({
  account: 'account.testnet',
  deps: { rpcProvider: getTestnetRpcProvider() },
});
```

### Transactions
New `*Composer` classes facilitate transaction building and signing:
```ts
import {
  getSignerFromKeystore,
  getTestnetRpcProvider,
  SignedTransactionComposer,
} from '@near-js/client';
import { KeyPairEd25519 } from '@near-js/crypto';
import { BrowserLocalStorageKeyStore } from '@near-js/keystores-browser';

const keystore = new BrowserLocalStorageKeyStore();
const signer = getSignerFromKeystore('account.testnet', 'testnet', keystore);

const oldPublicKey = await signer.getPublicKey();
const newKeyPair = KeyPairEd25519.fromRandom();

const composer = SignedTransactionComposer.init({
  sender: 'account.testnet',
  receiver: 'receiver.testnet',
  deps: {
    signer,
    rpcProvider: getMainnetRpcProvider(),
  }
});

// add new key and remove old key in single transaction
await composer
  .addFullAccessKey(newKeyPair.publicKey)
  .deleteKey(oldPublicKey.toString())
  .signAndSend();

keystore.setKey('testnet', 'account.testnet', newKeyPair);
```

For convenience, there are also functions wrapping individual actions, e.g. `transfer`:
```ts
import {
  getSignerFromKeystore,
  getTestnetRpcProvider,
  transfer,
} from '@near-js/client';
import { KeyPairEd25519 } from '@near-js/crypto';
import { BrowserLocalStorageKeyStore } from '@near-js/keystores-browser';

const keystore = new BrowserLocalStorageKeyStore();
const signer = getSignerFromKeystore('account.testnet', 'testnet', keystore);

await transfer({
  sender: 'account.testnet',
  receiver: 'receiver.testnet',
  amount: 1000n, // in yoctoNear
  deps: {
    rpcProvider: getTestnetRpcProvider(),
    signer,
  }
});
```

# License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](https://github.com/near/near-api-js/blob/master/LICENSE) and [LICENSE-APACHE](https://github.com/near/near-api-js/blob/master/LICENSE-APACHE) for details.
