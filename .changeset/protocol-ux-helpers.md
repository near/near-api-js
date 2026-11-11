---
"near-api-js": minor
---

Expose global contract references from `Account.getState()` and add `decodeSignedDelegate()` for Borsh-encoded meta transactions.

Export `SignedDelegate` with `encode()` and `decode()` methods, reject trailing bytes and nested or reserved delegate tags when decoding signed delegates, and restore `Signature` instances when decoding signed transactions.
