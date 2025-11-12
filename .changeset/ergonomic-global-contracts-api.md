---
"@near-js/accounts": minor
"@near-js/cookbook": minor
---

feat: add ergonomic global contracts API

Adds new methods `publishContract()` and `deployFromPublished()` that provide a more ergonomic API for global contracts, matching the improvements in near-sdk-rs.

**New methods:**
- `publishContract(code, accountId?)` - Publish contract code to global registry (immutable if accountId omitted, mutable if provided)
- `deployFromPublished(reference)` - Deploy from published code using discriminated unions for type safety

**Deprecated methods (still functional):**
- `deployGlobalContract()` - Use `publishContract()` instead
- `useGlobalContract()` - Use `deployFromPublished()` instead

Migration example:
```typescript
// Before
await account.deployGlobalContract(code, "codeHash");
await account.useGlobalContract({ codeHash });

// After
await account.publishContract(code);
await account.deployFromPublished({ codeHash });
```
