---
"near-api-js": major
---

Remove no longer needed error utils like `getErrorTypeFromErrorMessage`, `parseRpcError`, `parseResultError`, etc  from the package as errors are now handled internally thanks to strongly typed RPC errors and end users can simply catch them in their application using specific error classes imported from `rpc-errors` sub-path
