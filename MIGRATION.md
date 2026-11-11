# Migrating to near-api-js v7

This guide targets **near-api-js 7.5** and users of v6 or the deprecated `@near-js/*` packages. Replacing imports is only the first step: account methods, signer interfaces, argument shapes, and return types also changed.

Use Node.js **22.22.2 or later**. The package provides ESM and CommonJS builds and TypeScript declarations. These examples use TypeScript and ESM. Check your application's direct and transitive `@near-js/*` dependencies before removing them; a wallet integration may still require its own versions.

## Package imports

Install `near-api-js` and replace the imports your application uses:

```sh
npm install near-api-js@^7.5.0
```

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

Use `near-api-js/tokens` for token helpers, `near-api-js/nep413` for message signing/verification, and `near-api-js/rpc-errors` for error classes. Avoid internal `lib/` or `src/` imports.

## Providers, accounts, and credentials

For applications using `connect()` / `near.account()`, migrate to explicit provider and account construction:

```typescript
import { Account, JsonRpcProvider, KeyPairSigner, type KeyPairString } from 'near-api-js';

const provider = new JsonRpcProvider({ url: 'https://test.rpc.fastnear.com' });
const accountId = process.env.NEAR_ACCOUNT_ID;
const privateKey = process.env.NEAR_PRIVATE_KEY as KeyPairString | undefined;
if (!accountId || !privateKey) throw new Error('Set NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY');
const signer = KeyPairSigner.fromSecretKey(privateKey);
const account = new Account(accountId, provider, signer);
// Equivalent: new Account(accountId, provider, privateKey)
```

Use an existing account and a prefixed key authorized on it. These environment-variable names are application conventions; the SDK does not read them automatically. An account without a signer can inspect state and construct unsigned transactions, but cannot sign them. Subsequent snippets reuse this `account` and `provider` unless they define their own.

## Method names and parameters

Provider and account convenience methods often accept named argument objects. Low-level action creators and constructors still use positional arguments; there is no blanket conversion of every function to an object parameter.

| Earlier API | v7 API |
| --- | --- |
| `account.functionCall({ ... })` | `account.callFunction({ ... })` for the decoded result; `callFunctionRaw({ ... })` for the outcome |
| `account.sendMoney(receiverId, amount)` | `account.transfer({ receiverId, amount })` |
| `account.state()` | `account.getState()` with grouped bigint balances and camelCase fields |
| `account.getAccountBalance()` | `account.getBalance()` for available native balance; `(await account.getState()).balance` for its breakdown |
| `account.createAccount(id, key, amount)` | `account.createAccount({ newAccountId: id, publicKey: key, nearToTransfer: amount })` |

For a view call, use **`contractId`**, **`method`**, and **`blockQuery`**:

**Before (v6):**
```typescript
const messages = await provider.callFunction(
  'guestbook.near-examples.testnet', 'get_messages', {}, { finality: 'final' }
);
```

**After:**
```typescript
const messages = await provider.callFunction({
  contractId: 'guestbook.near-examples.testnet',
  method: 'get_messages',
  args: {},
  blockQuery: { finality: 'final' },
});
```

For a particular block, use `blockQuery: { blockId: blockHashOrHeight }`. Access-key queries instead use `finalityQuery: { finality: 'final' }`. Generic result types describe the expected JSON shape; they do not perform runtime validation.

For a transaction, use **`methodName`**:

```typescript
import { nearToYocto, teraToGas } from 'near-api-js';

const outcome = await account.callFunctionRaw({
  contractId: 'guestbook.near-examples.testnet',
  methodName: 'add_message',
  args: { text: 'Hello!' },
  gas: teraToGas('30'),
  deposit: nearToYocto('0.1'),
  waitUntil: 'FINAL',
});
console.log(outcome.status);
```

The default transaction wait status is `EXECUTED_OPTIMISTIC`; choose `waitUntil` explicitly if your application needs a different execution/finality guarantee. Views default to optimistic finality.

## Contract wrappers

Replace the older `new Contract(account, contractId, { viewMethods, changeMethods })` wrapper with the object constructor. View methods live under `contract.view`; state-changing methods live under `contract.call` and receive an explicit signing account:

```typescript
import { Contract } from 'near-api-js';

const contract = new Contract({ contractId: 'guestbook.near-examples.testnet', provider });
const messages = await contract.view.get_messages({ args: {} });
await contract.call.add_message({ account, args: { text: 'Hello!' } });
```

Pass an `abi` to the constructor for inferred method/argument types and ABI-based argument checks. Without an ABI, method names are dynamic and the wrapper cannot check them against the contract interface.

## Amounts and gas

Use `bigint` for exact yoctoNEAR amounts and gas units. The older `utils.format.parseNearAmount()` returned a decimal string or `null`; `nearToYocto()` returns a `bigint` and throws on invalid input. `formatNearAmount()` becomes `yoctoToNear()`; review formatting differences in displayed values.

**Before:**
```typescript
import { utils } from 'near-api-js';

const amount = utils.format.parseNearAmount('0.1');
```

**After:**
```typescript
import { nearToYocto, yoctoToNear, teraToGas, gigaToGas } from 'near-api-js';

const amount = nearToYocto('0.1'); // 100000000000000000000000n
const display = yoctoToNear(amount);
const gas = teraToGas('30');
const oneGigaGas = gigaToGas('1');
await account.transfer({ receiverId: 'receiver.testnet', amount });
```

Prefer decimal strings when converting human-readable amounts. `JSON.stringify()` does not serialize bigint values by default; convert them to strings explicitly when storing application data.

## Transaction building and signing

Import `actions` instead of `actionCreators`. Action creators still accept positional arguments:

**Before:**
```typescript
import { actionCreators } from '@near-js/transactions';

const { transfer, functionCall } = actionCreators;
```

**After:**
```typescript
import { actions, nearToYocto, teraToGas } from 'near-api-js';

await account.signAndSendTransaction({
  receiverId: 'guestbook.near-examples.testnet',
  actions: [actions.functionCall('add_message', { text: 'Hello!' }, teraToGas('30'), nearToYocto('0.1'))],
});
```

`signTransaction()` and `signDelegateAction()` return named objects rather than the older `[hash, signedObject]` tuples:

```typescript
import { actions, KeyPairSigner, type KeyPairString } from 'near-api-js';

const privateKey = process.env.NEAR_PRIVATE_KEY as KeyPairString | undefined;
if (!privateKey) throw new Error('Set NEAR_PRIVATE_KEY');
const signer = KeyPairSigner.fromSecretKey(privateKey);
const transaction = await account.createTransaction({
  receiverId: 'receiver.testnet',
  actions: [actions.transfer(1n)],
  publicKey: await signer.getPublicKey(),
});
const { txHash, signedTransaction } = await signer.signTransaction(transaction);
console.log(txHash);
await provider.sendTransaction(signedTransaction);
```

The delegate result is `{ delegateHash, signedDelegate }`. In 7.5, `SignedDelegate.encode()` / `.decode()` and `encodeSignedDelegate()` / `decodeSignedDelegate()` support transport as Borsh bytes. Decoding does not verify the signature or chain validity.

## Custom signers and keystores

`Signer` is an abstract class. A custom signer must implement **both** `getPublicKey(): Promise<PublicKey>` and the protected `signBytes(bytes: Uint8Array): Promise<Uint8Array>`. The base class supplies transaction, delegate-action, and NEP-413 signing. `KeyPairSigner` implements these methods for in-memory keys; `MultiKeySigner` rotates multiple keys.

V7 does not export `keyStores` or `connect()`. A legacy keystore is not itself a v7 signer. If retaining `@near-js/keystores`, retrieve the key and import its encoded private key into `KeyPairSigner.fromSecretKey()`, or write a `Signer` adapter. For filesystem credentials, load the JSON in your Node application and pass its `private_key` to that method. Keep filesystem access and private keys out of browser applications.

## NEP-413 messages

Prefer `signMessage()` and `verifyMessage()` from `near-api-js/nep413` over the deprecated `Account.signNep413Message()` wrapper. Verification checks the signature and that the key has full-access permission on the account. Challenge generation, nonce reuse protection, and checking the expected recipient remain application responsibilities.

```typescript
import { signMessage, verifyMessage } from 'near-api-js/nep413';

const payload = {
  message: 'Sign in',
  recipient: 'example.com',
  nonce: crypto.getRandomValues(new Uint8Array(32)),
};
const signed = await signMessage({ signerAccount: account, payload });
await verifyMessage({
  signerAccountId: signed.accountId,
  signerPublicKey: signed.publicKey,
  payload,
  signature: signed.signature,
  provider,
});
```

## Errors and binary data

Use exported error classes rather than matching legacy error strings or `.type` values. For example, contract panics expose `HostGuestPanicError.panicMessage`. Failed submitted transactions attach the full RPC response as `transactionResult`; read-only errors do not have transaction receipts.

```typescript
import { HostGuestPanicError } from 'near-api-js/rpc-errors';

try {
  await account.callFunction({ contractId: 'contract.testnet', methodName: 'some_method', args: {} });
} catch (error) {
  if (error instanceof HostGuestPanicError) {
    console.error(error.panicMessage);
  } else {
    throw error;
  }
}
```

See [Handling transaction failures](README.md#handling-transaction-failures) for inspecting failed receipt IDs, receiver accounts, and logs through `transactionResult`, or retrieving outcomes by transaction hash.

Binary inputs and signatures use `Uint8Array`; check code that depends on Buffer-specific methods. Use the documented encoding helpers when transporting bytes as base58/base64.

## Removed packages and final checks

`@near-js/iframe-rpc`, `@near-js/biometric-ed25519`, `@near-js/client`, `@near-js/cookbook`, and bundled keystore implementations are not included in v7. Applications using those APIs require their own replacement or a separately retained dependency.

After updating imports and calls, compile your application and run its tests. Check bigint serialization, decoded results versus raw outcomes, signer return shapes, and permission failures. Validate transaction flows with local sandbox or an account you control before deploying.

See the [README](README.md), [API reference](https://near.github.io/near-api-js/), and [release notes](https://github.com/near/near-api-js/releases) for new functionality, including gas keys, global contracts, and deterministic/universal accounts.
