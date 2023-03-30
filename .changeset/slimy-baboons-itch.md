---
"near-api-js": major
---

Major functionality in near-api-js has now been broken up into packages under @near-js

Breaking changes:
 - `KeyPairEd25519` no longer supports the `fromString` static method. This method is now only available on the `KeyPair` class.
