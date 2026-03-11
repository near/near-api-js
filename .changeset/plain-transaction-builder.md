---
"near-api-js": minor
---

Add plain transaction builder types and mappers: `PlainTransaction`, `PlainAction`, `PlainAccessKey`, `PlainSignedTransaction` interfaces for JSON-friendly transaction construction, plus `mapTransaction`, `mapAction`, and `mapSignedTransaction` functions to convert them into borsh-serializable format. This enables wallet implementations to build and serialize transactions without importing class-based APIs.
