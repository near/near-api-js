---
"near-api-js": patch
---

ML-DSA-65 secret keys now follow the NEP-645 string encoding. `KeyPairMLDSA65` accepts the canonical 32-byte FIPS 204 seed, generates and stores new keys in that form, rejects every other length, and validates an imported 4032-byte expanded key against FIPS 204 Algorithm 6 (s1 and s2 ranges, t0, t1 and tr) so a corrupted key is refused instead of producing signatures that never verify.
