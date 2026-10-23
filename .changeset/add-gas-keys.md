---
"near-api-js": minor
---

feat: add gas key (NEP-611) permissions and `TransferToGasKey` / `WithdrawFromGasKey` actions

- automatically detect gas keys and rotate their nonce lanes when using `Account`, including convenience methods and batch sending; low-level `createTransaction` still accepts an explicit `nonceIndex`
- add `Provider.viewGasKeyNonces`
- regenerate RPC types from nearcore 2.13.4 and parse the new gas key errors
- remove the `EXPERIMENTAL_view_gas_key` / `EXPERIMENTAL_view_gas_key_list` methods, dropped by nearcore
- deprecate `GasKeyAlreadyExistsActionError`, `GasKeyPermissionInvalidActionError` and `GasKeyTooManyNoncesRequestedActionError`
