---
"@near-js/signers": patch
---

Refactor NEP-413 hash logic and add related unit tests

- Extracted new method `getPayloadHashForNEP413` into a reusable utility function to improve separation of concerns
- Updated `KeyPairSigner.signNep413Message` to use the shared utility
- Added unit test to verify NEP-413-compliant payload hash generation
- Added unit test to verify signature correctness using the computed payload hash