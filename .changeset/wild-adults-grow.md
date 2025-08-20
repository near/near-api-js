---
"@near-js/signers": major
---

Refactored signer: move all logic into abstract signer, and expose only protected 'signBytes' that need to be implemented
    
Separate NEP-413 hash logic and add related unit tests
