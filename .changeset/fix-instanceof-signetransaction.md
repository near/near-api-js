---
"@near-js/transactions": patch
---

Fix instanceof check for SignedTransaction to prevent cross-package version errors

Replace instanceof check with duck typing to avoid failures when different package versions are used across dependencies. The change from `transaction instanceof SignedTransaction` to `'signature' in transaction` maintains the same functionality while being more robust against version mismatches.