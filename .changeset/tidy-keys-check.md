---
"near-api-js": patch
---

Reject `ed25519:` public keys that are not 32 bytes instead of silently parsing 64 byte ones as secp256k1
