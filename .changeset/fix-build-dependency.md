---
"@near-js/accounts": patch
"@near-js/biometric-ed25519": patch
"@near-js/client": patch
"@near-js/cookbook": patch
"@near-js/crypto": patch
"@near-js/iframe-rpc": patch
"@near-js/keystores": patch
"@near-js/keystores-browser": patch
"@near-js/keystores-node": patch
"@near-js/providers": patch
"@near-js/signers": patch
"@near-js/transactions": patch
"@near-js/types": patch
"@near-js/utils": patch
---

Remove unused build package and clean up workspace dependencies. The build package contained an unused cjsify utility that was replaced by tsup for CommonJS output generation.