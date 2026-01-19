# Migrating from @near-js to near-api-js

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

## Transaction Building

In `near-api-js` you could import the `actionsCreator`, it has now been moved to a named export `actions`.

**Before:**
```typescript
import { actions as actionCreators } from '@near-js/transactions';

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

## Renamed Functions

### parseNear and formatNear
`near-js/utils` used to have the functions `parseNear` and `formatNear`, they have now been renamed to
`yoctoToNear` and `nearToYocto`, and they can be imported from `near-api-js` directly.

**Before:**
```typescript
import { utils: {parseNear, formatNear} } from 'near-api-js';
```

**After:**
```typescript
import { yoctoToNear, nearToYocto } from 'near-api-js';
```

### viewValidatorsV2
The function `viewValidatorsV2` has been renamed to `viewValidators`.

---

## Removed Packages

All deprecated packages have been removed:
- `@near-js/iframe-rpc`
- `@near-js/biometric-ed25519`
- `@near-js/client`
- `@near-js/cookbook`
- `@near-js/keystores`
