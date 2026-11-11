---
"near-api-js": minor
---

Add optional `limit` and `afterKey` parameters to `Account.getAccessKeyList()` so callers can paginate access keys on accounts exceeding the RPC node's unpaginated key limit. Existing no-argument calls and the single-page return shape are preserved.
