---
'near-api-js': patch
---

Preserve all provider errors in attempt order on `FailoverRpcError.errors`.
Return valid empty view-call results without retrying or throwing `RetriesExceeded`.
Try subsequent providers after account-not-found errors. If all providers fail, throw
`FailoverRpcError` with the original errors in `.errors`, including `AccountDoesNotExistError`.
