---
'near-api-js': patch
---

FailoverRpcProvider: return an empty `callFunction` result instead of failing over

A view call that returns nothing decodes to `undefined`, the one result the
`Provider` contract marks optional. `withBackoff` treated it as a provider
failure, so the call exhausted every provider and threw `RetriesExceeded`
instead of returning the answer. The skip path also never advanced to the next
provider, so the other methods re-queried the same one.
