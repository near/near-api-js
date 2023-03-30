---
"near-api-js": major
"@near-js/accounts": patch
"@near-js/crypto": patch
"@near-js/keystores": patch
"@near-js/keystores-browser": patch
"@near-js/keystores-node": patch
"@near-js/providers": patch
"@near-js/signers": patch
"@near-js/transactions": patch
"@near-js/types": patch
"@near-js/utils": patch
"@near-js/wallet-account": patch
---

Major functionality in near-api-js has now been broken up into packages under @near-js

Breaking changes:
 - `KeyPairEd25519` no longer supports the `fromString` static method. This method is now only available on the `KeyPair` class.
