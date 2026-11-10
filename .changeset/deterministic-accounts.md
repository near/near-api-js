---
"near-api-js": minor
---

Add NEP-616 deterministic account support: canonical state-init encoding and account-ID derivation, the DeterministicStateInit transaction action, and Account.createDeterministicAccount(). Storage deposits cover storage staking and refund any excess; they do not fund the account's spending balance.
