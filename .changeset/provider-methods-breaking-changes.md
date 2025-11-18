---
"near-api-js": major
---

**Breaking changes to provider and utility methods:**

- `parseNearAmount` no longer accepts `undefined` and now throws an error for empty strings instead of silently treating them as zero
- Renamed `viewValidatorsV2` back to `viewValidators` with improved signature that accepts `{ blockId } | { epochId } | null`
- Added default `waitUntil='EXECUTED_OPTIMISTIC'` parameter for `viewTransactionStatus` and `viewTransactionStatusWithReceipts`
