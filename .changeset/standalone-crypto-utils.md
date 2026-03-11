---
"near-api-js": minor
---

Add standalone crypto utilities: `sha256`, `curveFromKey`, `keyFromString`, `keyToString`, `publicKeyFromPrivate`, `privateKeyFromRandom`, `signHash`, `signBytes`, and the `KeyCurve` type. These are exported from the top-level `near-api-js` entry point, enabling downstream consumers to use lightweight crypto helpers without constructing `KeyPair` class instances. Also adds `parseRpcError` re-export from providers and `actionCreators` alias for backwards compatibility with `@near-js/transactions`.
