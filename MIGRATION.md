# Migrating from @near-js to near-api-js

This guide will help you migrate your project from using the deprecated `@near-js/*` packages

## Package Imports
The `near-api-js v7` package now exposes for most functions from `@near-js/*` packages. Minimal code
was changed as part of this migration, so if you are using `near-api-js v6`, once changing
`@near-js/<>` for `near-api-js` your imports will continue to resolve correctly.

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

---

## Function Parameters

In previous versions of `@near-js`, some functions accepted inline parameters, while some others accepted object parameters.

In `near-api-js`, all functions that accept multiple parameters now accept a single object parameter.

**Before:**
```typescript
provider.callFunction(accountId, method, args, finality);
```

**After:**
```typescript
provider.callFunction({ accountId, method, args, finality });
```

---

## Transaction Building

In `near-api-js` you could import the `actionsCreator` to help you create `Action`s for transactions, it has now been moved to a named export `actions`.

**Before:**
```typescript
import { actionCreators } from '@near-js/transactions';

const { transfer, functionCall } = actionCreators;
```

**After:**
```typescript
import { actions } from 'near-api-js';
const { transfer, functionCall } = actions;
```

---

## Signers

The `Signer` interface was changed, so now devs only need to implement the `signBytes` method (though, `signNEP413Message`, `signTransaction` can still be overridden if needed).

---

## Near / Yocto Conversion Utilities
`@near-js/utils` used to have the functions `parseNear` and `formatNear`,
they have now been renamed to `yoctoToNear` and `nearToYocto`, and they
can be imported from `near-api-js` directly.

**Before:**
```typescript
import { utils: {parseNear, formatNear} } from 'near-api-js';
```

**After:**
```typescript
import { yoctoToNear, nearToYocto } from 'near-api-js';
```

## Gas Conversion Utilities
`@near-js` did not have any type of gas conversion utilities, now `near-api-js` includes
`teraToGas` and `gigaToGas` functions to convert TeraGas and GigaGas to Gas units.

**Before:**
```typescript
import { utils: {parseNear} } from 'near-api-js';

account.callFunction({
  contractId: 'example.testnet',
  methodName: 'some_method',
  args: {},
  gas: '30000000000000',        // 30 TeraGas, maybe?
  deposit: parseNear('0.1'),    // or was formatNear?
});
```

**After:**
```typescript
import { teraToGas, nearToYocto } from 'near-api-js';

account.callFunction({
  contractId: 'example.testnet',
  methodName: 'some_method',
  args: {},
  gas: teraToGas('30'),         // 30 TeraGas
  deposit: nearToYocto('0.1'),  // 0.1 NEAR
});
```

---

## KeyStores
`near-api-js` does not include any `KeyStore` implementation by default, but it should still be fully compatible with the `@near-js/keystores` implementations.

---

## Removed Packages

All deprecated packages have been removed:
- `@near-js/iframe-rpc`
- `@near-js/biometric-ed25519`
- `@near-js/client`
- `@near-js/cookbook`
- `@near-js/keystores`
