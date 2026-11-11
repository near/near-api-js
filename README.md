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

Use Node.js **22.22.2 or later**. The examples below use ES modules; set `"type": "module"` in your application's `package.json`. TypeScript examples require a TypeScript runner or compilation before execution.

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
import { Account, JsonRpcProvider, teraToGas, type KeyPairString, nearToYocto } from "near-api-js";

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
const accountId = process.env.NEAR_ACCOUNT_ID;
const privateKey = process.env.NEAR_PRIVATE_KEY as KeyPairString | undefined;
if (!accountId || !privateKey) throw new Error('Set NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY');
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

Use an existing testnet account and its prefixed private key (for example, `ed25519:...`). The key must have permission to call the contract, and the account must have enough balance for gas and the attached deposit. Setting these environment variables is an application convention; the library does not load credentials automatically.

For JavaScript, omit TypeScript-only syntax such as `type KeyPairString` and the `as` assertion. The feature snippets below reuse `account` and `provider` from this setup unless they define their own.

## Documentation

- [Learn how to use](https://docs.near.org/tools/near-api) the library in your project
- See it in action in our [API Examples](https://github.com/near-examples/near-api-examples/tree/main/near-api-js)
- Read the [TypeDoc API](https://near.github.io/near-api-js/) documentation

## Migration from @near-js/* packages

Check out the [migration guide](MIGRATION.md) for v6 / `@near-js/*` imports, account methods, signers, units, and error handling.

## New in 7.5

- Deterministic (`0s…`) accounts: `DeterministicStateInit` builds initial code/storage, derives the account ID, and works with `Account.createDeterministicAccount()`.
- Universal (`0u…`) accounts: `UniversalStateInit` supports code, storage, and access keys; `Account.createUniversalAccount()` supports initialization, including prefunded self-bootstrap.
- Access-key pagination: `provider.viewAccessKeyList({ accountId, limit, afterKey })` returns `last_key` for the next page.
- Global contracts: `(await account.getState()).globalContract` identifies the global code used by an account. Global contract helpers accept the base58 hashes returned by RPC.
- Meta transactions: `SignedDelegate.decode(bytes)` and `decodeSignedDelegate(bytes)` complement signed-delegate encoding.

Gas-key creation, funding, withdrawals, and automatic nonce-lane rotation were added in 7.4. See the [release notes](https://github.com/near/near-api-js/releases) and [API reference](https://near.github.io/near-api-js/) for details. State-init deposits cover storage staking and refund excess; transfer spending balance separately.

## Features

`near-api-js` includes some advanced features to help you build robust applications.

### Access-key pagination

Call `account.getAccessKeyList({ limit: 100 })` to retrieve one page. If the response includes `last_key`, pass it unchanged as `afterKey` in the next call. The return shape is the same as `provider.viewAccessKeyList()`. No-argument calls remain supported, but nodes may reject them for accounts exceeding their unpaginated key limit.

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

The SDK reserves nonces locally and retries invalid-nonce failures. Multiple keys can improve concurrency; this example submits ten transfers and spends real testnet balance.

```typescript
import { Account, actions, KeyPair, MultiKeySigner, type Action } from "near-api-js"
import { NEAR } from "near-api-js/tokens"

const accountId = account.accountId

// create 10 keys and add them to the account
const keys: KeyPair[] = []
const txActions: Action[] = []
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

for (let i = 0; i < 10; i++) {
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
type Message = { text: string; sender: string };

const messages = await provider.callFunction<Message[]>({
  contractId: 'guestbook.near-examples.testnet',
  method: 'get_messages',
  args: {},
  blockQuery: { finality: 'final' },
});
console.log(messages);
```

`Provider.callFunction()` uses `method` and returns the decoded view result (or `undefined` for an empty result). `Account.callFunction()` uses `methodName` and returns the decoded transaction result; use `Account.callFunctionRaw()` for the transaction outcome. Generic types describe the expected JSON shape; they do not validate the contract's response at runtime.

### Failover RPC Provider

You can easily define multiple RPC endpoints to connect to  NEAR network, if one fails the next one will be used automatically.

```typescript
import { JsonRpcProvider, FailoverRpcProvider } from 'near-api-js';

const provider = new FailoverRpcProvider([
  new JsonRpcProvider({ url: 'https://rpc.mainnet.near.org' }),
  new JsonRpcProvider({ url: 'https://free.rpc.fastnear.com' }),
]);
```

### Decoupled Transaction Signing
You can separately build transactions, sign them, and broadcast them to the network.

Transaction creation reads the nonce and a recent block hash from RPC. Signing itself can happen separately; broadcast before the transaction's block reference expires.

```typescript
import { JsonRpcProvider, Account, KeyPairSigner, actions, nearToYocto, type KeyPairString } from "near-api-js";

const provider = new JsonRpcProvider({
  url: "https://test.rpc.fastnear.com",
});

const accountId = process.env.NEAR_ACCOUNT_ID;
const privateKey = process.env.NEAR_PRIVATE_KEY as KeyPairString | undefined;
if (!accountId || !privateKey) throw new Error('Set NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY');
const signer = KeyPairSigner.fromSecretKey(privateKey);
const publicKey = await signer.getPublicKey();
// The account used to construct the transaction needs no signer.
const account = new Account(accountId, provider);

const transaction = await account.createTransaction({
  receiverId: "receiver-account.testnet",
  actions: [actions.transfer(nearToYocto("0.1"))],
  publicKey: publicKey
});

// Whoever holds the private key can sign the transaction
const signResult = await signer.signTransaction(transaction);
console.log(signResult.signedTransaction);

// Anybody can send the signed transaction to the network
const sendTransactionResult = await provider.sendTransaction(signResult.signedTransaction);
console.log(sendTransactionResult);
```

## Browser and Node.js Support

- ✅ **Node.js** - Requires Node.js 22.22.2 or later
- ✅ **Browsers** - Uses modern Web APIs, including Web Crypto, `TextEncoder`, and `Uint8Array`; use a bundler and a browser supporting those APIs
- ✅ **ESM** - Native ES modules support
- ✅ **CommonJS** - For legacy Node.js projects
- ✅ **TypeScript** - Full type definitions included

## Contributing

Contributions are welcome! Please check out the [contributing guidelines](https://github.com/near/near-api-js/blob/master/CONTRIBUTING.md).

1. Install dependencies

       pnpm install

2. Run continuous build with:

       pnpm dev

### Integration Test

Build first, then run the unit and sandbox integration suites:

    pnpm build
    pnpm test

The integration tests start local NEAR sandbox nodes; they do not require a public-network faucet. Run package import tests separately with `pnpm --dir e2e test`. Other checks are `pnpm lint`, `pnpm typecheck`, and `pnpm check-exports`.

## License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](https://github.com/near/near-api-js/blob/master/LICENSE) and [LICENSE-APACHE](https://github.com/near/near-api-js/blob/master/LICENSE-APACHE) for details.
