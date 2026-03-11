---
"near-api-js": minor
---

Inline borsh serializer: replace the `borsh` npm dependency with a lean 289-line zero-dep serializer/deserializer tailored to NEAR's schema needs. The `serialize` and `deserialize` functions maintain the same API. This eliminates a transitive dependency tree and reduces install footprint.
