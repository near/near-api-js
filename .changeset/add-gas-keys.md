---
"near-api-js": minor
---

feat: add gas key (NEP-611) permissions and `TransferToGasKey` / `WithdrawFromGasKey` actions

- sign with gas keys: pass `nonceIndex` to `signAndSendTransaction` / `createTransaction` to build a `TransactionV1`, nonces are tracked per lane
- add `Provider.viewGasKeyNonces`
- regenerate RPC types from nearcore 2.13.4 and parse the new gas key errors
- remove the `EXPERIMENTAL_view_gas_key` / `EXPERIMENTAL_view_gas_key_list` methods, dropped by nearcore
- deprecate `GasKeyAlreadyExistsActionError`, `GasKeyPermissionInvalidActionError` and `GasKeyTooManyNoncesRequestedActionError`
