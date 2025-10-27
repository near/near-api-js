---
"@near-js/accounts": patch
"near-api-js": minor
"@near-js/cookbook": patch
---

Fix InMemorySigner compatibility and add connectReadOnly() API

This changeset addresses a critical bug where read-only connections using custom headers would fail with "Unknown signer type InMemorySigner" after the InMemorySigner class was removed in v2.0.

**Bug Fix (patch for @near-js/accounts):**
- Fixed getSigner() to handle null/undefined signers
- Updated Connection class to accept Signer | null
- Improved error messages with actionable guidance
- Fixed near.ts to use KeyPairSigner instead of InMemorySigner

**New Feature (minor for near-api-js):**
- Added connectReadOnly() function for explicit read-only blockchain access
- Introduced ReadOnlyConnectionConfig interface
- Provides clear migration path from deprecated connect() function
- Supports custom headers for API key authentication

**Documentation (patch for @near-js/cookbook):**
- Added comprehensive read-only connection example
- Demonstrates account queries, view functions, and parallel operations
- Shows API key authentication patterns

This change maintains backward compatibility while providing a modern API for read-only operations.
