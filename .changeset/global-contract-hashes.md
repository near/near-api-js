---
"near-api-js": patch
---

Accept RPC base58 code hashes in global-contract use actions while preserving 64-character hexadecimal and raw-byte inputs. Encode raw-byte hashes as base58 when querying global contract code.
