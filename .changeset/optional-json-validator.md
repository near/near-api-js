---
"near-api-js": minor
---

Make `is-my-json-valid` an optional dependency: ABI schema validation via `validateArguments` is now async and dynamically imports `is-my-json-valid` with a try/catch fallback. Environments without it installed will skip validation silently. The `ValidationError` type is inlined in `src/accounts/errors.ts`. Consumers using typed contracts with ABI validation should add `is-my-json-valid` to their own dependencies.
