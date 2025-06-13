---
"@near-js/accounts": minor
"@near-js/transactions": minor
"@near-js/cookbook": patch
---

feat: add global contracts support to Account class

Add `deployGlobalContract()` and `useGlobalContract()` methods to the Account class with simplified APIs for NEP-591 global contracts support.

- `deployGlobalContract(code, deployMode)` accepts "codeHash" or "accountId" string literals
- `useGlobalContract(contractIdentifier)` auto-detects string (account ID) or Uint8Array (code hash) parameters
- Includes cookbook example demonstrating usage patterns

This enables developers to easily deploy and use global contracts without manually creating complex type objects.