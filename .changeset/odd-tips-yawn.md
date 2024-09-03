---
"@near-js/accounts": minor
"@near-js/biometric-ed25519": minor
"@near-js/crypto": minor
"@near-js/iframe-rpc": minor
"@near-js/keystores": minor
"@near-js/keystores-browser": minor
"@near-js/keystores-node": minor
"near-api-js": major
"@near-js/providers": major
"@near-js/signers": minor
"@near-js/transactions": minor
"@near-js/types": minor
"@near-js/utils": major
"@near-js/wallet-account": minor
---

Update to Node.js 20 LTS & pnpm 9.4, modularize packages, simplify dependencies, and update tests

**Breaking Changes**

- `near-api-js@5.0.0`
  - The following functions are no longer exported:
    - `logWarning`
    - `fetchJson`
    - the unnamed wrapped `fetch` function exported from `setup-node-fetch.ts`
  - The browser bundle is no longer being built in version 5; for browser support please use modules

- `@near-js/providers@1.0.0`
  - The following functions are no longer exported:
    - `fetchJson`

- `@near-js/utils@1.0.0`
  - The following functions are no longer exported:
    - `logWarning`