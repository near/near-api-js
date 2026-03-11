---
"near-api-js": minor
---

Add lightweight browser shims for the IIFE bundle: `error-parse-lite.ts` replaces the ~62KB error class hierarchy with a generic `RpcError` parser (preserving `InvalidNonceError` for nonce retry logic), `json-validator-noop.ts` stubs out the ~44KB `is-my-json-valid` dependency, and `util.ts` provides a minimal `util.format` shim. These save ~116KB in the browser bundle while maintaining full functionality in ESM/CJS builds.
