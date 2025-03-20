---
"@near-js/client": patch
"@near-js/transactions": patch
---

client: The signer implementation was incorrectly handling transactions by not hashing the encoded transaction before signing

transactions: Non trivial arguments given to the test so people could use them as an example.