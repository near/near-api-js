---
"@near-js/biometric-ed25519": patch
---

This PR fixes a bug with the getKeys method in the biometric-ed25519 package. This method is currently broken due to not awaiting an async function and trying to access undefined properties on the promise.
