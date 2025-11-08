---
"near-api-js": major
---

**BREAKING CHANGE: Consolidate all @near-js/* packages into near-api-js**

This major version consolidates all NEAR JavaScript functionality into a single, tree-shakeable `near-api-js` package, addressing the #1 developer complaint about confusion over which `@near-js/*` packages to use.

## Breaking Changes

### Removed Legacy APIs

- **Removed `utils.format.parseNearAmount()`**: Use `parseNearAmount()` directly
  ```typescript
  // Before
  import { utils } from 'near-api-js';
  utils.format.parseNearAmount('1');

  // After
  import { parseNearAmount } from 'near-api-js';
  parseNearAmount('1');
  ```

- **Removed `Near` class**: Use `Account` class directly
- **Removed `connect()` helper**: Construct classes directly
- **Removed subpath imports**: All old subpaths like `near-api-js/lib/utils/rpc_errors` no longer work

### Changed Package Structure

- Build output moved from `lib/` to `lib/esm/` and `lib/commonjs/`
- Removed all duplicate implementation files
- Removed backward compatibility layers

## Migration Guide

### From @near-js/* packages

If you were using individual `@near-js/*` packages, migration is simple - just change the import source:

```typescript
// Before
import { Account, Contract } from '@near-js/accounts';
import { KeyPair } from '@near-js/crypto';
import { parseNearAmount } from '@near-js/utils';

// After
import { Account, Contract, KeyPair, parseNearAmount } from 'near-api-js';
```

All exports have the same names and functionality - only the package source changes.

### From old near-api-js (v5.x)

If you were using the old `near-api-js` package, update your imports to use the flat structure:

```typescript
// Before
import { utils, keyStores } from 'near-api-js';
const amount = utils.format.parseNearAmount('1');
const keyStore = new keyStores.InMemoryKeyStore();

// After
import { parseNearAmount, keyStores } from 'near-api-js';
const amount = parseNearAmount('1');
const keyStore = new keyStores.InMemoryKeyStore();
```

## New Features

✅ **Simple Developer Experience**: One package to install, everything in one place
✅ **Tree-Shakeable**: Bundlers only include what you use
✅ **Modern Build**: Dual format (ESM + CJS) with proper type declarations
✅ **No Circular Dependencies**: Clean package structure
✅ **Full TypeScript Support**: Complete type definitions included

## What's Included

- **Types** - Core TypeScript types
- **Utils** - Formatting, parsing, logging, validation
- **Crypto** - Key pairs, signing, verification
- **Transactions** - Transaction building and signing
- **Providers** - RPC providers with failover support
- **Signers** - Transaction signing interfaces
- **Accounts** - Account management and contract interactions
- **Keystores** - Key storage (browser and Node.js)
- **Tokens** - FT and NFT standard support
- **Biometric Auth** - WebAuthn support
- **IFrame RPC** - Wallet integration helpers
