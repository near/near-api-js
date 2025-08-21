---
"@near-js/signers": patch
---

Refactored signer: move all logic into abstract signer, and expose only protected 'signBytes' that need to be implemented
    
Add unit tests to verify nep413MessageSignature 
