---
"near-api-js": patch
---

Attach finalized `blockHash` to transaction created using `Account.createTransaction` to prevent `TransactionExpiredError` errors.

Previously, transactions could be created with a `blockHash` that had not yet fully propagated across the network. In some cases, receiver RPC nodes were unable to look up the referenced block, resulting in `TransactionExpiredError` failures (often due to a small propagation delay of a few milliseconds).
