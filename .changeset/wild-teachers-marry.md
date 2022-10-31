---
"near-api-js": patch
---

Fix error types. WIth this changes both `JsonRpcProvider.query` and `JsonRpcProvider.sendJsonRpc` methods will return proper error type for these errors: `AccountDoesNotExist`, `AccessKeyDoesNotExist`, `CodeDoesNotExist`, `InvalidNonce`.

An additional fix to `getErrorTypeFromErrorMessage` function. Now `getErrorTypeFromErrorMessage` will not change error type if it already exists. 
