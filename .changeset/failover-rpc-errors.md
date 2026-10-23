---
'near-api-js': patch
---

Preserve all provider errors in attempt order on `FailoverRpcError.errors`.
Return valid empty view-call results without retrying or throwing `RetriesExceeded`.
